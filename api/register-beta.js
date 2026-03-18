// api/register-beta.js
// Fires when a user activates the beta code CRAFT2026
// Creates a record in the Beta Testers table automatically

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Not configured' });

  const { name, email, betaCode } = req.body;
  if (!betaCode) return res.status(400).json({ error: 'betaCode required' });

  const BASE_ID = 'apptiaDsYjQeRdueJ';
  const TABLE   = 'tblJiLmXDqYE5yAoP'; // Beta Testers

  const today = new Date().toISOString().split('T')[0];

  try {
    // Check if already registered by email to avoid duplicates
    if (email) {
      const checkRes = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${TABLE}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const checkData = await checkRes.json();
      if (checkData.records?.length > 0) {
        // Already exists — just update Last Active
        const existingId = checkData.records[0].id;
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}/${existingId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ fields: { 'fldygbZBvECtgG3eA': today } }),
        });
        return res.status(200).json({ success: true, existing: true });
      }
    }

    // Create new Beta Tester record
    const response = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${TABLE}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          'fldFmKUpMwQosC3wm': name || 'Beta Tester',   // Name
          'fldC0i1hiyPrCHQBB': email || '',              // Email
          'fldjcxEow4FdodwL4': 'Active',                 // Status
          'fldrjj3Jfk5FmSlk1': today,                    // Joined
          'fldWJv5S0ywvGLAvX': betaCode,                 // Beta Code Used
          'fldygbZBvECtgG3eA': today,                    // Last Active
        },
      }),
    });

    const data = await response.json();
    if (!response.ok) {
      console.error('Airtable error:', data);
      return res.status(response.status).json({ error: 'Failed to register' });
    }

    return res.status(200).json({ success: true, id: data.id });
  } catch (err) {
    console.error('Register beta error:', err);
    return res.status(500).json({ error: 'Failed to register' });
  }
}
