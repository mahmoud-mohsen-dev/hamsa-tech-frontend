// DownloadButton.tsx
'use client';
import { MdCloudDownload } from 'react-icons/md';
import Btn from '@/components/UI/Btn';

interface DownloadButtonProps {
  invoiceUrl: string | undefined;
  orderId: string;
}

const DownloadButton: React.FC<DownloadButtonProps> = ({
  invoiceUrl,
  orderId
}) => {
  const handleDownload = async () => {
    try {
      if (!invoiceUrl) {
        throw new Error('Invoice URL is missing');
      }
      const response = await fetch(invoiceUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the PDF');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `invoice_${orderId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    invoiceUrl && (
      <Btn
        className='bg-red-shade-350 text-white'
        onClick={handleDownload}
      >
        <MdCloudDownload size={18} />
        <span>Download Invoice</span>
      </Btn>
    )
  );
};

export default DownloadButton;
