// types/PropertyDetails.ts

export interface PropertyDetails {
  id: number;
  propertyId: string;
  title: string;
  description?: string | null;
  price: number;
  availability: boolean;
  videoUrl?: string | null;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    avatarUrl?: string | null;
  };
  type: { id: number; value: string };
  status: { id: number; value: string };
  provider?: { id: string; value: string } | null;
  features?: {
    id: number;
    value: string;
    bedrooms?: number | null;
    bathrooms?: number | null;
    halfBathrooms?: number | null;
    balcon?: boolean | null;
    pool?: boolean | null;
    terrainM2?: number | null;
    constructionM2?: number | null;
    levels?: number | null;
    downtown?: boolean | null;
    parking?: number | null;
    acceptsCreditBank?: boolean | null;
    acceptsCreditSocial?: boolean | null;
    age?: number | null;
    connectivity?: string | null;
    furnished?: boolean | null;
    greenAreas?: string | null;
  } | null;
  location?: {
    id: number;
    value: string;
    address?: string | null;
    zipCode?: number | null;
    urlGoogleMaps?: string | null;
    city: {
      id: number;
      name: string;
      state: { id: number; name: string };
    };
  } | null;
  images: { id: number; url: string }[];
}
