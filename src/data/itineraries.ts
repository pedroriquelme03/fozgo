import { Ionicons } from '@expo/vector-icons';
import { Place } from './types';
import { placeById } from './places';

export interface ItineraryStop {
  placeId: string;
  time: string;
  duration: string;
  tip: string;
}

export interface Itinerary {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  duration: string;
  tag: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  tint: string;
  coverPlaceId: string;
  stops: ItineraryStop[];
}

export const itineraries: Itinerary[] = [
  {
    id: 'um-dia-em-foz',
    title: 'Um dia em Foz',
    subtitle: 'O clássico completo',
    description: 'Aves, cataratas, bote e pôr do sol no Marco — o roteiro para quem tem um dia e não quer perder o essencial.',
    duration: '10h',
    tag: 'Imperdível',
    icon: 'sunny',
    color: '#0EA5B7',
    tint: '#E1F5F7',
    coverPlaceId: 'cataratas-do-iguacu',
    stops: [
      { placeId: 'parque-das-aves', time: '08:30', duration: '2h', tip: 'Chegue na abertura para ver as araras ativas.' },
      { placeId: 'cataratas-do-iguacu', time: '11:00', duration: '3h', tip: 'Trilha da Garganta do Diabo: leve capa de chuva.' },
      { placeId: 'macuco-safari', time: '14:30', duration: '1h30', tip: 'Você se molha. Proteja o celular.' },
      { placeId: 'marco-das-tres-fronteiras', time: '17:30', duration: '2h', tip: 'Chegue no fim da tarde para o pôr do sol e o show.' },
    ],
  },
  {
    id: 'cataratas-classicas',
    title: 'Cataratas clássicas',
    subtitle: 'Meio período no parque',
    description: 'Parque das Aves + Cataratas + o hotel-ícone dentro do parque. Ideal se você chega depois do almoço ou viaja com crianças.',
    duration: '6h',
    tag: 'Família',
    icon: 'leaf',
    color: '#16A34A',
    tint: '#E6F6EC',
    coverPlaceId: 'parque-das-aves',
    stops: [
      { placeId: 'parque-das-aves', time: '09:00', duration: '2h', tip: 'Fica ao lado da entrada das Cataratas.' },
      { placeId: 'cataratas-do-iguacu', time: '11:30', duration: '3h', tip: 'Ônibus panorâmico já está no ingresso.' },
      { placeId: 'belmond-hotel-das-cataratas', time: '15:00', duration: '1h', tip: 'Mesmo sem hospedar, vale um café na varanda.' },
    ],
  },
  {
    id: 'noite-no-centro',
    title: 'Noite no Centro',
    subtitle: 'Jantar, drinks e música',
    description: 'Comece no japonês, siga para o bar com música ao vivo e feche a noite na Vila Portes. Tudo de Uber, sem precisar de carro.',
    duration: '5h',
    tag: 'Vida noturna',
    icon: 'moon',
    color: '#7C3AED',
    tint: '#F1EAFE',
    coverPlaceId: 'capitao-bar',
    stops: [
      { placeId: 'vento-haru', time: '19:00', duration: '1h30', tip: 'Reserve o rodízio — enche nos fins de semana.' },
      { placeId: 'capitao-bar', time: '21:00', duration: '2h', tip: 'Palco com banda ao vivo a partir das 22h.' },
      { placeId: 'bar-latino', time: '23:30', duration: '1h30', tip: 'Carta de drinks; peça o gin da casa.' },
    ],
  },
  {
    id: 'foz-com-chuva',
    title: 'Foz com chuva',
    subtitle: 'Plano B indoor',
    description: 'Quando fechar o tempo nas Cataratas: Itaipu coberta, almoço japonês e resort com spa. O dia não precisa parar.',
    duration: '7h',
    tag: 'Plano B',
    icon: 'rainy',
    color: '#0284C7',
    tint: '#E0F2FE',
    coverPlaceId: 'usina-de-itaipu',
    stops: [
      { placeId: 'usina-de-itaipu', time: '09:00', duration: '3h', tip: 'O passeio panorâmico é quase todo coberto.' },
      { placeId: 'vento-haru', time: '13:00', duration: '1h30', tip: 'Almoço fora do horário de pico.' },
      { placeId: 'wish-foz-do-iguacu', time: '15:30', duration: '2h', tip: 'Piscinas cobertas e spa — day use sob consulta.' },
    ],
  },
  {
    id: 'triplice-fronteira',
    title: 'Tríplice fronteira',
    subtitle: 'Brasil, Argentina e Paraguai',
    description: 'Pôr do sol no encontro dos rios, passeio no Lago de Itaipu e drinks na Vila Portes, de frente para a fronteira.',
    duration: '6h',
    tag: 'Pôr do sol',
    icon: 'flag',
    color: '#E11D48',
    tint: '#FFE4EA',
    coverPlaceId: 'marco-das-tres-fronteiras',
    stops: [
      { placeId: 'kattamaram-passeio-de-barco', time: '14:00', duration: '2h30', tip: 'Pegue o horário da tarde para chegar perto do pôr do sol.' },
      { placeId: 'marco-das-tres-fronteiras', time: '17:30', duration: '2h', tip: 'Os três obeliscos ficam visíveis do mirante.' },
      { placeId: 'bar-latino', time: '20:30', duration: '1h30', tip: 'Vila Portes — um pulo da Ponte da Amizade.' },
    ],
  },
];

export const itineraryById = (id: string, extras: Itinerary[] = []) =>
  extras.find((i) => i.id === id) ?? itineraries.find((i) => i.id === id);

export const placesInItinerary = (it: Itinerary, lookup = placeById): Place[] =>
  it.stops.map((s) => lookup(s.placeId)).filter((p): p is Place => p != null);

const STOP_HOURS = ['09:00', '11:30', '14:00', '16:30', '19:00', '21:00'];

export function makeCustomItinerary(title: string, placeIds: string[]): Itinerary {
  const name = title.trim() || 'Meu roteiro';
  return {
    id: `meu-${Date.now()}`,
    title: name,
    subtitle: 'Montado por você',
    description: 'Roteiro personalizado com os lugares que você escolheu, na ordem em que tocou.',
    duration: `${Math.max(2, placeIds.length * 2)}h`,
    tag: 'Seu roteiro',
    icon: 'sparkles',
    color: '#0EA5B7',
    tint: '#E1F5F7',
    coverPlaceId: placeIds[0],
    stops: placeIds.map((placeId, i) => ({
      placeId,
      time: STOP_HOURS[i] ?? `${String(9 + i).padStart(2, '0')}:00`,
      duration: '1h30',
      tip: 'Parada do seu roteiro.',
    })),
  };
}

let extras: Itinerary[] = [];
const extraListeners = new Set<() => void>();

export function getCustomItineraries() {
  return extras;
}

export function subscribeCustomItineraries(onChange: () => void) {
  extraListeners.add(onChange);
  return () => {
    extraListeners.delete(onChange);
  };
}

export function addCustomItinerary(it: Itinerary) {
  extras = [it, ...extras];
  extraListeners.forEach((fn) => fn());
}
