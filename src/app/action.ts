'use server';

import { revalidatePath } from 'next/cache';

export default async function revalidateProductLayoutPage({
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
