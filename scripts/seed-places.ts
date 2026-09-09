import { writeFileSync } from 'fs';
import { places } from '../src/data/places';

function lit(value: string | null | undefined) {
  if (value == null) return 'null';
  return `$$${value}$$`;
}

function textArray(values: string[] | undefined) {
  if (!values?.length) return `'{}'::text[]`;
  return `ARRAY[${values.map((v) => lit(v)).join(', ')}]::text[]`;
}

function json(value: unknown) {
  if (value == null) return 'null';
  return `${lit(JSON.stringify(value))}::jsonb`;
}

function num(value: number | undefined | null) {
  if (value == null) return 'null';
  return String(value);
}

const rows = places.map((p) => {
  const cols = [
    lit(p.id),
    lit(p.name),
    lit(p.category),
    lit(p.tagline),
    lit(p.description),
    textArray(p.photos),
    lit(p.neighborhood),
    lit(p.address),
    num(p.coords.lat),
    num(p.coords.lng),
    json(p.hours),
    lit(p.phone),
    lit(p.whatsapp),
    json(p.socials ?? null),
    num(p.rating),
    num(p.reviewsCount),
    num(p.priceRange),
    textArray(p.paymentMethods),
    textArray(p.tags),
    p.featured ? 'true' : 'false',
    num(p.distanceKm),
    lit(p.ticket),
    textArray(p.importantInfo),
    lit(p.howToArrive),
    json(p.menu ?? null),
    json(p.reviews ?? null),
  ];
  return `(${cols.join(', ')})`;
});

const sql = `insert into public.places (
  id, name, category, tagline, description, photos, neighborhood, address,
  lat, lng, hours, phone, whatsapp, socials, rating, reviews_count, price_range,
  payment_methods, tags, featured, distance_km, ticket, important_info,
  how_to_arrive, menu, sample_reviews
) values
${rows.join(',\n')}
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  tagline = excluded.tagline,
  description = excluded.description,
  photos = excluded.photos,
  neighborhood = excluded.neighborhood,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  socials = excluded.socials,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  price_range = excluded.price_range,
  payment_methods = excluded.payment_methods,
  tags = excluded.tags,
  featured = excluded.featured,
  distance_km = excluded.distance_km,
  ticket = excluded.ticket,
  important_info = excluded.important_info,
  how_to_arrive = excluded.how_to_arrive,
  menu = excluded.menu,
  sample_reviews = excluded.sample_reviews,
  updated_at = now();
`;

const header = `insert into public.places (
  id, name, category, tagline, description, photos, neighborhood, address,
  lat, lng, hours, phone, whatsapp, socials, rating, reviews_count, price_range,
  payment_methods, tags, featured, distance_km, ticket, important_info,
  how_to_arrive, menu, sample_reviews
) values
`;
const upsert = `
on conflict (id) do update set
  name = excluded.name,
  category = excluded.category,
  tagline = excluded.tagline,
  description = excluded.description,
  photos = excluded.photos,
  neighborhood = excluded.neighborhood,
  address = excluded.address,
  lat = excluded.lat,
  lng = excluded.lng,
  hours = excluded.hours,
  phone = excluded.phone,
  whatsapp = excluded.whatsapp,
  socials = excluded.socials,
  rating = excluded.rating,
  reviews_count = excluded.reviews_count,
  price_range = excluded.price_range,
  payment_methods = excluded.payment_methods,
  tags = excluded.tags,
  featured = excluded.featured,
  distance_km = excluded.distance_km,
  ticket = excluded.ticket,
  important_info = excluded.important_info,
  how_to_arrive = excluded.how_to_arrive,
  menu = excluded.menu,
  sample_reviews = excluded.sample_reviews,
  updated_at = now();
`;

writeFileSync(
  'scripts/places-seed.json',
  JSON.stringify(
    places.map((p) => ({
      id: p.id,
      name: p.name,
      category: p.category,
      tagline: p.tagline,
      description: p.description,
      photos: p.photos,
      neighborhood: p.neighborhood,
      address: p.address,
      lat: p.coords.lat,
      lng: p.coords.lng,
      hours: p.hours,
      phone: p.phone ?? null,
      whatsapp: p.whatsapp ?? null,
      socials: p.socials ?? null,
      rating: p.rating,
      reviews_count: p.reviewsCount,
      price_range: p.priceRange,
      payment_methods: p.paymentMethods ?? [],
      tags: p.tags,
      featured: !!p.featured,
      distance_km: p.distanceKm ?? null,
      ticket: p.ticket ?? null,
      important_info: p.importantInfo ?? [],
      how_to_arrive: p.howToArrive ?? null,
      menu: p.menu ?? null,
      sample_reviews: p.reviews ?? null,
    })),
  ),
);
writeFileSync('scripts/seed-places.sql', sql);
const mid = Math.ceil(rows.length / 2);
writeFileSync('scripts/seed-places-a.sql', header + rows.slice(0, mid).join(',\n') + upsert);
writeFileSync('scripts/seed-places-b.sql', header + rows.slice(mid).join(',\n') + upsert);
console.log(`seeded ${places.length} places, ${places.reduce((n, p) => n + p.photos.length, 0)} photos`);
