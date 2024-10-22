import { useTranslations } from 'next-intl';
import Image from 'next/image';

function ChangeMapStyle({
  handleToggle
}: {
  handleToggle: () => void;
}) {
  const t = useTranslations('AboutUsPage.content');
  return (
    <button
      className='absolute right-2 top-2 z-[2] rounded after:absolute after:left-1/2 after:top-1/2 after:z-[1] after:h-[calc(100%+6px)] after:w-[calc(100%+6px)] after:-translate-x-1/2 after:-translate-y-1/2 after:rounded-md after:border after:border-gray-light after:bg-white after:transition-all after:duration-100 after:ease-linear after:content-[""] hover:after:h-[calc(100%+10px)] hover:after:w-[calc(100%+10px)]'
      onClick={() => handleToggle()}
    >
      <div className='relative z-[4] overflow-hidden rounded'>
        <Image
          src='/mini-map-tahrir.png'
          width={54}
          height={54}
          alt='Toggle map style'
        />
        <div className='bg-mini-map-overlay absolute left-0 top-0 z-[5] flex h-full w-full items-end justify-center'>
          <div className='relative z-[6] flex items-center gap-1 pb-1'>
            <Image
              src={'/icons/layers-icon.svg'}
              alt='layers icon'
              height={12}
              width={12}
            />
            <p className='font-inter text-[10px] font-extralight leading-[14px] tracking-tight text-white'>
              {t('miniMapText')}
            </p>
          </div>
        </div>
      </div>
    </button>
  );
}

export default ChangeMapStyle;
