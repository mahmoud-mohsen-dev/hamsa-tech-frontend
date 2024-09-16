import { Link } from '@/navigation';
import ConfigAos from '../Theme/ConfigAos';
import ArticleCard from '../UI/articles/ArticleCard';
import SectionHeading from '../UI/SectionHeading';
// import { FaLongArrowAltRight } from 'react-icons/fa';

function Articles() {
  return (
    <ConfigAos>
      <section className='max-w-[1536px] bg-white py-[50px]'>
        <div className='container'>
          <div
            data-aos='fade-down'
            data-aos-delay='50'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
          >
            <SectionHeading>
              <span>Recent</span>
              <span className='ml-2 text-red-shade-350'>
                Articles
              </span>
            </SectionHeading>
          </div>

          <div className='grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] grid-rows-1 gap-8'>
            <div
              data-aos='fade-left'
              data-aos-delay='100'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc='/articles/image-single-post.jpg'
                alt='article one image'
                articleUrl='/'
                content={{
                  categories: [
                    { linkUrl: '/', linkText: 'it' },
                    { linkUrl: '/', linkText: 'solutions' }
                  ],
                  title:
                    'Three Important Things You Must Look For While Choosing Security',
                  description:
                    'You can quickly set up or delete access for employees, get access-triggered alerts when certain doors are opened, and quickly find video clips of access events. You can also lock a...',
                  publishDate: '2024-01-01T00:00:00.000Z',
                  publisher: 'mahmoud mohsen'
                }}
              />
            </div>
            <div
              // data-aos='fade-up'
              // data-aos-delay='600'
              data-aos='fade-left'
              data-aos-delay='250'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc='/articles/post2.jpg'
                alt='article one image'
                articleUrl='/'
                content={{
                  categories: [
                    { linkUrl: '/', linkText: 'it' },
                    { linkUrl: '/', linkText: 'solutions' }
                  ],
                  title:
                    'Three Important Things You Must Look For While Choosing Security',
                  description:
                    'You can quickly set up or delete access for employees, get access-triggered alerts when certain doors are opened, and quickly find video clips of access events. You can also lock a...',
                  publishDate: '2024-01-01T00:00:00.000Z',
                  publisher: 'mahmoud mohsen'
                }}
              />
            </div>
            <div
              data-aos='fade-left'
              data-aos-delay='400'
              data-aos-duration='400'
              data-aos-easing='ease-out'
              data-aos-once='true'
            >
              <ArticleCard
                imgSrc='/articles/post3.jpg'
                alt='article one image'
                articleUrl='/'
                content={{
                  categories: [
                    { linkUrl: '/', linkText: 'it' },
                    { linkUrl: '/', linkText: 'solutions' }
                  ],
                  title:
                    'Three Important Things You Must Look For While Choosing Security',
                  description:
                    'You can quickly set up or delete access for employees, get access-triggered alerts when certain doors are opened, and quickly find video clips of access events. You can also lock a...',
                  publishDate: '2024-01-01T00:00:00.000Z',
                  publisher: 'mahmoud mohsen'
                }}
              />
            </div>
          </div>

          <div
            data-aos='fade-up'
            data-aos-delay='50'
            data-aos-duration='400'
            data-aos-easing='ease-out'
            data-aos-once='true'
          >
            <Link
              href='/'
              className='mx-auto mt-8 flex w-fit items-center gap-3 text-base font-medium text-blue-gray-light transition-colors duration-300 hover:text-yellow-medium'
            >
              <span>Check All Blog Posts</span>
              <span className='icomoon icon-arrow-right text-xs'>
                {/* <FaLongArrowAltRight /> */}
              </span>
            </Link>
          </div>
        </div>
      </section>
    </ConfigAos>
  );
}

export default Articles;
