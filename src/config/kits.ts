import { KitConfig } from '../types';
import { Sword, Axe, Diamond, Heart, FlaskRound as Flask, TreePine, Gem, Shield, AlignJustify, ShieldX } from 'lucide-react';

export const KITS: KitConfig[] = [
  {
    id: 'sword',
    name: 'Sword',
    icon: 'Sword',
    color: '#60a5fa'
  },
  {
    id: 'axe',
    name: 'Axe',
    icon: 'Axe',
    color: '#94a3b8'
  },
  {
    id: 'crystal',
    name: 'Crystal',
    icon: 'Diamond',
    color: '#c084fc'
  },
  {
    id: 'uhc',
    name: 'UHC',
    icon: 'Heart',
    color: '#f87171'
  },
  {
    id: 'smp',
    name: 'SMP',
    icon: 'TreePine',
    color: '#4ade80'
  },
  {
    id: 'diasmp',
    name: 'DiaSMP',
    icon: 'Gem',
    color: '#38bdf8'
  },
  {
    id: 'diapot',
    name: 'DiaPot',
    icon: 'Flask',
    color: '#a78bfa'
  },
  {
    id: 'npot',
    name: 'NPot',
    icon: 'Flask',
    color: '#fbbf24'
  },
  {
    id: 'mace',
    name: 'Mace',
    icon: 'AlignJustify',
    color: '#a1a1aa'
  },
  {
    id: 'shieldless',
    name: 'Shieldless',
    icon: 'ShieldX',
    color: '#f472b6'
  }
];

export const getKitIcon = (kitId: string) => {
  const kit = KITS.find(k => k.id === kitId);
  
  switch(kit?.icon) {
    case 'Sword': return Sword;
    case 'Axe': return Axe;
    case 'Diamond': return Diamond;
    case 'Heart': return Heart;
    case 'Flask': return Flask;
    case 'TreePine': return TreePine;
    case 'Gem': return Gem;
    case 'Shield': return Shield;
    case 'AlignJustify': return AlignJustify;
    case 'ShieldX': return ShieldX;
    default: return Sword;
  }
};