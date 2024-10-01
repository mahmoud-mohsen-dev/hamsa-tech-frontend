import { useMyContext } from '@/context/Store';
import { convertToArabicNumeralsWithFormatting } from '@/utils/numbersFormating';

function ShippingCost() {
  const { shippingCost } = useMyContext();

  return (
    <div>
      <h2 className='mt-4 text-xl font-semibold'>Shipping Cost</h2>
      <div>
        <p>Only {shippingCost} EGP</p>
        <p>
          {convertToArabicNumeralsWithFormatting(shippingCost, 'E£')}
        </p>
      </div>
    </div>
  );
}

export default ShippingCost;
