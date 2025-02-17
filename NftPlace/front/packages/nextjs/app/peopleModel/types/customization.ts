import * as THREE from 'three';

export interface CustomizationItem {
  id: string;
  name: string;
  category: 'head' |'top' | 'bottom' | 'accessories';
  modelPath: string;
  thumbnail: string;
  rarity?: 'common' | 'rare' | 'epic';
  slot?: number;

}

export interface EquipmentSlot {
  id: string;
  category: string;
  item: THREE.Object3D | null;
}

export interface CategoryTab {
  id: string;
  label: string;
  category: string;
}

export interface AnimationAction {
  weight: number;
  action?: THREE.AnimationAction;
}

export interface AnimationActions {
  [key: string]: AnimationAction;
}

export type BodyPart = 'head' | 'upperBody' | 'lowerBody' | 'feet';

