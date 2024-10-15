// import { pdf } from '@react-pdf/renderer';
// Your PDF Component
import type { OrderInfoType } from '@/types/orderResponseTypes';
import { getCookie } from '@/utils/cookieUtils';
import { createElement } from 'react';

const generatePdfBlob = async (orderData: OrderInfoType) => {
  const { pdf } = await import('@react-pdf/renderer');
  const { InvoiceDocument } = await import(
    '../components/invoice/InvoiceDocument'
  );
  // Create a React element with props
  const element = <InvoiceDocument orderData={orderData} />;

  // Generate PDF blob from the React element
  const blob = pdf(element).toBlob();

  return blob;
};

export const uploadInvoicePdf = async (orderData: OrderInfoType) => {
  const pdfBlob = await generatePdfBlob(orderData);
  console.log(pdfBlob);

  const formData = new FormData();
  formData.append('files', pdfBlob, `invoice_${orderData?.id}.pdf`);
  formData.append('files', pdfBlob, `invoice_${orderData?.id}.pdf`);
  formData.append('ref', 'api::order.order');
  formData.append('refId', orderData?.id ?? '');
  formData.append('field', 'invoice');



  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
      {
        method: 'POST',
        body: formData
        // headers: {
        //   Authorization: `Bearer ${getCookie('token')}` // replace with your actual token
        // }
      }
    );
    const data = await response.json();

    // Handle response data
    console.log('Upload response:', data);
    return data;
  } catch (error) {
    console.error('PDF upload failed:', error);
    throw new Error('PDF upload failed');
  }
};
