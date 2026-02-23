# 🧑‍🍳 MyLidlChef

A smart AI-powered recipe generator built as a feature concept for the **Lidl+ app**, designed to help young people in Denmark cook healthier meals on a budget — using real Lidl products at real prices.

Built in 48 hours as part of a hackathon, MyLidlChef turns your ingredients and budget into a full recipe, complete with a Lidl shopping list, live discount badges, and a gamified cooking journey.

---

## 🚀 Features

* 💰 **Budget Mode** — Set a DKK budget with a slider and get a recipe that stays under it
* 🥦 **Ingredient Mode** — Enter what you already have and build a recipe around it
* 🎲 **Surprise Me** — One-tap random recipe with a fun spin animation
* 🔥 **Prioritize Discounts** — Toggle to build recipes around today's Lidl sale items
* 👶 **Beginner Mode** — Simplified recipes with max 4 ingredients and step-by-step instructions for first-time cooks
* 🏷️ **TILBUD Badges** — On-sale ingredients are highlighted with a red sale sticker
* 🛒 **Add to Lidl Shopping List** — Select ingredients and add them in one tap
* 💸 **Savings Banner** — Shows exactly how much you save with today's deals in DKK
* 🏆 **Journey Page** — Duolingo-style gamification tracking your progress from Beginner Chef to Master Chef
* 📸 **Recipe Images** — Auto-fetched food photography via Unsplash API
* ⚡ **Loading Skeleton** — Shimmer placeholder with rotating healthy eating fun facts

---

## 🛠 Architecture & Tech Stack

* **Frontend** — React (Vite), Tailwind CSS, deployed as a mobile-first PWA-style web app
* **Backend** — Vercel Serverless Functions (`/api/recipe.js`)
* **AI** — Groq API with `llama-3.3-70b-versatile` for real-time recipe generation
* **Images** — Unsplash API for dish photography
* **Deployment** — Vercel (auto-deploys from GitHub on every push)

### How the AI works

The frontend sends a `POST /api/recipe` request with:
```json
{
  "budget": 75,
  "ingredients": ["kylling", "pasta"],
  "surpriseMe": false,
  "beginnerMode": true,
  "prioritizeDiscounts": false
}
```

The serverless function calls Groq with a structured system prompt instructing it to:
- Pick only from a curated list of **138 real Lidl Denmark products** with real DKK prices
- Use generic names for loose produce (onions, garlic, spices etc.)
- Return clean JSON with dish name, ingredients, steps, total cost, and savings
- Respect budget, ingredient, beginner, and discount constraints simultaneously

Emojis are stripped from the AI response server-side and assigned separately to prevent JSON parse errors.

---

## 💻 Local Development

> ⚠️ The `/api/recipe` endpoint requires Vercel's serverless runtime and will not work with `npm run dev` alone. Test the full app on the deployed Vercel URL.

```bash
# Clone the repo
git clone https://github.com/Yasminekf0/MyLidlChef.git
cd MyLidlChef

# Install dependencies
npm install

# Start the frontend (UI only — API won't work locally)
npm run dev
```

### Environment Variables

Create a `.env` file in the project root:

```
GROQ_API_KEY=your_groq_api_key_here
VITE_UNSPLASH_ACCESS_KEY=your_unsplash_access_key_here
```

For deployment, add these in **Vercel → Project Settings → Environment Variables**.

| Variable | Where to get it |
|---|---|
| `GROQ_API_KEY` | [console.groq.com](https://console.groq.com) — free, no credit card |
| `VITE_UNSPLASH_ACCESS_KEY` | [unsplash.com/developers](https://unsplash.com/developers) — free |

---

## 📁 Project Structure

```
MyLidlChef/
├── api/
│   └── recipe.js          # Vercel serverless function — Groq AI integration
├── src/
│   ├── App.jsx            # Main app — all screens and state management
│   ├── Journey.jsx        # Gamification / journey page component
│   ├── lidl-products.js   # 138 real Lidl Denmark products with DKK prices
│   └── index.css          # Global styles
├── index.html             # Custom cursor + app shell
├── vercel.json            # Vercel deployment config
└── vite.config.js
```

---

## 🗺️ The Journey — Gamification System

MyLidlChef isn't just a recipe tool — it's a cooking progression system inspired by Duolingo:

| Step | Name | Description |
|---|---|---|
| ✅ Step 1 | Opskrift Mester | Find your first recipe |
| 🍳 Step 2 | Spar Smart | Use today's deals |
| 🔒 Step 3 | Mester Kok | Share your finished dish and earn points |

Users level up from **Begynder Kok** → **Øvet Kok** → **Mester Kok** as they cook more, discover deals, and engage with the community.

---

## 🌍 Deployment

The app is live at: **[my-lidl-chef.vercel.app](https://my-lidl-chef.vercel.app)**

Every push to the `main` branch on GitHub triggers an automatic Vercel redeploy.

---

## 💡 Product Vision

MyLidlChef was built as a hackathon concept to answer one question:

> *How can Lidl+ help young people eat healthier without spending more?*

The answer combines three things Lidl already has — products, prices, and the Lidl+ app — with AI to remove the biggest barrier to healthy cooking: not knowing what to make with what you have and what's on sale.

The gamification layer turns one-off recipe lookups into a habit-forming journey, keeping young users engaged with the Lidl+ ecosystem over time.

---

## 🔗 Resources

* 🌐 **Live App**: [my-lidl-chef.vercel.app](https://my-lidl-chef.vercel.app)
* 🎥 **Demo Video**: Coming soon

---

*Built February 2026*
