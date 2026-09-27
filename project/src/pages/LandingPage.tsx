import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { RECIPES } from '@/data/recipes';
import { RecipeCard } from '@/components/RecipeCard';
import { RecipeDetailModal } from '@/components/RecipeDetailModal';
import type { Recipe } from '@/types';
import { ChefHat, ShoppingCart, Wallet, Sparkles, ChevronDown, Check, ArrowRight } from 'lucide-react';

const FAQ = [
  { q: 'Comment Romi calcule-t-il le prix des repas ?', a: 'Chaque recette contient le prix estimé de chaque ingrédient, ajusté selon les prix moyens de votre supermarché habituel. Le coût total de la semaine est calculé en temps réel et reste dans votre budget.' },
  { q: 'Puis-je remplacer un plat que je n\'aime pas ?', a: 'Oui ! Chaque plat peut être remplacé en un clic par une recette compatible avec votre budget et vos préférences alimentaires.' },
  { q: 'La liste de courses est-elle triée par rayon ?', a: 'Absolument. Tous les ingrédients de votre semaine sont agrégés automatiquement et triés par rayon de supermarché : Fruits & Légumes, Crémerie, Viandes & Poissons, Épicerie, Surgelés.' },
  { q: 'Mes données sont-elles sauvegardées ?', a: 'Oui, tout est sauvegardé localement sur votre appareil. Aucune inscription, aucun abonnement, aucune donnée envoyée sur un serveur.' },
  { q: 'Combien de recettes sont disponibles ?', a: 'Romi propose plus de 15 recettes françaises variées : du poulet katsu curry au dahl de lentilles, en passant par la ratatouille et le risotto aux champignons.' },
];

export function LandingPage() {
  const { setCurrentView } = useApp();
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const previewRecipes = RECIPES.slice(0, 6);

  return (
    <div className="min-h-screen bg-cream">
      {/* Nav */}
      <nav className="sticky top-0 z-40 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
              <ChefHat className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold text-gray-900">Romi</span>
          </div>
          <button
            onClick={() => setCurrentView('onboarding')}
            className="btn-ghost text-sm font-semibold text-emerald-600 hover:bg-emerald-50"
          >
            Commencer
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-emerald-50/60 via-transparent to-transparent" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-sm font-semibold text-emerald-700">
              <Sparkles className="h-4 w-4" />
              +12 800 foyers nous font confiance
            </div>
            <h1 className="text-4xl font-extrabold leading-tight text-gray-900 sm:text-6xl">
              Qu'est-ce qu'on mange ce soir ?
              <br />
              <span className="text-emerald-500">Plus jamais cette question.</span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-gray-500">
              Romi planifie vos repas de la semaine et génère votre liste de courses par rayon — tout en respectant votre budget.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <button
                onClick={() => setCurrentView('onboarding')}
                className="btn-primary w-full sm:w-auto"
              >
                Commencer gratuitement <ArrowRight className="h-4 w-4" />
              </button>
              <button
                onClick={() => document.getElementById('recipes-preview')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-secondary w-full sm:w-auto"
              >
                Voir les recettes
              </button>
            </div>
            <p className="mt-4 text-sm text-gray-400">Sans inscription. Sans abonnement. 100% gratuit.</p>
          </div>
        </div>
      </section>

      {/* 3 Steps */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[
            { icon: Wallet, title: 'Choisissez votre budget', desc: 'Sélectionnez votre supermarché et votre budget courses hebdomadaire.', color: 'bg-emerald-50 text-emerald-600' },
            { icon: ChefHat, title: 'Romi prépare la semaine', desc: 'Un menu de 5 repas est généré automatiquement, ajusté à votre budget.', color: 'bg-amber-50 text-amber-600' },
            { icon: ShoppingCart, title: 'Votre liste prête par rayon', desc: 'Tous les ingrédients agrégés et triés par rayon de supermarché.', color: 'bg-blue-50 text-blue-600' },
          ].map((step, i) => (
            <div key={i} className="card p-6 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
              <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-2xl ${step.color}`}>
                <step.icon className="h-6 w-6" />
              </div>
              <div className="mb-1 text-sm font-bold text-gray-300">Étape {i + 1}</div>
              <h3 className="text-lg font-bold text-gray-900">{step.title}</h3>
              <p className="mt-1 text-sm text-gray-500">{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Recipe Preview */}
      <section id="recipes-preview" className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900">Des recettes pour tous les goûts</h2>
          <p className="mt-2 text-gray-500">Chaque recette indique le temps de préparation, le prix par portion et les tags.</p>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {previewRecipes.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
          ))}
        </div>
      </section>

      {/* Pricing / Value */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-500 to-emerald-600 p-8 text-center sm:p-12">
          <h2 className="text-3xl font-bold text-white sm:text-4xl">100% gratuit, pour toujours</h2>
          <p className="mx-auto mt-3 max-w-md text-emerald-50">
            Pas d'abonnement, pas d'essai limité. Toutes les fonctionnalités, sans limite.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6 text-white">
            {['Planificateur de repas', 'Liste de courses', 'Minuteur intégré', 'Favoris', 'Budget illimité'].map((f) => (
              <div key={f} className="flex items-center gap-2 text-sm font-medium">
                <Check className="h-4 w-4" /> {f}
              </div>
            ))}
          </div>
          <button
            onClick={() => setCurrentView('onboarding')}
            className="mt-8 inline-flex items-center justify-center gap-2 rounded-2xl bg-white px-8 py-4 font-bold text-emerald-600 shadow-lg transition-all hover:bg-emerald-50 active:scale-[0.98]"
          >
            Commencer maintenant <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-3xl px-5 py-12">
        <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Questions fréquentes</h2>
        <div className="space-y-3">
          {FAQ.map((item, i) => (
            <div key={i} className="card overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="flex w-full items-center justify-between px-5 py-4 text-left"
              >
                <span className="font-semibold text-gray-900">{item.q}</span>
                <ChevronDown
                  className={`h-5 w-5 shrink-0 text-gray-400 transition-transform ${openFaq === i ? 'rotate-180' : ''}`}
                />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-4 text-sm text-gray-500 animate-fade-in">{item.a}</div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 bg-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-5 py-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <ChefHat className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900">Romi</span>
          </div>
          <p className="text-sm text-gray-400">Planificateur de repas intelligent — sans inscription, sans abonnement.</p>
        </div>
      </footer>

      <RecipeDetailModal recipe={selectedRecipe} open={!!selectedRecipe} onClose={() => setSelectedRecipe(null)} />
    </div>
  );
}
