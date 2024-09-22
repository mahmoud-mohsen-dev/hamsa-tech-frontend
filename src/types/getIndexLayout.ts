export interface NavbarLink {
  id: string;
  name: string;
  slug: string;
}

interface SocialLink {
  id: string;
  url: string;
  icon: string;
}

interface QuickLink {
  id: string;
  name: string;
  slug: string;
}

export interface FooterSectionType {
  description: string;
  contact_us_phone: string;
  contact_us_email: string;
  social_links: SocialLink[];
  quick_links: QuickLink[];
}

interface PageAttributes {
  navbar: NavbarLink[];
  footer: FooterSectionType;
}

interface PageData {
  attributes: PageAttributes;
}

interface Pages {
  data: PageData[];
}

interface LayoutData {
  pages: Pages;
}

export interface LayoutResponse {
  data: LayoutData;
  error: string | null;
}
