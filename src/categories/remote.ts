import { supabase } from '../lib/supabase';
import { Category } from '../data/categories';
import { CategoryId } from '../data/types';

type CategoryRow = {
  id: string;
  label: string | null;
  icon: string | null;
  base: string | null;
  tint: string | null;
};

export async function fetchRemoteCategories(): Promise<Category[] | null> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, label, icon, base, tint')
    .order('sort_order', { ascending: true });
  if (error || !data) return null;
  return (data as CategoryRow[]).map((r) => ({
    id: r.id as CategoryId,
    label: r.label ?? '',
    icon: r.icon ?? '',
    base: r.base ?? '#0EA5B7',
    tint: r.tint ?? '#E1F5F7',
  }));
}
