import {
  PaymentDataType,
  PaymentRequest
} from '@/types/paymentResonseType';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const {
      emailOrPhone,
      order_id,
      total_order_cost,
      items,
      shippingAddressData,
      billingAddressData
    }: PaymentDataType = await req.json();

    if (
      !emailOrPhone ||
      shippingAddressData === null ||
      billingAddressData === null ||
      total_order_cost === null ||
      items === null ||
      order_id === null
    ) {
      throw new Error(
        `Invalid order details: ${JSON.stringify({
          emailOrPhone,
          shippingAddressData,
          billingAddressData,
          total_order_cost,
          items,
          order_id
        })}`
      );
    }

    console.log(
      JSON.stringify({
        emailOrPhone,
        order_id,
        total_order_cost,
        items,
        shippingAddressData,
        billingAddressData
      })
    );

    // Step 1: Authenticate with Paymob
    const authResponse = await fetch(
      `${process.env.PAYMOB_BASE_URL}/api/auth/tokens`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          api_key: process.env.PAYMOB_API_KEY
        })
      }
    );

    if (!authResponse.ok) {
      throw new Error('Failed to authenticate with Paymob');
    }

    const authData = await authResponse.json();
    const token = authData.token;
    console.log(token);

    // Step 2: Create an order
    const orderResponse = await fetch(
      `${process.env.PAYMOB_BASE_URL}/api/ecommerce/orders`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          merchant_order_id: order_id,
          api_source: 'INVOICE',
          delivery_needed: 'true',
          amount_cents: total_order_cost * 100, // Amount in cents
          currency: 'EGP',
          notify_user_with_email: true,
          items: items.map((item) => {
            return {
              name:
                item?.product?.data?.attributes?.name ??
                'Unknown product name',
              amount_cents:
                item?.product?.data?.attributes?.final_product_price *
                100,
              description:
                item?.product?.data.attributes?.description ?? '',
              quantity: item.quantity
            };
          }),
          shipping_data: {
            email: emailOrPhone,
            country: 'Egypt',
            first_name: shippingAddressData?.first_name ?? 'NA',
            last_name: shippingAddressData?.last_name ?? 'NA',
            street: shippingAddressData?.address_1 ?? 'NA',
            apartment: shippingAddressData?.apartment ?? 'NA',
            building: shippingAddressData?.building ?? 'NA',
            phone_number: shippingAddressData?.delivery_phone ?? 'NA',
            city: shippingAddressData?.city ?? 'NA',
            floor: shippingAddressData?.floor ?? 'NA',
            state:
              shippingAddressData?.shipping_cost?.data?.attributes
                ?.governorate ?? 'NA',
            postal_code: shippingAddressData?.zip_code ?? 'NA'
          }
        })
        // Add your cart items
        //   merchant_order_id: `order_${Date.now()}` // Unique order ID
        // merchant_order_id: order_id // Unique order ID
      }
    );

    if (!orderResponse.ok) {
      throw new Error('Failed to create Paymob order');
    }

    const orderData = await orderResponse.json();
    console.log(JSON.stringify(orderData));
    const orderId = orderData.id;

    // Step 3: Generate a payment key
    const paymentKeyResponse = await fetch(
      `${process.env.PAYMOB_BASE_URL}/api/acceptance/payment_keys`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer ' + token
        },
        body: JSON.stringify({
          delivery_needed: true,
          amount_cents: total_order_cost * 100,
          expiration: 3600,
          order_id: orderId,
          billing_data: {
            email: emailOrPhone,
            country: 'Egypt',
            first_name: billingAddressData?.first_name ?? 'NA',
            last_name: billingAddressData?.last_name ?? 'NA',
            street: billingAddressData?.address_1 ?? 'NA',
            apartment: billingAddressData?.apartment ?? 'NA',
            building: billingAddressData?.building ?? 'NA',
            phone_number: billingAddressData?.delivery_phone ?? 'NA',
            city: billingAddressData?.city ?? 'NA',
            floor: billingAddressData?.floor ?? 'NA',
            state:
              billingAddressData?.shipping_cost?.data?.attributes
                ?.governorate ?? 'NA',
            postal_code: billingAddressData?.zip_code ?? 'NA'
          },
          currency: 'EGP',
          integration_id: process.env.PAYMOB_INTEGRATION_ID // Paymob integration ID
        })
      }
    );

    if (!paymentKeyResponse.ok) {
      console.log(paymentKeyResponse);
      console.log(JSON.stringify(paymentKeyResponse));
      throw new Error('Failed to generate payment key');
    }

    const paymentKeyData = await paymentKeyResponse.json();
    console.log(JSON.stringify(paymentKeyData));
    const paymentToken = paymentKeyData.token;

    // Step 4: Return the payment URL
    return NextResponse.json(
      {
        success: true,
        paymentUrl: `${process.env.PAYMOB_BASE_URL}/api/acceptance/iframes/${process.env.PAYMOB_IFRAME_ID}?payment_token=${paymentToken}`
      },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Payment process error', error);
    return NextResponse.json(
      { success: false, error: error?.message ?? error },
      { status: 500 }
    );
  }
}
