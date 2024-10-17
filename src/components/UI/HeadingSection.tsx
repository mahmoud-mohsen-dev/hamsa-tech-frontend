import { useLocale } from 'next-intl';
import SectionHeading from './SectionHeading';

function HeadingSection({
  // heading,
  subHeading,
  children
}: {
  // heading: string;
  subHeading: string;
  children: React.ReactNode;
}) {
  const locale = useLocale();

  return (
    <div className='service-details container'>
      <SectionHeading
        className={`${locale === 'ar' ? 'mb-3' : 'mb-2.5'}`}
      >
        {children}
      </SectionHeading>
      <div
        className={`m-auto mb-10 max-w-[600px] text-pretty text-center font-openSans capitalize text-gray-medium opacity-80 ${locale === 'ar' ? 'text-lg md:text-2xl' : 'text-lg'}`}
      >
        {subHeading}
      </div>
    </div>
  );
}

export default HeadingSection;
