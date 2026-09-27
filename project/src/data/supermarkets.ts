import type { SupermarketId } from '@/types';

export interface Supermarket {
  id: SupermarketId;
  name: string;
  color: string;
  priceLevel: 1 | 2 | 3;
}

export const SUPERMARKETS: Supermarket[] = [
  { id: 'lidl', name: 'Lidl', color: '#0050AA', priceLevel: 1 },
  { id: 'carrefour', name: 'Carrefour', color: '#1957B5', priceLevel: 3 },
  { id: 'leclerc', name: 'E.Leclerc', color: '#0066B3', priceLevel: 2 },
  { id: 'auchan', name: 'Auchan', color: '#D6182D', priceLevel: 3 },
  { id: 'intermarche', name: 'Intermarché', color: '#E2001A', priceLevel: 2 },
  { id: 'aldi', name: 'Aldi', color: '#0000B0', priceLevel: 1 },
  { id: 'superu', name: 'Super U', color: '#E30613', priceLevel: 2 },
  { id: 'grandfrais', name: 'Grand Frais', color: '#C92A2A', priceLevel: 3 },
  { id: 'franprix', name: 'Franprix', color: '#F4511E', priceLevel: 3 },
];

export const SUPERMARKET_MAP: Record<SupermarketId, Supermarket> = Object.fromEntries(
  SUPERMARKETS.map((s) => [s.id, s])
) as Record<SupermarketId, Supermarket>;
