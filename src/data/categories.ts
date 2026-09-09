import { CategoryId } from './types';
import { categoryColors } from '../theme/colors';

export interface Category {
  id: CategoryId;
  label: string;
  icon: string; // Ionicons name
  base: string;
  tint: string;
}

export const categories: Category[] = [
  { id: 'restaurantes', label: 'Restaurantes', icon: 'restaurant', ...categoryColors.restaurantes },
  { id: 'cafes', label: 'Cafés', icon: 'cafe', ...categoryColors.cafes },
  { id: 'bares', label: 'Bares', icon: 'wine', ...categoryColors.bares },
  { id: 'pontos', label: 'Pontos turísticos', icon: 'camera', ...categoryColors.pontos },
  { id: 'passeios', label: 'Passeios', icon: 'boat', ...categoryColors.passeios },
  { id: 'hoteis', label: 'Hotéis', icon: 'bed', ...categoryColors.hoteis },
  { id: 'ingressos', label: 'Ingressos', icon: 'ticket', ...categoryColors.ingressos },
  { id: 'transporte', label: 'Transporte', icon: 'car-sport', ...categoryColors.transporte },
  { id: 'guias', label: 'Guias', icon: 'people', ...categoryColors.guias },
  { id: 'clima', label: 'Previsão', icon: 'partly-sunny', ...categoryColors.clima },
];

export const categoryById = (id: CategoryId) =>
  categories.find((c) => c.id === id) ?? categories[0];
