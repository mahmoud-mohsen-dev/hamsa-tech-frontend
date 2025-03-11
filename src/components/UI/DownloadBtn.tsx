'use client';

import Btn from './Btn';

function DownloadBtn({
  url,
  name,
  children,
  className,
  target = '_self',
  autoDownloadFile = true
}: {
  url: string | null;
  name?: string | null;
  children: React.ReactNode;
  className?: string | null;
  target?: '_self' | '_blank';
  autoDownloadFile?: boolean;
}) {
  const handleDownload = () => {
    if (!url) {
      console.error('Download URL is missing');
      return;
    }
    const link = document.createElement('a');
    link.href = url;
    link.target = target;
    // Extract filename from URL if not provided
    const fileName = name || url.split('/').pop() || 'download-file';
    console.log(fileName);
    link.download = fileName;

    console.log(link.download);

    document.body.appendChild(link);
    link.click();
    // console.log('clicked');
    document.body.removeChild(link);
  };

  const handleAutoDownload = async (
    urlArg: string | null,
    name?: string | null
  ) => {
    try {
      if (!urlArg) {
        throw new Error('URL is missing');
      }
      const response = await fetch(urlArg);
      if (!response.ok) {
        throw new Error('Failed to fetch the PDF');
      }

      const blob = await response.blob();
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.href = url;
      link.download = `${
        name ? name
        : url ? url
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
      className={`${className ? className : 'gap-4 bg-red-shade-350 px-10 py-3 text-lg font-semibold text-white transition-colors duration-200 active:bg-red-shade-400'}`}
      defaultPadding={false}
      onClick={() => {
        autoDownloadFile ?
          handleAutoDownload(url, name)
        : handleDownload();
      }}
      // href={url ?? null}
      // target={target}
    >
      {children}
    </Btn>
    // <button
    //   className={`${className ? className : 'gap-4 bg-red-shade-350 px-10 py-3 text-lg font-semibold text-white transition-colors duration-200 active:bg-red-shade-400'}`}
    //   onClick={handleDownload}
    // >
    //   {children}
    // </button>
  );
}

export default DownloadBtn;
