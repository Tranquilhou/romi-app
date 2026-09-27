import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type { AppState, DietaryPreference, KitchenAppliance, PlannedMeal, SupermarketId, UserProfile } from '@/types';
import { RECIPES, RECIPE_MAP } from '@/data/recipes';
import { SUPERMARKET_MAP } from '@/data/supermarkets';

const STORAGE_KEY = 'romi-app-state-v1';

const DEFAULT_PROFILE: UserProfile = {
  supermarket: 'lidl',
  adults: 2,
  children: 0,
  weeklyBudget: 40,
  dietaryPreferences: [],
  kitchenAppliances: ['stove'],
  portionStyle: 'any',
  proteinTarget: 'any',
  mealMoods: [],
  painPoints: [],
  excludedIngredients: [],
  onboarded: false,
};

function getDefaultState(): AppState {
  return {
    profile: DEFAULT_PROFILE,
    currentPlan: [],
    favorites: [],
    checkedItems: [],
    pantryItems: [],
    currentView: 'landing',
    selectedWeekStart: getWeekStart(new Date()),
  };
}

export function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d.toISOString().split('T')[0];
}

export const DAYS = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

export function generateWeeklyMenu(profile: UserProfile): PlannedMeal[] {
  const compatible = RECIPES.filter((r) => {
    const ingredientText = r.ingredients.map((ingredient) => ingredient.name.toLowerCase()).join(' ');
    const excluded = profile.excludedIngredients.some((ingredient) => ingredientText.includes(ingredient.toLowerCase()));
    if (excluded) return false;

    for (const flag of profile.dietaryPreferences) {
      if (flag === 'vegetarian' && !r.dietaryFlags.includes('vegetarian')) return false;
      if (flag === 'pescetarian' && r.ingredients.some((i) => /poulet|bœuf|porc|jambon|viande/i.test(i.name))) return false;
      if (flag === 'gluten_free' && !r.dietaryFlags.includes('gluten_free')) return false;
      if (flag === 'lactose_free' && r.ingredients.some((i) => /brie|parmesan|pecorino|feta|fromage|beurre|lait|crème/i.test(i.name))) return false;
    }

    if (profile.mealMoods.includes('quick') && r.prepTimeMinutes > 30) return false;
    if (profile.mealMoods.includes('healthy') && !r.dietaryFlags.includes('fit') && !r.dietaryFlags.includes('vegetarian')) return false;
    if (profile.proteinTarget !== 'any' && !r.dietaryFlags.includes('fit') && r.pricePerServing < 2) return false;
    if (profile.kitchenAppliances.length > 0 && !r.appliances.some((appliance) => profile.kitchenAppliances.includes(appliance))) return false;
    return true;
  });

  const pool = compatible;
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  const numMeals = 5;
  const totalServings = profile.adults + profile.children;
  const plan: PlannedMeal[] = [];

  let totalCost = 0;
  for (let i = 0; i < shuffled.length && plan.length < numMeals; i++) {
    const recipe = shuffled[i];
    const cost = recipe.pricePerServing * totalServings;
    if (totalCost + cost > profile.weeklyBudget * 1.15 && plan.length >= 3) continue;
    plan.push({ dayOfWeek: plan.length + 1, recipeId: recipe.id, servings: totalServings });
    totalCost += cost;
  }

  while (plan.length < numMeals && plan.length < shuffled.length) {
    const recipe = shuffled[plan.length];
    plan.push({ dayOfWeek: plan.length + 1, recipeId: recipe.id, servings: totalServings });
  }

  return plan;
}

export function computePlanCost(plan: PlannedMeal[]): number {
  return plan.reduce((sum, meal) => {
    const recipe = RECIPE_MAP[meal.recipeId];
    if (!recipe) return sum;
    return sum + recipe.pricePerServing * meal.servings;
  }, 0);
}

