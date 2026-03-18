// api/pro-interest.js
// Fires when a user clicks "Reserve my 50% discount"
// 1. Creates record in Pro Interest table
// 2. Updates matching Beta Tester record — ticks Interested in Pro

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) return res.status(200).json({ success: true }); // Silent fail — never block UI

  const { name, email, betaCode, submittedAt } = req.body;
  const BASE_ID          = 'apptiaDsYjQeRdueJ';
  const PRO_INTEREST_TBL = 'tblsMSJzWyrol6dPg';
  const BETA_TESTERS_TBL = 'tblJiLmXDqYE5yAoP';
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Create Pro Interest record
    await fetch(`https://api.airtable.com/v0/${BASE_ID}/${PRO_INTEREST_TBL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          'fldnLIVflTDOQWguT': name || email || 'Beta Tester',  // Name
          'fldEz9t3xGBHuf4P5': email || '',
          'fldGnquBbTIvM7YOd': submittedAt || new Date().toISOString(),
          'fldYySb8zxvC3XqNx': betaCode || 'CRAFT2026',
          'fldalHrvRZNqcs0nf': 'BETA50',
        },
      }),
    });

    // 2. Find matching Beta Tester by email and tick Interested in Pro
    if (email) {
      const findRes = await fetch(
        `https://api.airtable.com/v0/${BASE_ID}/${BETA_TESTERS_TBL}?filterByFormula=${encodeURIComponent(`{Email}="${email}"`)}`,
        { headers: { Authorization: `Bearer ${apiKey}` } }
      );
      const findData = await findRes.json();

      if (findData.records?.length > 0) {
        const recordId = findData.records[0].id;
        await fetch(`https://api.airtable.com/v0/${BASE_ID}/${BETA_TESTERS_TBL}/${recordId}`, {
          method: 'PATCH',
          headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({
            fields: {
              'fldUP36cJR8WgTmuX': true,  // Interested in Pro
              'fldygbZBvECtgG3eA': today, // Last Active
            },
          }),
        });
      }
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('Pro interest error:', err);
    return res.status(200).json({ success: true }); // Silent fail
  }
}
