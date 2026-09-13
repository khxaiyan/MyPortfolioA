const { connectToDatabase } = require('./lib/mongodb');
const { generateOgSvg } = require('./lib/og-generator');

/**
 * Dynamic Open Graph Template Endpoint (/api/og)
 * Serves real-time dynamic card based on current saved MongoDB config or query params.
 */
module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'image/svg+xml');
  res.setHeader('Cache-Control', 'public, max-age=60, s-maxage=60, stale-while-revalidate=86400');

  try {
    let currentConfig = {};

    // 1. Fetch latest config from MongoDB
    try {
      const { db } = await connectToDatabase();
      const doc = await db.collection('config').findOne({ _id: 'portfolio_config' });
      if (doc && doc.config) {
        currentConfig = doc.config;
      }
    } catch (_) {}

    // 2. Allow query param overrides if supplied (e.g. ?name=raza&accent=%23ff2a5f)
    if (req.query) {
      if (req.query.name) currentConfig.site_name = req.query.name;
      if (req.query.desc) currentConfig.site_desc = req.query.desc;
      if (req.query.accent) currentConfig.accent_color = req.query.accent;
      if (req.query.avatar) currentConfig.avatar_url = req.query.avatar;
    }

    const svg = generateOgSvg(currentConfig);
    return res.status(200).send(svg);
  } catch (err) {
    console.error('OG generation error:', err);
    const fallbackSvg = generateOgSvg({});
    return res.status(200).send(fallbackSvg);
  }
};
