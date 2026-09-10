import React from 'react';
import { categories as fallbackCategories, Category } from '../data/categories';
import { CategoryId } from '../data/types';
import { fetchRemoteCategories } from './remote';

type CategoriesContextValue = {
  categories: Category[];
  categoryById: (id: CategoryId) => Category;
};

const CategoriesContext = React.createContext<CategoriesContextValue | null>(null);

export function CategoriesProvider({ children }: { children: React.ReactNode }) {
  const [categories, setCategories] = React.useState<Category[]>(fallbackCategories);

  React.useEffect(() => {
    let alive = true;
    (async () => {
      const remote = await fetchRemoteCategories();
      if (alive && remote?.length) setCategories(remote);
    })();
    return () => {
      alive = false;
    };
  }, []);

  const value = React.useMemo<CategoriesContextValue>(
    () => ({
      categories,
      categoryById: (id) =>
        categories.find((c) => c.id === id) ?? categories[0] ?? fallbackCategories[0],
    }),
    [categories],
  );

  return <CategoriesContext.Provider value={value}>{children}</CategoriesContext.Provider>;
}

export function useCategories() {
  const ctx = React.useContext(CategoriesContext);
  if (!ctx) throw new Error('useCategories must be used inside CategoriesProvider');
  return ctx;
}
