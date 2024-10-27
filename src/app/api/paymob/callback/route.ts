import { NextRequest, NextResponse } from 'next/server';
// // app/api/paymob/callback/route.ts
// import { NextRequest, NextResponse } from 'next/server';
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
  console.log(orderId);
  console.log(status);

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
  console.log(data);

  return data?.data?.updateOrder?.data?.id ?? false;
}

// Function to handle transaction processed callbacks requests
// export async function POST(request: NextRequest) {
//   const url = new URL(request.url);
//   const hmac = url.searchParams.get('hmac');
//   console.log('hmac for transaction processed callbacks', hmac);

//   if (!hmac) {
//     return NextResponse.json(
//       { error: 'HMAC missing' },
//       { status: 400 }
//     );
//   }

//   const body = await request.text();
//   console.log('Raw Body:', body);

//   let parsedBody;
//   try {
//     parsedBody = JSON.parse(body);
//     console.log('Parsed JSON Body:', parsedBody);
//   } catch (error) {
//     console.error('JSON parse error:', error);
//     return NextResponse.json(
//       { error: 'Invalid JSON' },
//       { status: 400 }
//     );
//   }

//   // Proceed with your payment logic
//   return NextResponse.json({
//     message: 'Callback processed successfully',
//     data: parsedBody,
//     hmac: hmac,
//     url: url.toString(),
//     requestBody: body,
//     timestamp: new Date().toISOString()
//   });
// }

// export async function POST(req: NextRequest) {
//   const callbackData = await req.json();
//   console.log(JSON.stringify(callbackData));
//   const { hmac, order, status } = callbackData;

//   const orderId = order?.obj?.order?.id ?? null;
//   console.log('orderId', orderId);

//   // Generate the HMAC hash using your secret key and callback data
//   const sortedData = Object.keys(callbackData)
//     .filter((key) => key !== 'hmac')
//     .sort()
//     .map((key) => `${callbackData[key]}`)
//     .join('');

//   console.log('sortedData', sortedData);
//   const calculatedHmac = crypto
//     .createHmac('sha512', PAYMOB_HMAC_SECRET)
//     .update(sortedData)
//     .digest('hex');

//   console.log('calculatedHmac', calculatedHmac);
//   console.log('hmac', hmac);

//   // Verify HMAC
//   if (calculatedHmac && hmac && calculatedHmac === hmac) {
//     const updateSuccess = await updateStrapiPaymentStatus(
//       orderId,
//       status
//     );
//     if (updateSuccess) {
//       return NextResponse.json({
//         message: 'Payment status updated successfully'
//       });
//     } else {
//       return NextResponse.json(
//         { message: 'Failed to update payment status in Strapi' },
//         { status: 500 }
//       );
//     }
//   } else {
//     return NextResponse.json(
//       { message: 'HMAC verification failed' },
//       { status: 401 }
//     );
//   }
// }

// interface getBodyType {
//   'id': string;
//   'pending': string;
//   'amount_cents': string;
//   'success': string;
//   'is_auth': string;
//   'is_capture': string;
//   'is_standalone_payment': string;
//   'is_voided': string;
//   'is_refunded': string;
//   'is_3d_secure': string;
//   'integration_id': string;
//   'profile_id': string;
//   'has_parent_transaction': string;
//   'order': string;
//   'created_at': string;
//   'currency': string;
//   'merchant_commission': string;
//   'discount_details': string;
//   'is_void': string;
//   'is_refund': string;
//   'error_occured': string;
//   'refunded_amount_cents': string;
//   'captured_amount': string;
//   'updated_at': string;
//   'is_settled': string;
//   'bill_balanced': string;
//   'is_bill': string;
//   'owner': string;
//   'merchant_order_id': string;
//   'data.message': string;
//   'source_data.type': string;
//   'source_data.pan': string;
//   'source_data.sub_type': string;
//   'acq_response_code': string;
//   'txn_response_code': string;
//   'hmac': string;
// }

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
  console.log('concatenatedData', concatenatedData);

  const calculatedHmac = crypto
    .createHmac('sha512', PAYMOB_HMAC_SECRET)
    .update(concatenatedData)
    .digest('hex');
  console.log('calculatedHmac', calculatedHmac);
  console.log('hmac', hmac);
  console.log('isEqual', calculatedHmac === hmac);

  return calculatedHmac === hmac;
}

// Function to handle transaction response callbacksrequests
// To Calculate HMAC
export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const hmac = url.searchParams.get('hmac');
    const params = Object.fromEntries(
      url.searchParams.entries()
    ) as Record<string, string>;

    if (!hmac || !validateHMAC(params, hmac)) {
      return NextResponse.json(
        { error: 'HMAC verification failed' },
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
          message: 'Payment status updated successfully',
          body: params,
          orderId,
          status
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: 'Failed to update payment status in Strapi' },
      { status: 500 }
    );
  } catch (err) {
    console.error('Error processing request:', err);
    return NextResponse.json(
      { message: 'Failed to process request', error: err },
      { status: 500 }
    );
  }
}

// const body: Record<string, any> = {};

// // Convert parameters into a nested object structure
// params.forEach((value, key) => {
//   const keys = key.split('.');
//   let current = body;

//   keys.forEach((k, i) => {
//     if (i === keys.length - 1) {
//       current[k] = value; // Set the final key to the value
//     } else {
//       current[k] = current[k] || {}; // Create an object if it doesn't exist
//       current = current[k];
//     }
//   });
// });
