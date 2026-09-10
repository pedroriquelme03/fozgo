import { Ionicons } from '@expo/vector-icons';
import { supabase } from '../lib/supabase';
import { Itinerary } from '../data/itineraries';
import { ItineraryStop } from '../data/itineraries';

type ItineraryRow = {
  id: string;
  title: string | null;
  subtitle: string | null;
  description: string | null;
  duration: string | null;
  tag: string | null;
  icon: string | null;
  color: string | null;
  tint: string | null;
  cover_place_id: string | null;
  stops: ItineraryStop[] | null;
};

export async function fetchRemoteItineraries(): Promise<Itinerary[] | null> {
  const { data, error } = await supabase
    .from('itineraries')
    .select(
      'id, title, subtitle, description, duration, tag, icon, color, tint, cover_place_id, stops',
    )
    .eq('published', true)
    .order('sort_order', { ascending: true });
  if (error || !data) return null;
  return (data as ItineraryRow[]).map((r) => ({
    id: r.id,
    title: r.title ?? '',
    subtitle: r.subtitle ?? '',
    description: r.description ?? '',
    duration: r.duration ?? '',
    tag: r.tag ?? '',
    icon: (r.icon ?? 'sparkles') as keyof typeof Ionicons.glyphMap,
    color: r.color ?? '#0EA5B7',
    tint: r.tint ?? '#E1F5F7',
    coverPlaceId: r.cover_place_id ?? '',
    stops: r.stops ?? [],
  }));
}
