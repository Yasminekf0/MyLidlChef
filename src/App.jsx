import { useState } from 'react';

const LIDL_COLORS = {
  blue: '#0050AA',
  yellow: '#FFD700',
  red: '#E60A14',
  white: '#FFFFFF',
  lightGray: '#F4F4F4',
};

const FUN_FACTS = [
  "Did you know? Lentils have more protein per gram than steak! 💪",
  "Did you know? Cooking at home saves you up to 70% compared to eating out! 🏠",
  "Did you know? Frozen veggies are just as nutritious as fresh ones! ❄️",
  "Did you know? Meal prepping can save you 5+ hours per week! ⏰",
  "Did you know? Spices can boost your metabolism naturally! 🌶️"
];

const MOCK_RECIPE = {
  name: "Creamy Tomato Pasta with Basil",
  emoji: "🍝",
  ingredients: [
    { name: "Pasta 500g", product: "Lidl Favorit Pasta", price: 12.95, onSale: true },
    { name: "Cherry Tomatoes 250g", product: "Lidl Organic Tomatoes", price: 15.50, onSale: false },
    { name: "Cream 200ml", product: "Milsani Cooking Cream", price: 8.95, onSale: true },
    { name: "Garlic (3 cloves)", product: "Fresh Garlic Pack", price: 6.50, onSale: false },
    { name: "Fresh Basil", product: "Lidl Fresh Herbs", price: 9.95, onSale: true },
    { name: "Parmesan Cheese 100g", product: "Lovilio Parmesan", price: 16.95, onSale: false }
  ],
  steps: [
    "Boil pasta according to package instructions in salted water.",
    "Sauté minced garlic in olive oil until fragrant, then add halved cherry tomatoes.",
    "Once tomatoes soften, add cream and simmer for 3-4 minutes.",
    "Drain pasta and toss with the creamy tomato sauce.",
    "Garnish with fresh basil leaves and grated parmesan. Enjoy!"
  ],
  totalCost: 70.80,
  savings: 18.00
};

