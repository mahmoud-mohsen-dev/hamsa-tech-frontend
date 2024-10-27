import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

const PAYMOB_HMAC_SECRET = process.env.PAYMOB_HMAC as string;
const STRAPI_BASE_URL = process.env.API_BASE_URL as string;
const STRAPI_TOKEN = process.env.API_TOKEN as string;

async function updateStrapiPaymentStatus(
  orderId: string,
  status: string
) {
  // Mapping Paymob status to Strapi status
  let paymentStatus;
  // console.log(orderId);
  // console.log(status);

  switch (status) {
    case 'pending':
      paymentStatus = 'pending';
      break;
    case 'paid':
      paymentStatus = 'paid_off';
      break;
    case 'refunded':
      paymentStatus = 'refunded';
      break;
    case 'partially_refunded':
      paymentStatus = 'partial_refund';
      break;
    case 'canceled':
    case 'voided':
    case 'expired':
      paymentStatus = 'canceled';
      break;
    default:
      paymentStatus = 'failed';
      break;
  }

  const response = await fetch(`${STRAPI_BASE_URL}/graphql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    },
    body: JSON.stringify({
      query: `mutation UpdateOrder {
                updateOrder(id: "${orderId}", data: { payment_status: ${paymentStatus} }) {
                    data {
                        id
                    }
                }
            }`
    })
  });

  if (!response.ok) {
    console.error(
      'Failed to update order status in Strapi:',
      response.text
    );
    return false;
  }
  const data = await response.json();
  // console.log(JSON.stringify(data));

  return data?.data?.updateOrder?.data?.id ?? false;
}

function validateHMAC(
  queryParams: Record<string, any>,
  hmac: string
): boolean {
  // Define the ordered list of keys based on Paymob's expected HMAC sequence
  const orderedKeys = [
    'amount_cents',
    'created_at',
    'currency',
    'error_occured',
    'has_parent_transaction',
    'id', // obj.id
    'integration_id',
    'is_3d_secure',
    'is_auth',
    'is_capture',
    'is_refunded',
    'is_standalone_payment',
    'is_voided',
    'order', // order.id
    'owner',
    'pending',
    'source_data.pan',
    'source_data.sub_type',
    'source_data.type',
    'success'
  ];

  // Concatenate values in the exact order required
  const concatenatedData = orderedKeys
    .map((key) => {
      return queryParams[key] || '';
    })
    .join('');
  // console.log('concatenatedData', concatenatedData);

  const calculatedHmac = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(concatenatedData)
    .digest('hex');
  // console.log('calculatedHmac', calculatedHmac);
  // console.log('hmac', hmac);
  // console.log('isEqual', calculatedHmac === hmac);

  return calculatedHmac === hmac;
}

// Function to handle transaction response callbacksrequests
// To Calculate HMAC
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    // console.log(url);
    const hmac = url.searchParams.get('hmac');
    const params = Object.fromEntries(
      url.searchParams.entries()
    ) as Record<string, string>;

    if (!hmac || !validateHMAC(params, hmac)) {
      return NextResponse.json(
        {
          error: { message: 'HMAC verification failed' },
          data: null
        },
        { status: 401 }
      );
    }

    const { success } = params;
    const orderId = params['merchant_order_id'] ?? null;
    const status =
      success === 'true' ? 'paid' : params['status'] || 'failed';
    const isStatusUpdated = await updateStrapiPaymentStatus(
      orderId,
      status
    );

    if (orderId && isStatusUpdated) {
      return NextResponse.json(
        {
          data: {
            message: 'Payment status updated successfully',
            // body: params,
            orderId,
            status
          },
          error: null
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      {
        error: {
          message: 'Failed to update payment status in Strapi'
        },
        data: null
      },
      { status: 500 }
    );
  } catch (err) {
    console.error('Error processing request:', err);
    return NextResponse.json(
      {
        error: { message: 'Failed to process request', error: err },
        data: null
      },
      { status: 500 }
    );
  }
}
