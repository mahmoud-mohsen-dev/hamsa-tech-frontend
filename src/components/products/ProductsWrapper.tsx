import { ProductType } from '@/types/getProducts';
import ProductsContent from '../UI/products/ProductsContent';

// {
//   productsData
// }: {
//   productsData: ProductType[] | null;
// }

function ProductsWrapper() {
  return (
    <main>
      <section>
        {/* <ProductsContent serverProductsData={productsData} /> */}
        <ProductsContent />
      </section>
    </main>
  );
}

export default ProductsWrapper;
