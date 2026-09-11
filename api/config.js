const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./lib/mongodb');

/**
 * Dynamic Config Endpoint (/api/config.js or /api/config)
 *
 * Serves the live portfolio configuration directly from MongoDB Atlas.
 * Can be loaded as a synchronous <script src="/api/config.js"></script> tag
 * in <head> so browsers (including Incognito tabs) receive the latest
 * theme, avatar, bio, and projects on their very first paint without any
 * flash of old theme or dual-layer rendering.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  );

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  let finalConfig = null;

  // 1. Try fetching from MongoDB Atlas
  try {
    const { db } = await connectToDatabase();
    const doc = await db.collection('config').findOne({ _id: 'portfolio_config' });
    if (doc && doc.config) {
      finalConfig = doc.config;
    }
  } catch (mErr) {
    console.warn('MongoDB live config fetch warning:', mErr.message);
  }

  // 2. Fallback: Read static frontend/config.js from disk
  if (!finalConfig) {
    try {
      const configPath = path.join(process.cwd(), 'frontend', 'config.js');
      if (fs.existsSync(configPath)) {
        const fileContent = fs.readFileSync(configPath, 'utf8');
        const match = fileContent.match(/CONFIG\s*=\s*(\{[\s\S]*?\});/);
        if (match) {
          finalConfig = eval('(' + match[1] + ')');
        }
      }
    } catch (fErr) {
      console.warn('Fallback config.js read error:', fErr.message);
    }
  }

  if (!finalConfig) {
    finalConfig = {};
  }

  const url = req.url || '';
  const isJson = url.includes('format=json') || (req.headers.accept && req.headers.accept.includes('application/json') && !url.includes('.js'));

  if (isJson) {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=5, stale-while-revalidate=30');
    return res.status(200).json({ success: true, config: finalConfig });
  }

  // Return executable JavaScript defining window.CONFIG and CONFIG
  res.setHeader('Content-Type', 'application/javascript; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=5, stale-while-revalidate=30');
  const jsPayload = `if (typeof window !== 'undefined') { window.CONFIG = ${JSON.stringify(finalConfig)}; }\nvar CONFIG = (typeof window !== 'undefined' && window.CONFIG) ? window.CONFIG : ${JSON.stringify(finalConfig)};\n`;
  return res.status(200).send(jsPayload);
};
