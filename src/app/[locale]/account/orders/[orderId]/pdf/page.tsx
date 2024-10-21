'use client';

// import {InvoicePDF} from '@/components/invoice/InvoicePDF';
// import { useIsMount } from '@/hooks/useIsMount';
import { Spin } from 'antd';
import { PDFViewer } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
// import Btn from '../UI/Btn';
import { InvoiceDocument } from '../../../../../components/invoice/InvoiceDocument';
// import { MdCloudDownload } from 'react-icons/md';

function InvoicePDFViewerPage() {
  //   const { didMount } = useIsMount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    console.log('InvoicePDFViewerPage');
    setIsClient(true);
  }, []);

  return isClient ?
      <PDFViewer style={{ width: '100vw', height: '100vh' }}>
        <InvoiceDocument orderData={null} />
      </PDFViewer>
    : <Spin size='large' />;
}

export default InvoicePDFViewerPage;
