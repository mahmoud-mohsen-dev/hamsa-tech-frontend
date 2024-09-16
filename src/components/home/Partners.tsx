import ImageWrapper from '../UI/ImageWrapper';
import ScrollerComponent from '../UI/ScrollerComponent';

function Partners() {
  return (
    <div className='max-w-[1536px] bg-blue-sky-ultralight py-[50px]'>
      <div
        data-aos='fade-up'
        data-aos-delay='50'
        data-aos-duration='400'
        data-aos-easing='ease-out'
        data-aos-once='true'
      >
        <ScrollerComponent>
          <ImageWrapper
            imgSrc='/partners/Ezviz.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/hikvision.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/zkteco.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/Commax.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/cyber.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/syble.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/datalogic.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/xprinter.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/rongta.svg'
            alt='ezviz logo'
          />
          <ImageWrapper
            imgSrc='/partners/tp-link.svg'
            alt='ezviz logo'
          />
        </ScrollerComponent>
      </div>
    </div>
  );
}

export default Partners;
