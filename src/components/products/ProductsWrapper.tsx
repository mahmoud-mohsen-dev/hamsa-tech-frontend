import { ProductType } from '@/types/getProducts';
import ProductsContent from '../UI/products/ProductsContent';

function ProductsWrapper({ data }: { data: ProductType[] }) {
  return (
    <main>
      <section>
        <ProductsContent serverProductsData={data} />
      </section>
    </main>
  );
}

export default ProductsWrapper;
