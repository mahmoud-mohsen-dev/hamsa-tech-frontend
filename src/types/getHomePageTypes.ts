export type StrapiResponseForHomePage = {
  data: {
    id: number;
    attributes: {
      name: string;
      slug: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      locale: string;
      heroSection: HeroSectionSRT[];
    };
  }[];
  meta: Record<string, unknown>;
  error?: null | ResponseStrapiError;
};

interface ResponseStrapiError {
  status: number;
  name: string;
  message: string;
  details: object;
}

// export interface AxiosResponseForHomePage {
//   data: StrapiResponseSuccessForHomePage | null;
//   error?: null | ResponseStrapiError;
// }

export type HeroSectionSRT = {
  id: number;
  headingTop: string;
  headingBottom: string;
  direction: string;
  image: {
    data: {
      id: number;
      attributes: StrapiImageReponseAttributesType;
    };
  };
  buttonLink: {
    id: number;
    buttonText: string;
    button_slug: string;
  };
};

export type StrapiImageReponseAttributesType = {
  name: string;
  alternativeText: string;
  caption: string;
  width: number;
  height: number;
  formats: {
    thumbnail: ImageFormat;
  };
  hash: string;
  ext: string;
  mime: string;
  size: number;
  url: string;
  previewUrl: string | null;
  provider: string;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
  createdAt: string;
  updatedAt: string;
};

type ImageFormat = {
  ext: string;
  url: string;
  hash: string;
  mime: string;
  name: string;
  path: string | null;
  size: number;
  width: number;
  height: number;
  sizeInBytes: number;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
};
