'use client';
import { createContext, useContext, useState } from 'react';

const BlogContext = createContext<null | {
  blogIds: null | {
    arId: string | null;
    enId: string | null;
  };
  setBlogIds: React.Dispatch<
    React.SetStateAction<null | {
      arId: string | null;
      enId: string | null;
    }>
  >;
  dropdownModalId: null | string;
  setDropdownModalId: React.Dispatch<
    React.SetStateAction<null | string>
  >;
  commentIdOnEditMode: null | string;
  setCommentIdOnEditMode: React.Dispatch<
    React.SetStateAction<null | string>
  >;
  reportModalIdOpened: null | string;
  setReportModalIdOpened: React.Dispatch<
    React.SetStateAction<null | string>
  >;
}>(null);

export const BlogContextProvider = ({
  children
}: {
  children: React.ReactNode;
}) => {
  const [blogIds, setBlogIds] = useState<null | {
    arId: string | null;
    enId: string | null;
  }>(null);
  const [dropdownModalId, setDropdownModalId] = useState<
    null | string
  >(null);
  const [commentIdOnEditMode, setCommentIdOnEditMode] = useState<
    null | string
  >(null);

  const [reportModalIdOpened, setReportModalIdOpened] = useState<
    null | string
  >(null);

  return (
    <BlogContext.Provider
      value={{
        blogIds,
        setBlogIds,
        dropdownModalId,
        setDropdownModalId,
        commentIdOnEditMode,
        setCommentIdOnEditMode,
        reportModalIdOpened,
        setReportModalIdOpened
      }}
    >
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);

  if (!context) {
    throw new Error('Blog Context must be used within a MyProvider');
  }

  return context;
};
