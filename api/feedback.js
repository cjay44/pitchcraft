// api/feedback.js
// Fires when a beta tester submits the feedback form
// 1. Creates record in Beta Feedback table
// 2. Updates matching Beta Tester record — ticks Feedback Submitted, fills NPS score

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.AIRTABLE_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'Not configured' });

  const {
    name, email, submittedAt,
    outputQualityRating, outputSoundsSendable,
    proposalStructureRating, proposalMissingElements,
    uxFlowRating, uxFrictionPoints,
    wouldPay, whatWouldMakeThemPay,
    npsRating, topImprovement,
  } = req.body;

  const BASE_ID         = 'apptiaDsYjQeRdueJ';
  const FEEDBACK_TBL    = 'tblwYV2WfcDxY0Y6P'; // Beta Feedback
  const BETA_TESTERS_TBL = 'tblJiLmXDqYE5yAoP'; // Beta Testers
  const today = new Date().toISOString().split('T')[0];

  try {
    // 1. Create Beta Feedback record
    const feedbackRes = await fetch(`https://api.airtable.com/v0/${BASE_ID}/${FEEDBACK_TBL}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fields: {
          'fldjKTkOAU5Mf5Y0z': name || '',
          'fldp0wcwqZH0nZJVh': email || '',
          'fldTvVkMtGl8Kdvk5': submittedAt || new Date().toISOString(),
          'fldQFIxVfnsLdIwag': outputQualityRating || null,
          'fldd5iH0napvSp7za': outputSoundsSendable || '',
          'fldkcYXHLHYmDlxLw': proposalStructureRating || null,
          'fldQmdCeXf0XolydS': proposalMissingElements || '',
          'fldc8LFzEniQPjc3C': uxFlowRating || null,
          'fldK1uWIbXaimXeKt': uxFrictionPoints || '',
          'fld3fULkQ44nUpe5G': wouldPay || '',
          'fldzjAJZMNl17kIpz': whatWouldMakeThemPay || '',
          'fldMuMMjDy9boFHvd': npsRating || null,
          'fldi9sU9nM6kAFXhu': topImprovement || '',
        },
      }),
    });

    const feedbackData = await feedbackRes.json();
    if (!feedbackRes.ok) {
      console.error('Airtable feedback error:', feedbackData);
      return res.status(feedbackRes.status).json({ error: 'Failed to save feedback' });
    }

    // 2. Find matching Beta Tester by email and update their record
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
              'fldqCUbYtuOiFb1ro': true,           // Feedback Submitted
              'fldWGn2trRm5JIjQ6': npsRating || null, // NPS Score
              'fldygbZBvECtgG3eA': today,           // Last Active
            },
          }),
        });
      }
    }

    return res.status(200).json({ success: true, id: feedbackData.id });
  } catch (err) {
    console.error('Feedback error:', err);
    return res.status(500).json({ error: 'Failed to save feedback' });
  }
}
