import { CreateBlockContent } from '@/components/UI/strapi-blocks/StrapiBlocks';
import { BlogDataType } from '@/types/getBlogPageResponse';

function ArticleBlogContent({
  blogData
}: {
  blogData: BlogDataType;
}) {
  return (
    Array.isArray(blogData?.attributes?.content) &&
    blogData?.attributes?.content.length > 0 && (
      <CreateBlockContent content={blogData?.attributes?.content} />
    )
  );
}

export default ArticleBlogContent;
