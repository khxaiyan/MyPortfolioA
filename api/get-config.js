const fs = require('fs');
const path = require('path');
const { connectToDatabase } = require('./lib/mongodb');

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

  try {
    // 1. Try to fetch from MongoDB
    try {
      const { db } = await connectToDatabase();
      const doc = await db.collection('config').findOne({ _id: 'portfolio_config' });
      if (doc && doc.config) {
        return res.status(200).json({
          success: true,
          source: 'mongodb',
          config: doc.config,
          updatedAt: doc.updatedAt
        });
      }
    } catch (mErr) {
      console.warn('MongoDB fetch fallback:', mErr.message);
    }

    // 2. Fallback: read frontend/config.js
    const configPath = path.join(process.cwd(), 'frontend', 'config.js');
    if (fs.existsSync(configPath)) {
      const fileContent = fs.readFileSync(configPath, 'utf8');
      const match = fileContent.match(/(?:const|var|let)?\s*CONFIG\s*=\s*(\{[\s\S]*?\});/);
      if (match) {
        const parsed = eval('(' + match[1] + ')');
        return res.status(200).json({
          success: true,
          source: 'local_file',
          config: parsed
        });
      }
    }

    return res.status(404).json({ error: 'No configuration found.' });
  } catch (err) {
    return res.status(500).json({ error: err.message || 'Error loading config' });
  }
};
