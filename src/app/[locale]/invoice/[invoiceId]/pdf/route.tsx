import InvoiceDocument from '@/components/invoice/InvoicePDF';
// import { getCookie } from '@/utils/cookieUtils';
import { renderToStream } from '@react-pdf/renderer';
import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { invoiceId: string } }
) {
  const invoiceId = parseInt(params.invoiceId);
  //   const token = getCookie('token');
  //   console.log(token);

  if (isNaN(invoiceId)) {
    throw new Error('Invalid invoice ID');
  }

  const stream = await renderToStream(<InvoiceDocument />);

  return new NextResponse(stream as unknown as ReadableStream);
}
