import { revalidateProductLayoutPage } from '@/app/actions';
import { NextRequest, NextResponse } from 'next/server';

// The static token you'd be checking
const staticToken = process.env.FRONTEND_API_TOKEN;

export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get('Authorization');

  console.warn(params);
  console.warn(authHeader);

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json(
      { error: 'Authorization token missing or invalid' },
      { status: 401 }
    );
  }

  const token = authHeader.split(' ')[1]; // Extract the token

  // Check if the token is the same as the static token
  if (token !== staticToken) {
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }

  try {
    // Proceed with the request
    const body = await req.json();
    const { arId, enId } = body;

    console.log(JSON.stringify({ arId, enId }));
    let productArId = null;
    let productEnId = null;

    if (typeof arId === 'number') {
      productArId = `${arId}`;
    }
    if (typeof enId === 'number') {
      productEnId = `${enId}`;
    }

    if (typeof arId !== 'number' && typeof enId !== 'number') {
      return NextResponse.json(
        { error: 'Invalid product IDs' },
        { status: 400 }
      );
    }

    // Your update logic here

    await revalidateProductLayoutPage({
      productIds: { arId: productArId, enId: productEnId }
    });

    return NextResponse.json({
      data: {
        message: 'Product paths has been updated successfully'
      }
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: 'Invalid or expired token' },
      { status: 401 }
    );
  }
}
