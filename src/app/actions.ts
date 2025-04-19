'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateProductLayoutPage({
  productIds
}: {
  productIds: { arId: string | null; enId: string | null };
}) {
  if (productIds?.arId) {
    revalidatePath('/ar/products/' + productIds.arId);
    console.log(
      'Product path /ar/products/' +
        productIds.arId +
        ' has been revalidated'
    );
  }
  if (productIds?.enId) {
    revalidatePath('/en/products/' + productIds.enId);
    console.log(
      'Product path /en/products/' +
        productIds.enId +
        ' has been revalidated'
    );
  }
}

export async function revalidateBlogLayoutPage({
  blogIds
}: {
  blogIds: { arId: string | null; enId: string | null } | null;
}) {
  if (blogIds && blogIds?.arId) {
    revalidatePath('/ar/blog/' + blogIds.arId);
  }
  if (blogIds && blogIds?.enId) {
    revalidatePath('/en/products/' + blogIds.enId);
  }
}
