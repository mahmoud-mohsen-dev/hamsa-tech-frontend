import { ContentType } from './richTextBlock';

type Seo = {
  metaTitle: string | null;
  metaDescription: string | null;
  keywords: string | null;
};

type SeoMetaImage = {
  data: {
    attributes: {
      name: string | null;
      url: string | null;
      alternativeText: string | null;
      formats: {
        thumbnail: {
          ext: string | null;
          url: string | null;
          hash: string | null;
          mime: string | null;
          name: string | null;
          path: string | null;
          size: number | null;
          width: number | null;
          height: number | null;
          sizeInBytes: number | null;
          provider_metadata: {
            public_id: string | null;
            resource_type: string | null;
          };
        } | null;
      } | null;
    } | null;
  } | null;
};

// Privacy Policy

type PrivacyPolicy = {
  privacyPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        content: ContentType[] | null;
        updatedAt: string;
        publishedAt: string;
      };
    } | null;
  };
};

export type GetPrivacyPolicyResponseDataType = {
  data: PrivacyPolicy | null;
  error: string | null;
};

type PrivacyPolicyMetaTagsData = {
  privacyPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        seo: Seo | null;
        seo_meta_image: SeoMetaImage | null;
      };
    } | null;
  };
};

export type GetPrivacyPolicyMetaDataType = {
  data: PrivacyPolicyMetaTagsData | null;
  error: string | null;
};

// Terms of service

type TermsOfService = {
  termsOfService: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        content: ContentType[] | null;
        updatedAt: string;
        publishedAt: string;
      };
    } | null;
  };
};

export type GetTermsOfServiceResponseDataType = {
  data: TermsOfService | null;
  error: string | null;
};

type TermsOfServiceMetaTagsData = {
  termsOfService: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        seo: Seo | null;
        seo_meta_image: SeoMetaImage | null;
      };
    } | null;
  };
};

export type GetTermsOfServiceResponseMetaDataType = {
  data: TermsOfServiceMetaTagsData | null;
  error: string | null;
};

// ShippingPolicy

type ShippingPolicy = {
  shippingPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        content: ContentType[] | null;
        updatedAt: string;
        publishedAt: string;
      };
    } | null;
  };
};

type ShippingPolicyMetaTagsData = {
  shippingPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        seo: Seo | null;
        seo_meta_image: SeoMetaImage | null;
      };
    } | null;
  };
};

export type GetShippingPolicyResponseDataType = {
  data: ShippingPolicy | null;
  error: string | null;
};

export type GetShippingPolicyResponseMetaDataType = {
  data: ShippingPolicyMetaTagsData | null;
  error: string | null;
};

// Return And Refund Policy

type ReturnAndRefundPolicy = {
  returnAndRefundPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        content: ContentType[] | null;
        updatedAt: string;
        publishedAt: string;
      };
    } | null;
  };
};

type ReturnAndRefundPolicyMetaTagsData = {
  returnAndRefundPolicy: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        hidden: boolean | null;
        seo: Seo | null;
        seo_meta_image: SeoMetaImage | null;
      };
    } | null;
  };
};

export type GetReturnAndRefundPolicyResponseDataType = {
  data: ReturnAndRefundPolicy | null;
  error: string | null;
};

export type GetReturnAndRefundPolicyResponseMetaDataType = {
  data: ReturnAndRefundPolicyMetaTagsData | null;
  error: string | null;
};

// Warranty Terms

type WarrantyTermsPolicy = {
  warrantyTerm: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        content: ContentType[] | null;
        updatedAt: string;
        publishedAt: string;
        hidden: boolean | null;
      };
    } | null;
  };
};

type WarrantyTermsMetaTagsData = {
  warrantyTerm: {
    data: {
      id: string;
      attributes: {
        title: string | null;
        seo: Seo | null;
        seo_meta_image: SeoMetaImage | null;
        hidden: boolean | null;
      };
    } | null;
  };
};

export type GetWarrantyTermsResponseDataType = {
  data: WarrantyTermsPolicy | null;
  error: string | null;
};

export type GetWarrantyTermsResponseMetaDataType = {
  data: WarrantyTermsMetaTagsData | null;
  error: string | null;
};
