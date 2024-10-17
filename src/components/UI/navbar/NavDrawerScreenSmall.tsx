'use client';
import MenuSidebar from '@/components/products/MenuSidebar';
import { Link, useRouter } from '@/navigation';
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
import { useState } from 'react';
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
  const [openKeys, setOpenKeys] = useState<string[]>(
    // params.get('category') !== null ?
    //   [params.get('category') ?? '']
    // :
    []
  ); // State for open keys
  const { userId } = useUser();
  const { wishlistsData } = useMyContext();
  const locale = useLocale();
  const t = useTranslations('NavbarDrawer');
  console.log('drawer');
  console.log(navLinks);

  const dataValues =
    (
      navLinks &&
      navLinks.length > 0 &&
      productsSubNav &&
      productsSubNav.length > 0
    ) ?
      navLinks
    : [];
  //   const items = [];
  //   console.log(items);
  const onClick: MenuProps['onClick'] = (e) => {
    // setCurrentActiveSubCategory([e.key ?? '']);
  };

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

  const collapseItems: CollapseProps['items'] =
    dataValues.map((item) => {
      return item.slug === 'products' ?
          {
            key: item?.id,
            label: (
              <button
                onClick={() => {
                  onClose();
                  router.push(item?.slug ?? '/');
                }}
                className='text-black-light'
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
            key: item?.id,
            showArrow: false,
            label: (
              <button
                onClick={() => {
                  onClose();
                  router.push(item?.slug ?? '/');
                }}
                className='text-black'
              >
                {item?.name ?? ''}
              </button>
            )
          };
    }) ?? [];

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
    >
      <div className='min-h-[100vh-57px] overflow-y-auto'>
        <div>
          <Collapse
            items={collapseItems}
            // defaultActiveKey={['1']}
            activeKey={openKeys}
            onChange={onOpenChange}
            accordion
            ghost={true}
            //   style={{ padding: 0 }}
            //   itemsStyle={{ padding: 0 }}
          />
        </div>
        {/* <Divider /> */}
        <div className='my-6 flex flex-col items-center gap-5'>
          <Link
            href='/wishlist'
            className='wishlist relative text-black-light'
          >
            {wishlistsData.length > 0 && (
              <div className='absolute right-0 top-0 z-[200] flex h-4 w-4 -translate-y-1/2 translate-x-1/2 items-center justify-center rounded-full bg-red-shade-350 bg-opacity-80'>
                <p className='text-[.5rem] leading-[1rem] text-white'>
                  {wishlistsData.length}
                </p>
              </div>
            )}
            <div className='flex items-center gap-2'>
              <span>Wishlist</span>
              <HiOutlineHeart size={22} className='text-inherit' />
            </div>
          </Link>
          <Link
            href={userId ? '/profile' : '/signin'}
            className='profile text-black-light'
          >
            <div className='flex items-center gap-2'>
              <span>Profile</span>
              <ProfileDropdownMenu />
            </div>
          </Link>

          {/* <div className='h-[1px] w-full rounded-sm bg-[#eaeaea]'></div> */}
        </div>
        {/* <Divider /> */}
        <div className='my-5 flex flex-col items-center gap-5'>
          <ModalSearchInput styleColor='#333' />
          <div>
            <SelectLanguage
              defaultValue={locale}
              className='select-language-screen-small'
              styleWidth={'100%'}
              styleIconColor={{ color: '#333' }}
            />
          </div>
        </div>
      </div>
    </Drawer>
  );
}

export default NavDrawerScreenSmall;
