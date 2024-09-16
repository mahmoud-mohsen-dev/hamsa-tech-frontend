import FeaturedProductCard from '../UI/FeaturedProductCard';
import SectionHeading from '../UI/SectionHeading';

function Featured() {
  return (
    <section className='max-w-[1536px] bg-white-light py-[50px]'>
      <div className='container'>
        <div
          data-aos='fade-down'
          data-aos-delay='50'
          data-aos-duration='400'
          data-aos-easing='ease-out'
          data-aos-once='true'
        >
          <SectionHeading>
            <span>Product</span>
            <span className='ml-2 text-red-shade-350'>Spotlight</span>
          </SectionHeading>
        </div>

        <div className='flex flex-col items-center gap-5 md:flex-row md:flex-wrap xl:flex-nowrap'>
          <div
            data-aos='fade-down'
            data-aos-delay='100'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
            className='w-full md:basis-[calc(50%-20px)] xl:basis-1/4'
          >
            <FeaturedProductCard
              imgSrc='/featured/ezviz-bc1c.png'
              alt='Bc1c 4k'
              linkSrc='/'
              title='BC1c 4K'
              description='Smartly sharp in 4K. Reliably guards with more.'
            />
          </div>
          <div
            data-aos='fade-down'
            data-aos-delay='200'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
            className='w-full md:basis-[calc(50%-20px)] xl:basis-1/4'
          >
            <FeaturedProductCard
              imgSrc='/featured/ezviz-solar-charging-panel.png'
              alt='Solar Charging Panel-F'
              linkSrc='/'
              title='Solar Charging Panel-F'
              description='Cleaner energy for non-stop protection'
            />
          </div>
          <div
            data-aos='fade-down'
            data-aos-delay='300'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
            className='w-full md:basis-[calc(50%-20px)] xl:basis-1/4'
          >
            <FeaturedProductCard
              imgSrc='/featured/hikvision-16u1t.png'
              alt='DS-2CE16D0T-LTS'
              linkSrc='/'
              title=' DS-2CE16U1T-ITF'
              description='4K Fixed Mini Bullet Camera.'
            />
          </div>
          <div
            data-aos='fade-down'
            data-aos-delay='400'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
            className='w-full md:basis-[calc(50%-20px)] xl:basis-1/4'
          >
            <FeaturedProductCard
              imgSrc='/featured/Hikvision-DS-2CE5AD3T-AVPIT3ZF.png'
              alt=' DS-2CE5AD3T-AVPIT3ZF'
              linkSrc='/'
              title=' DS-2CE5AD3T-AVPIT3ZF'
              description='2 MP Ultra Low Light Vandal Motorized Varifocal Dome Camera.'
            />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Featured;
