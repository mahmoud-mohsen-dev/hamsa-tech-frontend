// import { ProductType } from '@/types/getProducts';
import { Pagination } from 'antd';
import ProductsContent from '../UI/products/ProductsContent';

// {
//   productsData
// }: {
//   productsData: ProductType[] | null;
// }

function ProductsWrapper() {
  return (
    <main className='mb-[100px]'>
      <section>
        {/* <ProductsContent serverProductsData={productsData} /> */}
        <ProductsContent />
      </section>
    </main>
  );
}

export default ProductsWrapper;
