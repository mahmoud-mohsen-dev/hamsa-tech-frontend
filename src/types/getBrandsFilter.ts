// Define the interface for each brand's attributes
interface BrandAttributes {
  name: string;
  slug: string;
}

// Define the interface for the brand data
export interface BrandData {
  attributes: BrandAttributes;
}

// Define the interface for the brands response
interface BrandsResponse {
  brands: { data: BrandData[] };
}

// Define the overall response type that includes error handling
export interface BrandsFilterResponseType {
  data: BrandsResponse | null;
  error: string | null; // Assuming error can be a string or null
}
