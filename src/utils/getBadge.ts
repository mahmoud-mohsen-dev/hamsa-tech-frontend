import { isNewProduct } from './productCardHelper';

export const getBadge = (
  locale: string,
  updatedAt: string,
  stock: number,
  price: number,
  salePrice: number | null
) => {
  const isNew = isNewProduct(updatedAt);
  const isArabic = locale === 'ar';

  if (stock === 0) {
    return isArabic ? 'إنتهى من المخزون' : 'Out Of Stock';
  }

  if (isNew) {
    return isArabic ? 'جديد' : 'New';
  }

  if (salePrice && price && (salePrice * 100) / price === 25) {
    return isArabic ? 'عرض خاص' : 'Special Offer';
  }
  if (salePrice && price && (salePrice * 100) / price === 10) {
    return isArabic ? 'أُوكَازيُون' : 'Sale';
  }
  if (stock === 2) {
    return isArabic ? 'محدود' : 'Limited';
  }

  return '';
};
