
export interface WeaponSkin {
    id: string
    item: string
    skin: string
    statTrak: boolean
    imageUrl: string
    wear: string
 
    rarity: 'consumer' | 'industrial' | 'mil-spec' | 'restricted' | 'classified' | 'covert' | 'rare'
  }
  
  export interface Case {
    id: string
    name: string
    price: number
    imageUrl: string
  }
  
  export interface CaseState {
    isSpinning: boolean
    selectedItem: WeaponSkin | null
    items: WeaponSkin[]
  }
