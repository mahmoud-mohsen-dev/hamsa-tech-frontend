'use client';
import MenuSidebar from '@/components/products/MenuSidebar';
import { Link, usePathname, useRouter } from '@/navigation';
import { NavbarLink } from '@/types/getIndexLayout';
import { CategoryType } from '@/types/getNavbarProductsCategories';
import {
  Collapse,
  CollapseProps,
  Divider,
  Drawer,
  Menu,
  MenuProps
} from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { useEffect, useState, useTransition } from 'react';
import { TiShoppingCart } from 'react-icons/ti';
import { HiOutlineHeart } from 'react-icons/hi';
import { v4 } from 'uuid';
import { useUser } from '@/context/UserContext';
import { useMyContext } from '@/context/Store';
import ProfileDropdownMenu from './ProfileDropdownMenu';
import ModalSearchInput from './ModalSearchInput';
import SelectLanguage from './SelectLanguage';
import ArrowDownAnimatedIcon from '../ArrowDownAnimatedIcon';
import Image from 'next/image';
import SearchInputField from './SearchInputField';
import { useParams } from 'next/navigation';

const { SubMenu } = Menu;

interface PropsType {
  onClose: () => void;
  isOpen: boolean;
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

function NavDrawerScreenSmall({
  onClose,
  isOpen,
  navLinks,
  productsSubNav
}: PropsType) {
  const router = useRouter();
  const defaultNavPathnames = [
    'products',
    'offers',
    'blog',
    'about-us',
    'support',
    'wishlist',
    'account',
    'signin'
  ];
  const pathname = usePathname();

  const [openKeys, setOpenKeys] = useState<string[]>(
    // params.get('category') !== null ?
    //   [params.get('category') ?? '']
    // :
    () => [
      defaultNavPathnames.find((pathnameDefaultItem) =>
        pathname.split('/').includes(pathnameDefaultItem)
      ) ?? ''
    ]
  ); // State for open keys
  const { userId } = useUser();
  // const { wishlistsData } = useMyContext();
  const [isPending, startTransition] = useTransition();
  const params = useParams();
  const locale = useLocale();
  const t = useTranslations('NavbarDrawer');
  const languageTranslation = useTranslations('LocaleSwitcher');

  const dataValues =
    (
      navLinks &&
      navLinks.length > 0 &&
      productsSubNav &&
      productsSubNav.length > 0
    ) ?
      navLinks
    : [];
  // const onClick: MenuProps['onClick'] = (e) => {
  //   // setCurrentActiveSubCategory([e.key ?? '']);
  // };

  useEffect(() => {
    setOpenKeys(() => {
      const getpathName = () => [
        defaultNavPathnames.find((pathnameDefaultItem) =>
          pathname.split('/').includes(pathnameDefaultItem)
        ) ?? ''
      ];
      return getpathName();
    });
  }, [pathname]);

  // Handle open menu change to allow only one open submenu at a time
  const onOpenChange = (keys: string[]) => {
    console.log('onOpenChange keys:', keys);
    const latestOpenKey = keys.find(
      (key) => openKeys.indexOf(key) === -1
    );
    if (latestOpenKey) {
      setOpenKeys([latestOpenKey]); // Only open the most recent key
    } else {
      setOpenKeys([]); // Close all if none is selected
    }
  };

  const handleiconIsActive = (id: string | null) => {
    setOpenKeys((prevState) => {
      return prevState[0] === id ? [] : [id ?? ''];
    });
  };

  const finalItems: CollapseProps['items'] = [];
  const collapseItems: CollapseProps['items'] =
    dataValues.map((item) => {
      return item.slug === 'products' ?
          {
            key: item?.slug,
            label: (
              <button
                onClick={() => {
                  onClose();
                  router.push(item?.slug ?? '/');
                }}
                className='w-[50%] px-4 py-3 text-start capitalize text-black-light'
              >
                {item?.name ?? ''}
              </button>
            ),
            showArrow: false,
            children: (
              <MenuSidebar data={productsSubNav} onClose={onClose} />
            ),
            extra: (
              <ArrowDownAnimatedIcon
                iconIsActive={item.id === openKeys[0]}
                handleIconIsActive={() =>
                  handleiconIsActive(item?.id ?? null)
                }
              />
            )
          }
        : {
            key: item?.slug,
            showArrow: false,
            label: (
              <button
                onClick={() => {
                  onClose();
                  router.push(item?.slug ?? '/');
                }}
                className='w-full px-4 py-3 text-start capitalize text-black'
              >
                {item?.name ?? ''}
              </button>
            )
          };
    }) ?? [];

  finalItems.push(...collapseItems);

  finalItems.push(
    ...[
      {
        key: 'wishlist',
        showArrow: false,
        label: (
          <button
            onClick={() => {
              onClose();
              router.push('/wishlist');
            }}
            className='w-full px-4 py-3 text-start capitalize text-black-light'
          >
            {t('wishlistLabel')}
          </button>
        )
      },

      {
        key: 'account',
        showArrow: false,
        label: (
          <button
            onClick={() => {
              onClose();
              router.push(userId ? '/account/settings' : '/signin');
            }}
            className='w-full px-4 py-3 text-start capitalize text-black-light'
          >
            {t('profileLabel')}
          </button>
        )
      }
    ]
  );
  if (userId) {
    collapseItems.push({
      key: 'sign out',
      showArrow: false,
      label: (
        <button
          onClick={() => {
            onClose();
            router.push('/signin');
          }}
          className='w-full text-start text-black-light'
        >
          <div className='flex items-center gap-2 px-4 py-3 capitalize'>
            <span>{t('signoutLabel')}</span>
          </div>
        </button>
      )
    });
  }
  finalItems.push(
    ...[
      {
        key: 'language',
        label: (
          <p className='px-4 py-3 capitalize'>
            {languageTranslation('label')}
          </p>
        ),
        showArrow: false,
        children: [
          <button
            key='en'
            disabled={isPending}
            onClick={() => {
              onClose();
              startTransition(() => {
                router.replace(
                  // @ts-expect-error -- TypeScript will validate that only known `params`
                  // are used in combination with a given `pathname`. Since the two will
                  // always match for the current route, we can skip runtime checks.
                  { pathname, params },
                  { locale: 'en' }
                );
              });
            }}
            className='flex w-full items-center gap-[10px] px-6 py-3 text-black-light disabled:cursor-not-allowed'
          >
            <Image
              src={'/languages/us.png'}
              alt='USA Flag'
              width={14}
              height={14}
              quality={100}
            />
            <span>
              {languageTranslation('locale', {
                locale: 'en'
              })}
            </span>
          </button>,
          <Divider
            key='divider'
            style={{
              marginBlock: 0
              // , backgroundColor: '#dedede'
            }}
          />,
          <button
            key='ar'
            disabled={isPending}
            onClick={() => {
              onClose();
              startTransition(() => {
                router.replace(
                  // @ts-expect-error -- TypeScript will validate that only known `params`
                  // are used in combination with a given `pathname`. Since the two will
                  // always match for the current route, we can skip runtime checks.
                  { pathname, params },
                  { locale: 'ar' }
                );
              });
            }}
            className='flex w-full items-center gap-[10px] px-6 py-3 text-black-light disabled:cursor-not-allowed'
          >
            <Image
              src={'/languages/eg.png'}
              alt='Egypt Flag'
              width={14}
              height={14}
              quality={100}
            />
            <span>
              {languageTranslation('locale', {
                locale: 'ar'
              })}
            </span>
          </button>
        ],
        extra: (
          <ArrowDownAnimatedIcon
            iconIsActive={'language' === openKeys[0]}
            handleIconIsActive={() => handleiconIsActive('language')}
          />
        ),
        styles: {
          body: {
            backgroundColor: 'white'
          }
        }
      }
    ]
  );

  return (
    <Drawer
      title={
        <button
          className='flex h-full items-center gap-3 md:gap-4'
          onClick={() => {
            onClose();
            router.push('/');
          }}
        >
          <Image
            src='/hamsa-logo.svg'
            width={24}
            height={24}
            alt='Hamsa Tech Logo'
          />
          <h1 className='flex items-center gap-1'>
            <span className='text-md font-semibold uppercase text-blue-dark'>
              {t('logo_part_1')}
            </span>
            <span className='text-md font-semibold uppercase text-red-shade-350'>
              {t('logo_part_2')}
            </span>
          </h1>
        </button>
      }
      onClose={onClose}
      open={isOpen}
      closable
      destroyOnClose
      width={500}
      className={`reverse nav-drawer-screen-small`}
      placement={locale === 'ar' ? 'left' : 'right'}
      styles={{
        // header: { backgroundColor: 'white' },
        // mask: { backgroundColor: 'transparent' },
        header: { paddingInline: '16px' },
        body: {
          paddingInline: 0,
          paddingBlock: 0,
          overflowY: 'auto',
          flexBasis: 'calc(100vh - 90px)'
        }
      }}
      // style={{ backgroundColor: 'transparent' }}
    >
      <div className=''>
        <div>
          <div className='w-full bg-white px-4 py-3'>
            <SearchInputField style={{ marginTop: 0 }} />
          </div>
          <Collapse
            items={finalItems}
            // defaultActiveKey={['1']}
            activeKey={openKeys}
            onChange={onOpenChange}
            accordion
            ghost={true}
            //   style={{ padding: 0 }}
            //   itemsStyle={{ padding: 0 }}
          />
        </div>
      </div>
    </Drawer>
  );
}

export default NavDrawerScreenSmall;
