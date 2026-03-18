export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const body = req.body || {};
    const apiKey = process.env.AIRTABLE_API_KEY;

    if (apiKey) {
      await fetch('https://api.airtable.com/v0/apptiaDsYjQeRdueJ/Pro%20Interest', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fields: {
            'Beta Code Used': body.betaCode || '',
            'Submitted At':   body.submittedAt || new Date().toISOString(),
            'Discount Code':  'BETA50',
          },
        }),
      });
    }
  } catch (_) {
    // Never surface errors to the client
  }

  return res.status(200).json({ success: true });
}
