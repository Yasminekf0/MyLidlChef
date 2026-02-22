import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const groq = new Groq({ apiKey });
    const { budget, ingredients, surpriseMe } = req.body;

    const systemPrompt = `You are a JSON-only API. NEVER output markdown, code blocks, or explanations.
CRITICAL: Return ONLY a valid JSON object. ALL string values must be in double quotes.
For heroEmoji, return a simple text emoji inside double quotes like this: "heroEmoji": "🍝"
Never place an emoji outside of quotes.

Return ONLY raw JSON with exactly these fields:
- dishName: string (Danish recipe name)
- heroEmoji: string (one food emoji wrapped in quotes)
- funIntro: string (max 15 words, encouraging)
- ingredients: array of 5-7 objects with name, lidlProductName, price (number), onSale (boolean), checked (true)
- steps: array of 4-6 instruction strings
- totalCost: number (sum of prices)
- savings: number (approx 25% of sale items)

Use realistic Danish DKK prices. Include 2-3 sale items. Use fictional Lidl brands (Favorit, Pikok, Milbona, Combino, Fairglobe). Always healthy recipes. Stay under budget if given. Use provided ingredients where possible.`;

    let userPrompt = '';
    if (surpriseMe) {
      userPrompt = 'Surprise me with a healthy, budget-friendly recipe for a young person!';
    } else {
      const parts = [];
      if (budget) parts.push(`I have a budget of ${budget} DKK`);
      if (ingredients && ingredients.length > 0) parts.push(`I have these ingredients: ${ingredients.join(', ')}`);
      userPrompt = parts.length > 0 ? parts.join('. ') : 'Create a healthy recipe for me';
    }

    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    let content = message.choices[0].message?.content || '';

    // Strip markdown code blocks
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();

    // Fix unquoted emojis: "heroEmoji": 🍝 → "heroEmoji": "🍝"
    content = content.replace(/("heroEmoji"\s*:\s*)([^",\n\r{}\[\]]+)/g, (match, key, val) => {
      val = val.trim();
      if (!val.startsWith('"')) return `${key}"${val}"`;
      return match;
    });

    const recipe = JSON.parse(content);
    return res.status(200).json(recipe);

  } catch (error) {
    console.error('Error:', error?.message);
    return res.status(500).json({
      error: 'Oops, our chef is taking a break! 🍳 Try again.',
    });
  }
}
