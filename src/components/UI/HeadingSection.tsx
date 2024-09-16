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
  return (
    <div className='service-details container mb-10'>
      <SectionHeading className='mb-2.5'>{children}</SectionHeading>
      <p className='m-auto max-w-[600px] text-pretty text-center font-openSans text-lg capitalize text-gray-medium opacity-80'>
        {subHeading}
      </p>
    </div>
  );
}

export default HeadingSection;
