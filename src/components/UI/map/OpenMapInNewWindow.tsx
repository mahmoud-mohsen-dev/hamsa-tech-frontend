import { useTranslations } from 'next-intl';
import Anchor from '../Anchor';

function OpenMapInNewWindow({
  branchName,
  lat,
  lng
}: {
  branchName: string;
  lat: number;
  lng: number;
}) {
  const t = useTranslations('AboutUsPage.content');
  // Generate the Google Maps URL with latitude and longitude
  const googleMapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;

  return (
    <div className='absolute right-2 top-2 z-[9999] flex flex-col gap-1.5 rounded border border-gray-light bg-white px-5 py-3 font-inter'>
      <h4 className='text-base font-medium'>{branchName}</h4>
      <Anchor
        href={googleMapsUrl}
        target='_blank'
        applyDefaultClasses={true}
        className='!text-sm'
      >
        {t('viewLargerMapText')}
      </Anchor>
    </div>
  );
}

export default OpenMapInNewWindow;
