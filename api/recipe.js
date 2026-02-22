import Groq from 'groq-sdk';

const apiKey = process.env.GROQ_API_KEY;

const LIDL_PRODUCTS = [
  { name: "Combino Tagliatelle pasta med æg SK4", price: 14.95 },
  { name: "Combino Farfalle", price: 11.95 },
  { name: "Combino Pasta i bronzeform HWG SK3", price: 11.95 },
  { name: "Combino Tagliatelle pasta korte", price: 12.95 },
  { name: "Italiamo Pizzamel", price: 12.95 },
  { name: "MADVÆRKET Danske skrabeæg, M/L", price: 27.95 },
  { name: "ROSE/VILSTRUPGÅRD Hakket kyllingekød eller kyllingebrystfilet", price: 59.0 },
  { name: "ROSE Hel kylling", price: 65.0 },
  { name: "ROSE Kyllingeoverlår eller -underlår", price: 22.0 },
  { name: "Chef Select Kyllingebrystfilet i strimler", price: 19.95 },
  { name: "Vilstrupgård Kyllingelårfilet", price: 34.95 },
  { name: "VITASIA Kyllingespyd med teriyaki", price: 20.0 },
  { name: "VILSTRUPGÅRD Hakket oksekød", price: 49.0 },
  { name: "Vilstrupgård Hakket oksekød 8-12% 400g", price: 47.95 },
  { name: "Vilstrupgård Hakket gris 8-12% (1000g)", price: 69.95 },
  { name: "VILSTRUPGÅRD Hakket gris og kalv", price: 12.0 },
  { name: "VILSTRUPGÅRD Stegeflæsk", price: 55.0 },
  { name: "Culinea Gyros af grisekød", price: 39.95 },
  { name: "Culinea Kyllingekebab (1-hjertet)", price: 29.95 },
  { name: "CULINEA Paneret schnitzel af grisekam", price: 25.0 },
  { name: "Dulano Bacon i strimler, røget", price: 22.95 },
  { name: "Pålægsslagteren Bacon sliced", price: 29.95 },
  { name: "Dulano Skinke m/svær el. peber SK3", price: 14.95 },
  { name: "VILSTRUPGÅRD Kalkunstrimler af brystfilet", price: 29.0 },
  { name: "LASCHINGER Hel lakseside", price: 75.0 },
  { name: "NAUTICA Røget eller gravad laks", price: 25.0 },
  { name: "VITASIA Sashimilaks", price: 35.0 },
  { name: "Nixe MSC Tun i olivenolie", price: 14.95 },
  { name: "Nixe MSC Tun i vand (ATG102g)", price: 9.95 },
  { name: "Ocean Sea MSC Grønlandsrejer S", price: 43.95 },
  { name: "DELUXE Tempurarejer", price: 35.0 },
  { name: "VITASIA Panerede rejer", price: 45.0 },
  { name: "HAVBLÅ Panerede alaskasej- eller fiskefileter", price: 29.0 },
  { name: "Ocean Sea MSC Alaska Sej", price: 74.95 },
  { name: "MADVÆRKET Danbo ost ML 45+ m. kommen", price: 57.95 },
  { name: "MADVÆRKET Danbo 45+ ML", price: 54.95 },
  { name: "Milbona Mini mozzarella Classic", price: 14.95 },
  { name: "Milbona Pizzatopping med mozzarella", price: 29.95 },
  { name: "Milbona Tex Mex ost", price: 17.95 },
  { name: "RIBERHUS Ost", price: 69.0 },
  { name: "THEM Økologisk skiveost", price: 20.0 },
  { name: "CASTELLO Fløjl eller blåskimmelost", price: 20.0 },
  { name: "Milbona Friskosttilberedning SK2", price: 10.95 },
  { name: "Milbona Kvark 20%", price: 9.95 },
  { name: "MADVÆRKET 15 Sødmælk", price: 14.5 },
  { name: "MADVÆRKET 15 Skummetmælk", price: 10.95 },
  { name: "MADVÆRKET Letmælk 1,5%", price: 11.95 },
  { name: "VEMONDO Mandel-, havre- eller sojadrik", price: 10.0 },
  { name: "Milbona Letsaltet smør", price: 25.95 },
  { name: "NATURLI Økologisk smørbar eller vegansk blok", price: 15.0 },
  { name: "Milbona Södergarden smørbar", price: 15.95 },
  { name: "MADVÆRKET Piskefløde", price: 22.0 },
  { name: "MADVÆRKET Fløde 36%", price: 27.95 },
  { name: "MADVÆRKET Yoghurt naturel", price: 12.0 },
  { name: "MADVÆRKET Yoghurt naturel 3,5%", price: 15.95 },
  { name: "HIGH PROTEIN Yoghurt", price: 7.0 },
  { name: "Milbona Græsk inspireret yoghurt 10%", price: 31.95 },
  { name: "Milbona Tyrkisk inspireret yoghurt 10%", price: 30.95 },
  { name: "Milbona Skyr med frugt SK3", price: 15.95 },
  { name: "Vemondo Sojayoghurt SK5", price: 9.95 },
  { name: "MADVÆRKET Fin- eller grovvalsede havregryn", price: 8.0 },
  { name: "MADVÆRKET Grovvalsede havregryn", price: 12.95 },
  { name: "MADVÆRKET Traditionelle havregryn", price: 8.95 },
  { name: "Blommetomater", price: 14.0 },
  { name: "Danske kartofler", price: 18.0 },
  { name: "DELUXE Duchesse ovnkartofler", price: 20.0 },
  { name: "HARVEST BASKET Kartoffelrøsti", price: 20.0 },
  { name: "DELUXE Kartoffelgratin", price: 25.0 },
  { name: "MADVÆRKET Rugbrød", price: 5.0 },
  { name: "MADVÆRKET Softkernerugbrød med hørfrø", price: 16.95 },
  { name: "MADVÆRKET Solsikkebrød 10 skiver", price: 7.95 },
  { name: "Vemondo Vegansk steak", price: 24.95 },
  { name: "SAMLIP Pankorasp", price: 12.0 },
  { name: "K-Salat remoulade eller mayonnaise", price: 12.0 },
  { name: "Dulano Selection Chorizo ekstra i skiver", price: 16.95 },
  { name: "VITASIA Gyoza med rejer", price: 40.0 },
  { name: "VITASIA Wakamesalat", price: 18.0 },
];

