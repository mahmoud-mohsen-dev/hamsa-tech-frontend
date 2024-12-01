export interface GetUserReviewsType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          reviews: {
            data:
              | {
                  id: string;
                }[]
              | null;
          };
        };
      } | null;
    };
  } | null;
  error?: string | null;
}

export interface RemoveReviewFromUserType {
  data: {
    updateUser: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error?: string | null;
}

export interface DeleteReviewType {
  data: {
    deleteReview: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error?: string | null;
}

export interface GetUserReviewType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          reviews: {
            data:
              | {
                  id: string;
                }[]
              | null
              | [];
          };
        };
      } | null;
    };
  } | null;
  error?: string | null;
}

export interface GetUserReviewDataType {
  data: {
    usersPermissionsUser: {
      data: {
        attributes: {
          reviews: {
            data:
              | {
                  attributes: {
                    likes: null;
                  };
                }[]
              | null
              | [];
          };
        };
      } | null;
    };
  } | null;
  error?: string | null;
}

export interface updateReviewType {
  data: {
    updateReview: {
      data: {
        id: string;
      } | null;
    };
  } | null;
  error?: string | null;
}
