// import CategoryCard from '../UI/categories/CategoryCard';
// import CategoryImageWrapper from '../UI/categories/CategoryImageWrapper';
import EmblaCarousel from '@/components/UI/embla/EmblaCarousel';
import { EmblaOptionsType } from 'embla-carousel';
import HeadingSection from '../UI/HeadingSection';

function CategoriesSection() {
  const OPTIONS: EmblaOptionsType = {
    dragFree: true,
    loop: false
  };
  const SLIDES = [
    {
      title: 'WiFi Cameras',
      details:
        'Experience seamless security with our WiFi cameras, providing easy installation and remote access from anywhere.',
      imgSrc: '/categories/ezviz-wifi-outdoor.jpg'
    },
    {
      title: 'CCTV & IP Cameras',
      details:
        'Our advanced CCTV and IP camera solutions deliver top-tier surveillance and monitoring for comprehensive security.',
      imgSrc: '/categories/hikvision-outdoor-camera.jpg'
    },
    {
      title: 'NVR & DVR',
      details:
        'Reliable NVR and DVR systems for recording and playback of surveillance footage, ensuring thorough security coverage.',
      imgSrc: '/categories/hikvision-dvr.jpg'
    },
    {
      title: 'Fingerprints',
      details:
        'Streamline employee tracking with our fingerprint and time attendance devices, offering efficient and secure workforce management.',
      imgSrc: '/categories/zk-fingerprint.webp'
    },
    {
      title: 'Intercom',
      details:
        'Upgrade your communication systems with our premium intercom solutions, sourced to meet both residential and commercial needs.',
      imgSrc: '/categories/commax-intercom.webp'
    },
    {
      title: 'Access Control',
      details:
        'Secure your premises with advanced access control systems designed for efficient entry management and enhanced safety.',
      imgSrc: '/categories/access-control.webp'
    },
    {
      title: 'POS Equipments',
      details:
        'Upgrade your point-of-sale system with our printers, barcode scanners, and cashier drawers for efficient transactions.',
      imgSrc: '/categories/xprinter-printer.jpg'
    },
    {
      title: 'Accessories',
      details:
        'Find essential accessories like power supplies, cables, and brackets to support and optimize your security system.',
      imgSrc: '/categories/bracket-camera.jpg'
    },
    {
      title: 'UPS',
      details:
        'Ensure continuous power with our uninterruptible power supplies (UPS), providing reliable backup and protection against outages.',
      imgSrc: '/categories/ups-schneider.webp'
    },
    {
      title: 'Network',
      details:
        'Optimize connectivity with our network equipment, including switches, access points, and routers for reliable and efficient performance.',
      imgSrc: '/categories/tp-link-access-point.jpg'
    }
  ];
  return (
    <section className='max-w-[1536px] bg-white py-20'>
      <div className='categories'>
        <div
          data-aos='fade-down'
          data-aos-delay='50'
          data-aos-duration='400'
          data-aos-easing='ease-out'
          data-aos-once='true'
        >
          <HeadingSection
            subHeading="Whether it's protecting your home while you are on vacation or
        your family while they sleep, we will give you the peace of
        mind that should the worst happen."
          >
            <span>whole home</span>
            <span className='ml-2 text-red-shade-350'>
              protection
            </span>
          </HeadingSection>
        </div>
        <div
          data-aos='fade-up'
          data-aos-delay='150'
          data-aos-duration='400'
          data-aos-easing='ease-out'
          data-aos-once='true'
        >
          <EmblaCarousel slides={SLIDES} options={OPTIONS} href='/' />
        </div>
      </div>
    </section>
  );
}

export default CategoriesSection;
