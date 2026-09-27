import { useState } from 'react';
import { useApp, computePlanCost, DAYS } from '@/context/AppContext';
import { RECIPE_MAP, RECIPES } from '@/data/recipes';
import { SUPERMARKET_MAP } from '@/data/supermarkets';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import { Modal } from '@/components/Modal';
import type { Recipe } from '@/types';
import { Wallet, RefreshCw, Eye, RefreshCcw, ShoppingCart, Calendar, ChefHat, TrendingUp } from 'lucide-react';

export function DashboardPage() {
  const { state, setCurrentView, regenerateWeek, replaceMeal } = useApp();
  const [detailRecipe, setDetailRecipe] = useState<Recipe | null>(null);
  const [swapDay, setSwapDay] = useState<number | null>(null);

  const totalCost = computePlanCost(state.currentPlan);
  const budget = state.profile.weeklyBudget;
  const remaining = budget - totalCost;
  const pct = Math.min(100, (totalCost / budget) * 100);
  const supermarket = SUPERMARKET_MAP[state.profile.supermarket];

  const swapRecipe = swapDay !== null ? state.currentPlan.find((m) => m.dayOfWeek === swapDay) : null;
  const swapRecipeData = swapRecipe ? RECIPE_MAP[swapRecipe.recipeId] : null;

  const compatibleSwaps = RECIPES.filter((r) => {
    const ingredientText = r.ingredients.map((i) => i.name.toLowerCase()).join(' ');
    if (state.profile.excludedIngredients.some((ing) => ingredientText.includes(ing.toLowerCase()))) return false;
    for (const flag of state.profile.dietaryPreferences) {
      if (flag === 'vegetarian' && !r.dietaryFlags.includes('vegetarian')) return false;
      if (flag === 'pescetarian' && r.ingredients.some((i) => /poulet|bœuf|porc|jambon|viande/i.test(i.name))) return false;
      if (flag === 'gluten_free' && !r.dietaryFlags.includes('gluten_free')) return false;
      if (flag === 'lactose_free' && r.ingredients.some((i) => /brie|parmesan|pecorino|feta|fromage|beurre|lait|crème/i.test(i.name))) return false;
      if (flag === 'no_pork' && r.ingredients.some((i) => i.name.toLowerCase().includes('porc'))) return false;
      if (flag === 'express' && r.prepTimeMinutes > 20) return false;
      if (flag === 'fit' && !r.dietaryFlags.includes('fit')) return false;
    }
    return r.id !== swapRecipeData?.id;
  });

  const handleSwap = (newRecipeId: string) => {
    if (swapDay !== null) {
      replaceMeal(swapDay, newRecipeId);
      setSwapDay(null);
    }
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      {/* Header */}
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900">Menu de la semaine</h1>
              <p className="text-sm text-gray-400">
                <Calendar className="mr-1 inline h-3.5 w-3.5" />
                Semaine du {new Date(state.selectedWeekStart).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long' })}
              </p>
            </div>
            <button
              onClick={regenerateWeek}
              className="btn-ghost text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
            >
              <RefreshCw className="h-4 w-4" /> Régénérer
            </button>
          </div>

          {/* Budget bar */}
          <div className="mt-4 rounded-2xl bg-gray-50 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white" style={{ color: supermarket.color }}>
                  <span className="text-sm font-bold">{supermarket.name.charAt(0)}</span>
                </div>
                <div>
                  <div className="text-sm font-semibold text-gray-900">{supermarket.name}</div>
                  <div className="text-xs text-gray-400">{state.profile.adults + state.profile.children} pers.</div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold text-gray-900">{totalCost.toFixed(2)} €</span>
                  <span className="text-sm text-gray-400">/ {budget.toFixed(0)} €</span>
                </div>
                <div className={`text-xs font-semibold ${remaining >= 0 ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {remaining >= 0 ? `${remaining.toFixed(2)} € restants` : `${Math.abs(remaining).toFixed(2)} € dépassé`}
                </div>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-500 ${pct > 100 ? 'bg-rose-500' : 'bg-emerald-500'}`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Meal cards */}
      <div className="mx-auto max-w-5xl px-5 py-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.currentPlan.map((meal) => {
            const recipe = RECIPE_MAP[meal.recipeId];
            if (!recipe) return null;
            const cost = recipe.pricePerServing * meal.servings;
            return (
              <div key={meal.dayOfWeek} className="card overflow-hidden animate-fade-in">
                <div className="relative h-36 overflow-hidden">
                  <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full object-cover" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute left-3 top-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-gray-700 backdrop-blur-sm">
                    {DAYS[meal.dayOfWeek - 1]}
                  </div>
                  <div className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-xs font-bold text-amber-600 backdrop-blur-sm">
                    {cost.toFixed(2)} €
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{recipe.title}</h3>
                  <p className="mt-0.5 text-xs text-gray-400">{recipe.prepTimeMinutes} min · {meal.servings} pers.</p>
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => setDetailRecipe(recipe)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gray-50 py-2.5 text-sm font-semibold text-gray-700 transition-all hover:bg-gray-100 active:scale-95"
                    >
                      <Eye className="h-4 w-4" /> Recette
                    </button>
                    <button
                      onClick={() => setSwapDay(meal.dayOfWeek)}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-emerald-50 py-2.5 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-100 active:scale-95"
                    >
                      <RefreshCcw className="h-4 w-4" /> Remplacer
                    </button>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Empty slots */}
          {state.currentPlan.length === 0 && (
            <div className="col-span-full rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
              <ChefHat className="mx-auto h-10 w-10 text-gray-300" />
              <p className="mt-3 text-gray-400">Aucun menu généré. Cliquez sur "Régénérer".</p>
            </div>
          )}
        </div>

        {/* Summary stats */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card p-4 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-emerald-500" />
            <div className="mt-1 text-lg font-bold text-gray-900">{(totalCost / (state.profile.adults + state.profile.children) / state.currentPlan.length || 0).toFixed(2)} €</div>
            <div className="text-xs text-gray-400">Coût moyen / repas</div>
          </div>
          <div className="card p-4 text-center">
            <Wallet className="mx-auto h-5 w-5 text-amber-500" />
            <div className="mt-1 text-lg font-bold text-gray-900">{state.currentPlan.length}</div>
            <div className="text-xs text-gray-400">Repas planifiés</div>
          </div>
          <div className="card p-4 text-center">
            <Calendar className="mx-auto h-5 w-5 text-blue-500" />
            <div className="mt-1 text-lg font-bold text-gray-900">{state.currentPlan.reduce((s, m) => s + (RECIPE_MAP[m.recipeId]?.prepTimeMinutes || 0), 0)} min</div>
            <div className="text-xs text-gray-400">Temps total</div>
          </div>
        </div>
      </div>

      {/* Recipe Detail Modal */}
      <RecipeDetailModal recipe={detailRecipe} open={!!detailRecipe} onClose={() => setDetailRecipe(null)} />

      {/* Swap Modal */}
      <Modal open={swapDay !== null} onClose={() => setSwapDay(null)} maxWidth="max-w-xl">
        <div className="p-5">
          <h2 className="text-xl font-bold text-gray-900">Remplacer ce plat</h2>
          <p className="mt-1 text-sm text-gray-500">Choisissez une recette compatible avec vos préférences.</p>
          <div className="mt-4 max-h-[60vh] space-y-3 overflow-y-auto">
            {compatibleSwaps.map((r) => {
              const cost = r.pricePerServing * (state.profile.adults + state.profile.children);
              return (
                <button
                  key={r.id}
                  onClick={() => handleSwap(r.id)}
                  className="flex w-full items-center gap-3 rounded-2xl border border-gray-100 p-3 text-left transition-all hover:border-emerald-200 hover:bg-emerald-50/30 active:scale-[0.98]"
                >
                  <img src={r.imageUrl} alt={r.title} className="h-16 w-16 shrink-0 rounded-xl object-cover" loading="lazy" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 line-clamp-1">{r.title}</h3>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-gray-400">
                      <span>{r.prepTimeMinutes} min</span>
                      <span>·</span>
                      <span className="font-semibold text-amber-600">{cost.toFixed(2)} €</span>
                    </div>
                    <div className="mt-1 flex flex-wrap gap-1">
                      {r.tags.slice(0, 2).map((t) => (
                        <span key={t} className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">{t}</span>
                      ))}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </Modal>
    </div>
  );
}
