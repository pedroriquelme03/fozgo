import { supabase } from '../lib/supabase';
import { CategoryId, MenuSection, Place, PriceRange, Review } from '../data/types';

const CATEGORIES = new Set<CategoryId>([
  'restaurantes',
  'cafes',
  'bares',
  'pontos',
  'hoteis',
  'passeios',
  'clima',
  'transporte',
  'guias',
  'ingressos',
]);

type PlaceRow = {
  id: string;
  name: string;
  category: string;
  tagline: string | null;
  description: string | null;
  photos: string[] | null;
  neighborhood: string | null;
  address: string | null;
  lat: number;
  lng: number;
  hours: Place['hours'] | null;
  phone: string | null;
  whatsapp: string | null;
  socials: Place['socials'] | null;
  rating: number | string | null;
  reviews_count: number | null;
  price_range: number | null;
  payment_methods: string[] | null;
  tags: string[] | null;
  featured: boolean | null;
  distance_km: number | string | null;
  ticket: string | null;
  important_info: string[] | null;
  how_to_arrive: string | null;
  menu: MenuSection[] | null;
  sample_reviews: Review[] | null;
};

function asCategory(value: string): CategoryId | null {
  return CATEGORIES.has(value as CategoryId) ? (value as CategoryId) : null;
}

function asPrice(value: number | null): PriceRange {
  if (value === 1 || value === 2 || value === 3 || value === 4) return value;
  return 2;
}

export function mapPlaceRow(row: PlaceRow): Place | null {
  const category = asCategory(row.category);
  if (!category) return null;
  return {
    id: row.id,
    name: row.name,
    category,
    tagline: row.tagline ?? '',
    description: row.description ?? '',
    photos: row.photos ?? [],
    neighborhood: row.neighborhood ?? '',
    address: row.address ?? '',
    coords: { lat: row.lat, lng: row.lng },
    hours: row.hours ?? [],
    phone: row.phone ?? undefined,
    whatsapp: row.whatsapp ?? undefined,
    socials: row.socials ?? undefined,
    rating: Number(row.rating ?? 0),
    reviewsCount: row.reviews_count ?? 0,
    priceRange: asPrice(row.price_range),
    paymentMethods: row.payment_methods ?? undefined,
    tags: row.tags ?? [],
    featured: !!row.featured,
    distanceKm: row.distance_km == null ? undefined : Number(row.distance_km),
    reviews: row.sample_reviews ?? undefined,
    menu: row.menu ?? undefined,
    ticket: row.ticket ?? undefined,
    importantInfo: row.important_info ?? undefined,
    howToArrive: row.how_to_arrive ?? undefined,
  };
}

export async function fetchRemotePlaces(): Promise<Place[] | null> {
  const { data, error } = await supabase
    .from('places')
    .select(
      'id, name, category, tagline, description, photos, neighborhood, address, lat, lng, hours, phone, whatsapp, socials, rating, reviews_count, price_range, payment_methods, tags, featured, distance_km, ticket, important_info, how_to_arrive, menu, sample_reviews',
    )
    .eq('published', true)
    .order('featured', { ascending: false })
    .order('rating', { ascending: false });
  if (error || !data) return null;
  return (data as PlaceRow[]).map(mapPlaceRow).filter((p): p is Place => p != null);
}
