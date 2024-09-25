// Define a type for the child elements that can appear inside other blocks
export interface RichTextChild {
  text: string;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  strikethrough?: boolean;
  code?: boolean;
  link?: { url: string; title: string };
}

// Define the types for different rich text blocks
export interface RichTextHeading {
  type: 'heading';
  level: 1 | 2 | 3 | 4 | 5 | 6;
  children: RichTextChild[];
}

export interface RichTextParagraph {
  type: 'paragraph';
  children: RichTextChild[];
}

export interface RichTextImage {
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
  children: RichTextChild[];
}

export interface RichTextQuote {
  type: 'quote';
  children: RichTextChild[];
}

export interface RichTextCodeBlock {
  type: 'code_block';
  children: { text: string; language?: string }[];
}

export interface RichTextBulletList {
  type: 'bullet_list';
  children: { type: 'list_item'; children: RichTextChild[] }[];
}

export interface RichTextNumberedList {
  type: 'numbered_list';
  children: { type: 'list_item'; children: RichTextChild[] }[];
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

// Define a union type for the long_description field
export type LongDescriptionBlock =
  | RichTextHeading
  | RichTextParagraph
  | RichTextImage
  | RichTextQuote
  | RichTextCodeBlock
  | RichTextBulletList
  | RichTextNumberedList;
