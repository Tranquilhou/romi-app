import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { RECIPES } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import type { Recipe } from '@/types';
import { Search, Heart, SlidersHorizontal } from 'lucide-react';

const ALL_TAGS = ['Healthy', 'Express', 'Gourmand', 'World', 'Végétarien', 'Fit'];

export function RecipesPage() {
  const { state } = useApp();
  const [search, setSearch] = useState('');
  const [activeTags, setActiveTags] = useState<string[]>([]);
  const [favOnly, setFavOnly] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);

  const filtered = useMemo(() => {
    let list = RECIPES;
    if (favOnly) list = list.filter((r) => state.favorites.includes(r.id));
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((r) => r.title.toLowerCase().includes(q) || r.description.toLowerCase().includes(q));
    }
    if (activeTags.length > 0) {
      list = list.filter((r) => activeTags.every((t) => r.tags.includes(t)));
    }
    return list;
  }, [search, activeTags, favOnly, state.favorites]);

  const toggleTag = (tag: string) => {
    setActiveTags((t) => (t.includes(tag) ? t.filter((x) => x !== tag) : [...t, tag]));
  };

  return (
    <div className="min-h-screen bg-cream pb-24">
      <div className="border-b border-gray-100 bg-white">
        <div className="mx-auto max-w-5xl px-5 py-5">
          <h1 className="text-xl font-bold text-gray-900">Catalogue de recettes</h1>

          {/* Search */}
          <div className="relative mt-4">
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Rechercher une recette..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-12"
            />
          </div>

          {/* Filters */}
          <div className="mt-3 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <button
              onClick={() => setFavOnly(!favOnly)}
              className={`flex shrink-0 items-center gap-1.5 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                favOnly ? 'bg-rose-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Heart className={`h-4 w-4 ${favOnly ? 'fill-white' : ''}`} /> Favoris
            </button>
            <div className="h-6 w-px shrink-0 bg-gray-200" />
            {ALL_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`shrink-0 rounded-xl px-3.5 py-2 text-sm font-semibold transition-all active:scale-95 ${
                  activeTags.includes(tag) ? 'bg-emerald-500 text-white' : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="mx-auto max-w-5xl px-5 py-6">
        {filtered.length === 0 ? (
          <div className="rounded-2xl border-2 border-dashed border-gray-200 p-12 text-center">
            <SlidersHorizontal className="mx-auto h-10 w-10 text-gray-300" />
            <p className="mt-3 text-gray-400">Aucune recette ne correspond à vos filtres.</p>
          </div>
        ) : (
          <>
            <p className="mb-4 text-sm text-gray-400">{filtered.length} recette{filtered.length > 1 ? 's' : ''}</p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filtered.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
              ))}
            </div>
          </>
        )}
      </div>

      <RecipeDetailModal recipe={selectedRecipe} open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
}
