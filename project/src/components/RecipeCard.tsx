import type { Recipe } from '@/types';
import { Clock, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface RecipeCardProps {
  recipe: Recipe;
  onClick?: () => void;
  compact?: boolean;
}

const TAG_COLORS: Record<string, string> = {
  Healthy: 'bg-emerald-50 text-emerald-700',
  Express: 'bg-amber-50 text-amber-700',
  Gourmand: 'bg-rose-50 text-rose-700',
  World: 'bg-blue-50 text-blue-700',
  Végétarien: 'bg-green-50 text-green-700',
  Fit: 'bg-cyan-50 text-cyan-700',
};

export function RecipeCard({ recipe, onClick, compact }: RecipeCardProps) {
  const { state, toggleFavorite } = useApp();
  const isFav = state.favorites.includes(recipe.id);

  return (
    <div
      className="card group cursor-pointer overflow-hidden transition-all hover:shadow-lg hover:-translate-y-0.5"
      onClick={onClick}
    >
      <div className={`relative overflow-hidden ${compact ? 'h-32' : 'h-44'}`}>
        <img
          src={recipe.imageUrl}
          alt={recipe.title}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            toggleFavorite(recipe.id);
          }}
          className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm transition-all hover:bg-white active:scale-90"
        >
          <Heart
            className={`h-4 w-4 transition-colors ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`}
          />
        </button>
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-white/90 px-2.5 py-1 text-xs font-bold text-amber-600 backdrop-blur-sm">
          {recipe.pricePerServing.toFixed(2)} € / part
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-bold text-gray-900 leading-tight line-clamp-1">{recipe.title}</h3>
        {!compact && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
        )}
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs text-gray-400">
            <Clock className="h-3.5 w-3.5" />
            <span className="font-medium">{recipe.prepTimeMinutes} min</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {recipe.tags.slice(0, 2).map((tag) => (
              <span key={tag} className={`tag ${TAG_COLORS[tag] || 'bg-gray-50 text-gray-600'}`}>
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