function App() {
  const [screen, setScreen] = useState('input');
  const [budgetEnabled, setBudgetEnabled] = useState(false);
  const [budget, setBudget] = useState(75);
  const [ingredients, setIngredients] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState(
    MOCK_RECIPE.ingredients.map((_, i) => i)
  );
  const [showToast, setShowToast] = useState(false);
  const [factIndex, setFactIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);

  const handleAddIngredient = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const value = inputValue.trim().replace(',', '');
      if (value && !ingredients.includes(value)) {
        setIngredients([...ingredients, value]);
        setInputValue('');
      }
    }
  };

  const handleRemoveIngredient = (ingredient) => {
    setIngredients(ingredients.filter(i => i !== ingredient));
  };

  const handleFindRecipe = () => {
    setScreen('loading');
    let factTimer;

    factTimer = setInterval(() => {
      setFactIndex(prev => (prev + 1) % FUN_FACTS.length);
    }, 800);

    setTimeout(() => {
      clearInterval(factTimer);
      setScreen('result');
    }, 2500);
  };

  const handleSurpriseMe = () => {
    setIsSpinning(true);
    setTimeout(() => {
      setIsSpinning(false);
      setScreen('loading');

      let factTimer = setInterval(() => {
        setFactIndex(prev => (prev + 1) % FUN_FACTS.length);
      }, 800);

      setTimeout(() => {
        clearInterval(factTimer);
        setScreen('result');
      }, 2500);
    }, 800);
  };

  const handleAddToList = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  const handleBack = () => {
    setScreen('input');
    setBudgetEnabled(false);
    setBudget(75);
    setIngredients([]);
    setInputValue('');
    setSelectedIngredients(MOCK_RECIPE.ingredients.map((_, i) => i));
  };

  const toggleIngredient = (index) => {
    setSelectedIngredients(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const canSubmit = budgetEnabled || ingredients.length > 0;

  return (
    <div className="min-h-screen py-8 px-4">
      <div
        className="max-w-[390px] mx-auto bg-white rounded-[32px] overflow-hidden shadow-2xl"
        style={{ minHeight: '844px' }}
      >
        {/* Header */}
        <div
          className="px-6 py-5"
          style={{ backgroundColor: LIDL_COLORS.blue }}
        >
          <div className="flex items-center gap-2 mb-1">
            <span className="text-2xl">👨‍🍳</span>
            <h1 className="font-nunito font-bold text-white text-2xl">MyLidlChef</h1>
          </div>
          <p className="text-white/90 text-sm font-dm-sans">Cook smart. Eat well. Save more.</p>
        </div>

        {/* INPUT SCREEN */}
        {screen === 'input' && (
          <div className="p-6 space-y-4 slide-up">
            {/* Budget Card */}
            <div
              className="rounded-2xl p-5 transition-all duration-300"
              style={{ backgroundColor: LIDL_COLORS.lightGray }}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">💰</span>
                  <span className="font-nunito font-semibold text-lg">I have a budget</span>
                </div>
                <button
                  onClick={() => setBudgetEnabled(!budgetEnabled)}
                  className="relative w-12 h-6 rounded-full transition-all duration-300"
                  style={{
                    backgroundColor: budgetEnabled ? LIDL_COLORS.blue : '#ccc'
                  }}
                >
                  <div
                    className="absolute top-0.5 w-5 h-5 bg-white rounded-full transition-all duration-300 shadow-md"
                    style={{ left: budgetEnabled ? '26px' : '2px' }}
                  />
                </button>
              </div>

              {budgetEnabled && (
                <div className="mt-4 fade-in">
                  <div
                    className="inline-block px-4 py-2 rounded-full font-nunito font-bold text-2xl mb-4"
                    style={{ backgroundColor: LIDL_COLORS.yellow, color: LIDL_COLORS.blue }}
                  >
                    {budget} DKK
                  </div>
                  <input
                    type="range"
                    min="20"
                    max="300"
                    value={budget}
                    onChange={(e) => setBudget(Number(e.target.value))}
                    className="w-full h-2 rounded-full appearance-none cursor-pointer"
                    style={{
                      background: `linear-gradient(to right, ${LIDL_COLORS.blue} 0%, ${LIDL_COLORS.blue} ${((budget - 20) / 280) * 100}%, #ddd ${((budget - 20) / 280) * 100}%, #ddd 100%)`
                    }}
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>20 DKK</span>
                    <span>300 DKK</span>
                  </div>
                </div>
              )}
            </div>

            {/* Ingredients Card */}
            <div
              className="rounded-2xl p-5"
              style={{ backgroundColor: LIDL_COLORS.lightGray }}
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">🥦</span>
                <span className="font-nunito font-semibold text-lg">I have ingredients</span>
              </div>
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleAddIngredient}
                placeholder="e.g. chicken, pasta, tomatoes..."
                className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-blue-500 outline-none transition-colors"
              />
              {ingredients.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {ingredients.map((ingredient, index) => (
                    <div
                      key={index}
                      className="px-3 py-1.5 rounded-full text-white text-sm font-medium flex items-center gap-2 fade-in"
                      style={{ backgroundColor: LIDL_COLORS.blue }}
                    >
                      {ingredient}
                      <button
                        onClick={() => handleRemoveIngredient(ingredient)}
                        className="hover:scale-110 transition-transform"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Find Recipe Button */}
            <button
              onClick={handleFindRecipe}
              disabled={!canSubmit}
              className="w-full py-4 rounded-2xl font-nunito font-bold text-lg text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: canSubmit ? LIDL_COLORS.blue : '#ccc'
              }}
            >
              Find My Recipe →
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-gray-300"></div>
              <span className="text-gray-400 text-sm font-semibold">OR</span>
              <div className="flex-1 h-px bg-gray-300"></div>
            </div>

            {/* Surprise Me Button */}
            <button
              onClick={handleSurpriseMe}
              className="w-full py-5 rounded-2xl font-nunito font-bold text-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                backgroundColor: LIDL_COLORS.yellow,
                color: LIDL_COLORS.blue
              }}
            >
              <span className={isSpinning ? 'spin-dice inline-block' : 'inline-block'}>🎲</span> Surprise Me!
            </button>
          </div>
        )}

        {/* LOADING SCREEN */}
        {screen === 'loading' && (
          <div className="p-6 space-y-4">
            <div className="shimmer rounded-2xl h-48"></div>
            <div className="shimmer rounded-xl h-8 w-3/4"></div>
            <div className="space-y-2">
              <div className="shimmer rounded-lg h-12"></div>
              <div className="shimmer rounded-lg h-12"></div>
              <div className="shimmer rounded-lg h-12"></div>
              <div className="shimmer rounded-lg h-12"></div>
            </div>
            <div className="shimmer rounded-xl h-32"></div>

            <div
              className="mt-8 p-4 rounded-xl text-center fade-in"
              style={{ backgroundColor: LIDL_COLORS.yellow }}
            >
              <p className="font-dm-sans text-sm" style={{ color: LIDL_COLORS.blue }}>
                {FUN_FACTS[factIndex]}
              </p>
            </div>
          </div>
        )}

        {/* RESULT SCREEN */}
        {screen === 'result' && (
          <div className="p-6 space-y-5 slide-up">
            {/* Dish Name & Emoji */}
            <div className="text-center">
              <div
                className="w-20 h-20 rounded-full mx-auto mb-3 flex items-center justify-center text-5xl"
                style={{ backgroundColor: LIDL_COLORS.yellow }}
              >
                {MOCK_RECIPE.emoji}
              </div>
              <h2
                className="font-nunito font-bold text-2xl"
                style={{ color: LIDL_COLORS.blue }}
              >
                {MOCK_RECIPE.name}
              </h2>
            </div>

            {/* Ingredient List */}
            <div>
              <h3 className="font-nunito font-bold text-lg mb-3" style={{ color: LIDL_COLORS.blue }}>
                🛒 Ingredients
              </h3>
              <div className="space-y-2">
                {MOCK_RECIPE.ingredients.map((item, index) => (
                  <div
                    key={index}
                    className="p-3 rounded-xl border-2 transition-all duration-200"
                    style={{
                      backgroundColor: LIDL_COLORS.lightGray,
                      borderColor: selectedIngredients.includes(index) ? LIDL_COLORS.blue : 'transparent'
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <input
                        type="checkbox"
                        checked={selectedIngredients.includes(index)}
                        onChange={() => toggleIngredient(index)}
                        className="mt-1 w-5 h-5 cursor-pointer accent-blue-600"
                      />
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-dm-sans font-semibold">{item.name}</p>
                            <p className="text-xs text-gray-500 italic">{item.product}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-dm-sans font-bold">{item.price.toFixed(2)} DKK</p>
                            {item.onSale && (
                              <span
                                className="inline-block text-[10px] font-bold px-2 py-0.5 rounded text-white mt-1"
                                style={{ backgroundColor: LIDL_COLORS.red }}
                              >
                                🔥 TILBUD
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Add to List Button */}
            <button
              onClick={handleAddToList}
              className="w-full py-4 rounded-2xl font-nunito font-semibold text-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
              style={{ backgroundColor: LIDL_COLORS.blue }}
            >
              🛒 Add selected to Lidl Shopping List
            </button>

            {/* Savings Banner */}
            <div
              className="p-4 rounded-2xl text-center shadow-md"
              style={{ backgroundColor: LIDL_COLORS.yellow }}
            >
              <p className="font-nunito font-bold text-lg" style={{ color: LIDL_COLORS.blue }}>
                🎉 You save {MOCK_RECIPE.savings.toFixed(2)} DKK with today's deals!
              </p>
            </div>

            {/* Steps */}
            <div>
              <h3 className="font-nunito font-bold text-lg mb-3" style={{ color: LIDL_COLORS.blue }}>
                👨‍🍳 Step-by-Step Instructions
              </h3>
              <div className="space-y-3">
                {MOCK_RECIPE.steps.map((step, index) => (
                  <div key={index} className="flex gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center font-nunito font-bold text-white flex-shrink-0"
                      style={{ backgroundColor: LIDL_COLORS.blue }}
                    >
                      {index + 1}
                    </div>
                    <p className="font-dm-sans text-gray-700 pt-1">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Cost */}
            <div
              className="p-4 rounded-2xl"
              style={{ backgroundColor: LIDL_COLORS.lightGray }}
            >
              <p className="font-nunito font-bold text-xl" style={{ color: LIDL_COLORS.blue }}>
                Total estimated cost: {MOCK_RECIPE.totalCost.toFixed(2)} DKK
              </p>
              <p className="text-xs text-gray-500 mt-1">Prices based on current Lidl store offers</p>
            </div>

            {/* Back Button */}
            <button
              onClick={handleBack}
              className="w-full py-3 rounded-2xl font-nunito font-semibold border-2 transition-all duration-200 hover:bg-gray-50"
              style={{
                borderColor: LIDL_COLORS.blue,
                color: LIDL_COLORS.blue
              }}
            >
              ← Try another recipe
            </button>
          </div>
        )}
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-green-500 text-white px-6 py-3 rounded-full shadow-lg font-dm-sans font-semibold slide-up">
          ✅ Added to your Lidl Shopping List!
        </div>
      )}
    </div>
  );
}

export default App;
