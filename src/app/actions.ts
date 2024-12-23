'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateProductLayoutPage({
  products
}: {
  products: { arId: string | null; enId: string | null };
}) {
  if (products?.arId) {
    revalidatePath('/ar/products/' + products.arId);
  }
  if (products?.enId) {
    revalidatePath('/en/products/' + products.enId);
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