const productListText = LIDL_PRODUCTS
  .map(p => `- ${p.name}: ${p.price} DKK`)
  .join('\n');

const DISH_EMOJIS = ["🍝","🥗","🍲","🥘","🍛","🥙","🫕","🍜","🥚","🫔","🐟","🥩","🍗"];

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  try {
    const groq = new Groq({ apiKey });
    const { budget, ingredients, surpriseMe, beginnerMode, prioritizeDiscounts } = req.body;

    const beginnerInstructions = beginnerMode ? `
BEGINNER MODE IS ACTIVE:
- Use MAXIMUM 4 ingredients total, no exceptions
- Choose only the simplest, most recognizable ingredients
- Write steps as if explaining to someone who has NEVER cooked before — short sentences, no assumed knowledge
- Each step maximum 2 sentences
- Avoid any technique more complex than boiling, frying or mixing
- The dish must be completable in under 30 minutes
- Add "isBeginnerFriendly": true to your JSON response
` : '- Add "isBeginnerFriendly": false to your JSON response';

    const discountInstructions = prioritizeDiscounts ? `
DISCOUNT PRIORITY MODE IS ACTIVE:
- You MUST build the entire recipe around onSale items from the product list
- At least 4 out of your ingredients must have onSale: true
- Pick the protein, carb AND vegetable components all from sale items where possible
- The savings number should be maximized — pick the highest-value sale items
- Add "discountsFocused": true to your JSON response
` : '- Add "discountsFocused": false to your JSON response';

    const systemPrompt = `You are a JSON-only API for MyLidlChef, a healthy cooking app for young people in Denmark.
Return ONLY a valid JSON object. No markdown, no backticks, no explanations, no emoji characters anywhere.

PRODUCT RULES:
- For branded/packaged ingredients (meat, fish, dairy, pasta, eggs), you MUST pick from this exact Lidl product list and use the exact name and price:
${productListText}
- For basic loose produce (onions, garlic, carrots, broccoli, spinach, peppers, mushrooms, rice, lentils, chickpeas, olive oil, spices, herbs, canned tomatoes), use a simple generic Danish name and a realistic DKK price (e.g. "Løg 500g" at 8 DKK, "Olivenolie 500ml" at 22 DKK).
- Mix both types naturally in a recipe.

Return exactly this JSON structure:
{
  "dishName": "string (Danish recipe name, plain text only)",
  "funIntro": "string (max 15 words, encouraging, plain text only)",
  "ingredients": [
    {
      "name": "string (product name + quantity)",
      "lidlProductName": "string (same as name for Lidl products, or generic for produce)",
      "price": number,
      "onSale": boolean,
      "checked": true
    }
  ],
  "steps": ["string", "string"],
  "totalCost": number,
  "savings": number
}

RULES:
- 5-7 ingredients total, mix of Lidl branded + fresh produce
- Make 2-3 items onSale true (only for items from the Lidl product list above)
- totalCost = sum of all ingredient prices
- savings = sum of 25% of onSale item prices, rounded to 2 decimals
- 4-6 beginner-friendly cooking steps in Danish
- Always healthy and nutritious
- Stay under budget if given
- Use provided ingredients where possible if given

${beginnerInstructions}

${discountInstructions}`;

    let userPrompt = '';
    if (surpriseMe) {
      userPrompt = 'Surprise me with a healthy budget-friendly recipe for a young person!';
    } else {
      const parts = [];
      if (budget) parts.push(`Budget: ${budget} DKK`);
      if (ingredients?.length > 0) parts.push(`Ingredients I have: ${ingredients.join(', ')}`);
      userPrompt = parts.length > 0 ? parts.join('. ') : 'Create a healthy recipe for me';
    }

    const message = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: beginnerMode ? 800 : 1500,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    let content = message.choices[0].message?.content || '';

    // Strip markdown and any stray emoji
    content = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    content = content.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{27BF}]/gu, '');

    const recipe = JSON.parse(content);

    // Add emoji server-side so it never breaks JSON
    recipe.heroEmoji = DISH_EMOJIS[Math.floor(Math.random() * DISH_EMOJIS.length)];

    return res.status(200).json(recipe);

  } catch (error) {
    console.error('Error:', error?.message);
    return res.status(500).json({
      error: 'Oops, our chef is taking a break! Try again.',
    });
  }
}
