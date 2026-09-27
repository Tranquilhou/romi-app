import { useState, useEffect, useRef } from 'react';
import type { Recipe } from '@/types';
import { Modal } from '@/components/Modal';
import { Clock, Play, Pause, RotateCcw, Check, ListOrdered, ChefHat, Heart } from 'lucide-react';
import { useApp } from '@/context/AppContext';

interface RecipeDetailModalProps {
  recipe: Recipe | null;
  open: boolean;
  onClose: () => void;
}

const AISLE_ICONS: Record<string, string> = {
  'Fruits & Légumes': '🥦',
  'Crémerie & Frais': '🧀',
  'Viandes & Poissons': '🥩',
  'Épicerie & Condiments': '🍝',
  'Surgelés': '🧊',
};

export function RecipeDetailModal({ recipe, open, onClose }: RecipeDetailModalProps) {
  const { state, toggleFavorite } = useApp();
  const [activeStep, setActiveStep] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (open) {
      setActiveStep(0);
      setTimerRunning(false);
      setSecondsLeft(0);
    }
  }, [open, recipe?.id]);

  useEffect(() => {
    if (timerRunning && secondsLeft > 0) {
      intervalRef.current = setInterval(() => {
        setSecondsLeft((s) => {
          if (s <= 1) {
            setTimerRunning(false);
            return 0;
          }
          return s - 1;
        });
      }, 1000);
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
      };
    }
  }, [timerRunning, secondsLeft]);

  if (!recipe) return null;

  const isFav = state.favorites.includes(recipe.id);

  const startStepTimer = (stepIndex: number) => {
    setActiveStep(stepIndex);
    const duration = recipe.steps[stepIndex].durationMin * 60;
    setSecondsLeft(duration);
    setTimerRunning(true);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <Modal open={open} onClose={onClose} maxWidth="max-w-2xl">
      <div className="relative">
        <div className="relative h-56 overflow-hidden rounded-t-3xl">
          <img src={recipe.imageUrl} alt={recipe.title} className="h-full w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-5 right-5">
            <div className="flex items-center gap-2 mb-1">
              {recipe.tags.map((tag) => (
                <span key={tag} className="rounded-full bg-white/20 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
                  {tag}
                </span>
              ))}
            </div>
            <h2 className="text-2xl font-bold text-white">{recipe.title}</h2>
          </div>
        </div>

        <div className="p-5">
          <p className="text-gray-600">{recipe.description}</p>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <Clock className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{recipe.prepTimeMinutes} min</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-amber-50 px-3 py-2">
              <span className="text-sm font-bold text-amber-600">{recipe.pricePerServing.toFixed(2)} € / part</span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-gray-50 px-3 py-2">
              <ChefHat className="h-4 w-4 text-gray-400" />
              <span className="text-sm font-semibold text-gray-700">{recipe.servings} pers.</span>
            </div>
            <button
              onClick={() => toggleFavorite(recipe.id)}
              className="ml-auto flex h-9 w-9 items-center justify-center rounded-xl bg-gray-50 transition-all hover:bg-gray-100 active:scale-90"
            >
              <Heart className={`h-4 w-4 ${isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'}`} />
            </button>
          </div>

          {/* Ingredients */}
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
              <ListOrdered className="h-4 w-4" /> Ingrédients
            </h3>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {recipe.ingredients.map((ing, i) => (
                <div key={i} className="flex items-center justify-between rounded-xl bg-gray-50 px-3 py-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{AISLE_ICONS[ing.category] || '🛒'}</span>
                    <span className="text-sm font-medium text-gray-700">{ing.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">{ing.amount} {ing.unit}</span>
                    <span className="text-xs font-semibold text-amber-600">{ing.estimatedPrice.toFixed(2)} €</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Steps with timer */}
          <div className="mt-6">
            <h3 className="mb-3 flex items-center gap-2 text-sm font-bold uppercase tracking-wide text-gray-400">
              <ChefHat className="h-4 w-4" /> Étapes
            </h3>
            <div className="space-y-3">
              {recipe.steps.map((step, i) => (
                <div
                  key={i}
                  className={`rounded-2xl border p-4 transition-all ${
                    activeStep === i && timerRunning
                      ? 'border-emerald-300 bg-emerald-50/50 shadow-sm'
                      : 'border-gray-100 bg-white'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold ${
                        activeStep === i && timerRunning ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {step.stepNumber}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-gray-700">{step.instruction}</p>
                      <div className="mt-2 flex items-center gap-3">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="h-3 w-3" /> {step.durationMin} min
                        </span>
                        <button
                          onClick={() => startStepTimer(i)}
                          className="flex items-center gap-1 rounded-lg bg-emerald-500 px-2.5 py-1 text-xs font-semibold text-white transition-all hover:bg-emerald-600 active:scale-95"
                        >
                          {activeStep === i && timerRunning ? (
                            <>
                              <Pause className="h-3 w-3" /> {formatTime(secondsLeft)}
                            </>
                          ) : activeStep === i && secondsLeft === 0 && step.durationMin * 60 > 0 ? (
                            <>
                              <Check className="h-3 w-3" /> Termininé
                            </>
                          ) : (
                            <>
                              <Play className="h-3 w-3" /> Lancer minuteur
                            </>
                          )}
                        </button>
                        {activeStep === i && (timerRunning || secondsLeft > 0) && (
                          <button
                            onClick={() => {
                              setTimerRunning(false);
                              setSecondsLeft(step.durationMin * 60);
                            }}
                            className="flex items-center gap-1 rounded-lg bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-500 transition-all hover:bg-gray-200 active:scale-95"
                          >
                            <RotateCcw className="h-3 w-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
