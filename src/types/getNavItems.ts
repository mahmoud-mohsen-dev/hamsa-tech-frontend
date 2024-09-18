export interface NavbarLink {
  id: number;
  __component: string;
  name: string;
  slug: string;
}

export interface NavbarLinkApiAttributes {
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  locale: string;
  navbar: NavbarLink[];
  localizations: {
    data: NavbarLinkLocalization[];
  };
}

export interface NavbarLinkLocalization {
  id: number;
  attributes: {
    name: string;
    slug: string;
    createdAt: string;
    updatedAt: string;
    publishedAt: string;
    locale: string;
  };
}

export interface NavbarLinkData {
  id: number;
  attributes: NavbarLinkApiAttributes;
}

export interface MetaPagination {
  page: number;
  pageSize: number;
  pageCount: number;
  total: number;
}

export interface NavbarLinkMeta {
  pagination: MetaPagination;
}

export interface ResponseStrapiError {
  status: number;
  name: string;
  message: string;
  details: object;
}

export interface ResponseGetNavbarLinksService {
  data: NavbarLinkData[];
  meta?: NavbarLinkMeta;
  error?: null | ResponseStrapiError;
}

// export interface ResponseGetNavbarLinksService {
//   data: NavbarLinkDataResponse | null;
//   error?: null | string;
// }