export function computeShoppingList(plan: PlannedMeal[]) {
  const map = new Map<string, { name: string; category: string; totalAmount: string; estimatedPrice: number; quantity: number; unit: string }>();

  for (const meal of plan) {
    const recipe = RECIPE_MAP[meal.recipeId];
    if (!recipe) continue;
    const ratio = meal.servings / recipe.servings;
    for (const ing of recipe.ingredients) {
      const key = ing.name.toLowerCase();
      const existing = map.get(key);
      const scaledAmount = ing.amount * ratio;
      const scaledPrice = ing.estimatedPrice * ratio;
      if (existing) {
        existing.quantity += scaledAmount;
        existing.estimatedPrice += scaledPrice;
        existing.totalAmount = `${Math.round(existing.quantity * 10) / 10} ${existing.unit}`;
      } else {
        map.set(key, {
          name: ing.name,
          category: ing.category,
          quantity: scaledAmount,
          unit: ing.unit,
          totalAmount: `${Math.round(scaledAmount * 10) / 10} ${ing.unit}`,
          estimatedPrice: scaledPrice,
        });
      }
    }
  }

  return Array.from(map.values()).sort((a, b) => a.category.localeCompare(b.category));
}

interface AppContextValue {
  state: AppState;
  setProfile: (profile: Partial<UserProfile>) => void;
  completeOnboarding: (profile: Partial<UserProfile>) => void;
  setCurrentView: (view: string) => void;
  toggleFavorite: (recipeId: string) => void;
  replaceMeal: (dayOfWeek: number, newRecipeId: string) => void;
  regenerateWeek: () => void;
  toggleCheckedItem: (itemKey: string) => void;
  togglePantryItem: (itemKey: string) => void;
  resetApp: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved) as AppState;
        const profile = { ...DEFAULT_PROFILE, ...parsed.profile };
        return { ...getDefaultState(), ...parsed, profile, currentView: profile.onboarded ? parsed.currentView || 'dashboard' : 'landing' };
      }
    } catch {
      // ignore
    }
    return getDefaultState();
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore
    }
  }, [state]);

  const setProfile = (profile: Partial<UserProfile>) => {
    setState((s) => ({ ...s, profile: { ...s.profile, ...profile } }));
  };

  const completeOnboarding = (profile: Partial<UserProfile>) => {
    const merged = { ...state.profile, ...profile, onboarded: true };
    const plan = generateWeeklyMenu(merged);
    setState((s) => ({
      ...s,
      profile: merged,
      currentPlan: plan,
      currentView: 'dashboard',
      checkedItems: [],
      pantryItems: [],
    }));
  };

  const setCurrentView = (view: string) => {
    setState((s) => ({ ...s, currentView: view }));
  };

  const toggleFavorite = (recipeId: string) => {
    setState((s) => ({
      ...s,
      favorites: s.favorites.includes(recipeId)
        ? s.favorites.filter((id) => id !== recipeId)
        : [...s.favorites, recipeId],
    }));
  };

  const replaceMeal = (dayOfWeek: number, newRecipeId: string) => {
    setState((s) => ({
      ...s,
      currentPlan: s.currentPlan.map((m) =>
        m.dayOfWeek === dayOfWeek ? { ...m, recipeId: newRecipeId } : m
      ),
      checkedItems: [],
      pantryItems: [],
    }));
  };

  const regenerateWeek = () => {
    setState((s) => ({
      ...s,
      currentPlan: generateWeeklyMenu(s.profile),
      checkedItems: [],
      pantryItems: [],
    }));
  };

  const toggleCheckedItem = (itemKey: string) => {
    setState((s) => ({
      ...s,
      checkedItems: s.checkedItems.includes(itemKey)
        ? s.checkedItems.filter((k) => k !== itemKey)
        : [...s.checkedItems, itemKey],
    }));
  };

  const togglePantryItem = (itemKey: string) => {
    setState((s) => ({
      ...s,
      pantryItems: s.pantryItems.includes(itemKey)
        ? s.pantryItems.filter((k) => k !== itemKey)
        : [...s.checkedItems, itemKey],
    }));
  };

  const resetApp = () => {
    setState(getDefaultState());
  };

  return (
    <AppContext.Provider
      value={{
        state,
        setProfile,
        completeOnboarding,
        setCurrentView,
        toggleFavorite,
        replaceMeal,
        regenerateWeek,
        toggleCheckedItem,
        togglePantryItem,
        resetApp,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}

export { SUPERMARKET_MAP };
