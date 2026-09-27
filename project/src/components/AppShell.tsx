import type { ReactNode } from 'react';
import { useApp } from '@/context/AppContext';
import { ChefHat, Calendar, ShoppingCart, BookOpen, Settings } from 'lucide-react';

interface NavItem {
  id: string;
  label: string;
  icon: typeof ChefHat;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Menu', icon: Calendar },
  { id: 'shopping-list', label: 'Courses', icon: ShoppingCart },
  { id: 'recipes', label: 'Recettes', icon: BookOpen },
  { id: 'settings', label: 'Réglages', icon: Settings },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { state, setCurrentView } = useApp();

  return (
    <div className="min-h-screen bg-cream">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-3">
          <button onClick={() => setCurrentView('dashboard')} className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500 text-white">
              <ChefHat className="h-4 w-4" />
            </div>
            <span className="font-bold text-gray-900">Romi</span>
          </button>
          <div className="text-sm text-gray-400">
            {state.profile.adults + state.profile.children} pers. · {state.profile.weeklyBudget} €
          </div>
        </div>
      </header>

      <main>{children}</main>

      {/* Bottom nav */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-gray-100 bg-white/90 backdrop-blur-lg">
        <div className="mx-auto flex max-w-5xl items-center justify-around px-5 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive = state.currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setCurrentView(item.id)}
                className={`flex flex-col items-center gap-1 rounded-xl px-4 py-2 transition-all active:scale-95 ${
                  isActive ? 'text-emerald-600' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'stroke-[2.5]' : ''}`} />
                <span className="text-xs font-semibold">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
