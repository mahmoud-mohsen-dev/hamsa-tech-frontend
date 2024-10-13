'use client';

// import {InvoicePDF} from '@/components/invoice/InvoicePDF';
// import { useIsMount } from '@/hooks/useIsMount';
import { Spin } from 'antd';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { useEffect, useState } from 'react';
import Btn from '../UI/Btn';
import InvoiceDocument from './InvoicePDF';
import { MdCloudDownload } from 'react-icons/md';

function InvoicePDFButton() {
  //   const { didMount } = useIsMount();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient ?
      <PDFDownloadLink
        fileName='invoice-1'
        document={<InvoiceDocument />}
      >
        <Btn className='bg-red-shade-350 text-white'>
          <MdCloudDownload size={18} />
          <span>Download Invoice</span>
        </Btn>
      </PDFDownloadLink>
    : <Spin size='large' />;
}

export default InvoicePDFButton;
