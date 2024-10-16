export type SupportPageContactInfoResponseType = {
  data: {
    supportPage: {
      data: {
        attributes: {
          telephone: string;
          whatsapp: string;
          email: string;
        };
      } | null;
    };
  } | null;
  error: string | null;
};

export type CreateSupportResponseType = {
  data: {
    createSupport: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error: string | null;
};
