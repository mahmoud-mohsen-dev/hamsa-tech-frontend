'use client';

import Btn from './Btn';

function DownloadBtn({
  pdfUrl,
  name,
  children
}: {
  pdfUrl: string | null;
  name: string | null;
  children: React.ReactNode;
}) {
  const handleDownload = async (
    pdfUrl: string | null,
    name: string | null
  ) => {
    try {
      if (!pdfUrl) {
        throw new Error('Invoice URL is missing');
      }
      const response = await fetch(pdfUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch the PDF');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `${
        name ? name
        : pdfUrl ? pdfUrl
        : 'document-01'
      }`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url); // Clean up the URL object
    } catch (error) {
      console.error('Download error:', error);
    }
  };

  return (
    <Btn
      className='gap-4 bg-red-shade-350 px-10 py-3 text-lg font-semibold text-white'
      defaultPadding={false}
      onClick={() => {
        handleDownload(pdfUrl, name);
      }}
    >
      {children}
    </Btn>
  );
}

export default DownloadBtn;
