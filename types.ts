
export enum Category {
  WORK = 'Work',
  PERSONAL = 'Personal',
  POTENTIAL_CLIENT = 'Potential Client',
  OTHER = 'Other',
}

export interface BusinessCard {
  id: string;
  name: string;
  company: string;
  position: string;
  phone: string;
  email: string;
  website: string;
  address: string;
  category: string;
  imageUrl: string;
}

export type ExtractedCardData = Omit<BusinessCard, 'id' | 'category' | 'imageUrl'>;
