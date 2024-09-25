// Define a type for the child elements that can appear inside other blocks
export interface TextType {
  type: 'text';
  text: string;
  code?: boolean;
  strikethrough?: boolean;
  underline?: boolean;
  italic?: boolean;
  bold?: boolean;
}

// Define the types for different rich text blocks

export interface LinkType {
  type: 'link';
  url: string;
  children: TextType[];
}

type H1ToH6Nums = 1 | 2 | 3 | 4 | 5 | 6;

export interface HeadingType {
  type: 'heading';
  children: (TextType | LinkType)[];
  level: H1ToH6Nums;
}

export interface ParagraphType {
  type: 'paragraph';
  children: (TextType | LinkType)[];
}

export interface QuoteType {
  type: 'quote';
  children: (TextType | LinkType)[];
}

export interface CodeType {
  type: 'code';
  children: [
    {
      type: 'text';
      text: string;
    }
  ];
}

export interface ListItemType {
  type: 'list-item';
  children: (TextType | LinkType)[];
}

export interface ListType {
  type: 'list';
  format: 'unordered' | 'ordered';
  children: ListItemType[];
}

// Image formats definition
export interface ImageFormat {
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
  provider_metadata: { public_id: string; resource_type: string };
}

export interface ImageType {
  type: 'image';
  image: {
    ext: string;
    url: string;
    hash: string;
    mime: string;
    name: string;
    size: number;
    width: number;
    height: number;
    caption: string | null;
    formats: {
      small?: ImageFormat;
      medium?: ImageFormat;
      thumbnail?: ImageFormat;
    };
    provider: string;
    createdAt: string;
    updatedAt: string;
  };
  children: TextType[];
  provider: string;
  createdAt: string;
  updatedAt: string;
  previewUrl: string | null;
  alternativeText: string | null;
  provider_metadata: {
    public_id: string;
    resource_type: string;
  };
}

export type ContentType =
  | ParagraphType
  | HeadingType
  | ListType
  | QuoteType
  | CodeType
  | ImageType;
