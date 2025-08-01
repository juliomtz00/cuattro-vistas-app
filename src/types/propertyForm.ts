export interface PropertyFormData {
  propertyId: string;
  title: string;
  description?: string;
  price: string;
  availability: boolean;
  videoUrl?: string;

  // Relation IDs as strings for HeroUI Select
  propertyTypeId: string;
  statusId: string;
  providerId?: string;
  propertyRangeId?: string;
  illuminationId?: string;
  propertyConditionId?: string;
  zoneDemandId?: string;
  accesibilityId?: string;

  stateId: string;
  cityId: string;

  address?: string;
  zipCode: string;
  urlGoogleMaps?: string;

  bedrooms?: string;
  bathrooms?: string;
  halfBathrooms?: string;
  balcon: boolean;
  pool: boolean;
  furnished: boolean;
  downtown: boolean;
  terrainM2?: string;
  constructionM2?: string;
  levels?: string;
  parking?: string;
  acceptsCreditBank: boolean;
  acceptsCreditSocial: boolean;
  age?: string;
  connectivity?: string;
  greenAreas?: string;
  files: File[];
}
