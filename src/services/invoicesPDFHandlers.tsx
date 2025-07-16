// Your PDF Component
import type { OrderInfoType } from '@/types/orderResponseTypes';

const generatePdfBlob = async (orderData: OrderInfoType,locale: string) => {
  const { pdf } = await import('@react-pdf/renderer');
  // console.log(pdf);
  const { InvoiceDocument } = await import(
    '../components/invoice/InvoiceDocument'
  );
  // Create a React element with props
  const element = <InvoiceDocument orderData={orderData} locale={locale} />;
  // console.log(element);

  // Generate PDF blob from the React element
  const blob = pdf(element).toBlob();

  return blob;
};

export const uploadInvoicePdf = async (orderData: OrderInfoType, locale: string) => {
  // console.log('uploadInvoicePdf orderData before:', orderData);
  if (!orderData?.id) {
    console.log("orderData id don't exist exists");
    return; // exit early if orderData.id does not exist
  }
  // console.log('uploadInvoicePdf orderData', orderData);
  const pdfBlob = await generatePdfBlob(orderData,locale);
  // console.log(pdfBlob);

  const formData = new FormData();
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
    // console.log(response);
    const data = await response.json();
    // console.log('data of invoicesPdfHandler: ', data);

    // Handle response data
    // console.log('Upload response:', data);
    return data;
  } catch (error) {
    console.error('PDF upload failed:', error);
    throw new Error('PDF upload failed');
  }
};
