export type SupermarketId =
  | 'lidl'
  | 'carrefour'
  | 'leclerc'
  | 'aldi'
  | 'intermarche'
  | 'auchan'
  | 'superu'
  | 'grandfrais'
  | 'franprix';

export type DietaryPreference =
  | 'vegetarian'
  | 'pescetarian'
  | 'gluten_free'
  | 'lactose_free'
  | 'no_pork'
  | 'express'
  | 'fit';

export type KitchenAppliance = 'airfryer' | 'oven' | 'stove';

export type PortionStyle = 'any' | 'light' | 'balanced' | 'hearty';
export type ProteinTarget = 'any' | 'high' | 'extra' | 'max';
export type MealMood = 'healthy' | 'quick' | 'protein' | 'gourmand' | 'family' | 'world';

export type AisleCategory =
  | 'Fruits & Légumes'
  | 'Crémerie & Frais'
  | 'Viandes & Poissons'
  | 'Épicerie & Condiments'
  | 'Surgelés';

export interface Ingredient {
  name: string;
  amount: number;
  unit: string;
  category: AisleCategory;
  estimatedPrice: number;
}

export interface RecipeStep {
  stepNumber: number;
  instruction: string;
  durationMin: number;
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTimeMinutes: number;
  pricePerServing: number;
  imageUrl: string;
  tags: string[];
  dietaryFlags: DietaryPreference[];
  appliances: KitchenAppliance[];
  ingredients: Ingredient[];
  steps: RecipeStep[];
  servings: number;
}

export interface PlannedMeal {
  dayOfWeek: number;
  recipeId: string;
  servings: number;
}

export interface UserProfile {
  supermarket: SupermarketId;
  adults: number;
  children: number;
  weeklyBudget: number;
  dietaryPreferences: DietaryPreference[];
  kitchenAppliances: KitchenAppliance[];
  portionStyle: PortionStyle;
  proteinTarget: ProteinTarget;
  mealMoods: MealMood[];
  painPoints: string[];
  excludedIngredients: string[];
  onboarded: boolean;
}

export interface AppState {
  profile: UserProfile;
  currentPlan: PlannedMeal[];
  favorites: string[];
  checkedItems: string[];
  pantryItems: string[];
  currentView: string;
  selectedWeekStart: string;
}
