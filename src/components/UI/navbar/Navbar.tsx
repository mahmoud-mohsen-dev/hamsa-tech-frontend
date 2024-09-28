import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ActiveLink from './ActiveLink';
// import { fetchNavItems } from '@/services/navItemRequst';
import NavSub from './NavSub';
import { useLocale } from 'next-intl';
import { capitalize } from '@/utils/helpers';
import { NavbarLink } from '@/types/getIndexLayout';
import { CategoryType } from '@/types/getNavbarProductsCategories';
// import { clear } from 'console';
// import { getNavbarItems } from '@/services/navItems';

interface PropsType {
  linkHovered: string;
  setLinkHovered: Dispatch<SetStateAction<string>>;
  navLinks: NavbarLink[];
  productsSubNav: CategoryType[];
}

function Navbar({
  linkHovered,
  setLinkHovered,
  navLinks,
  productsSubNav
}: PropsType) {
  // console.log(navLinks);
  // const locale = useLocale();
  // const [navItems] = useState<NavItemType | null>(null);

  const listStyles = 'h-full flex items-center';
  const linksStyles = `nav_link 2xl:px-3 3xl:px-5 font-medium relative after:left-1/2 after:-translate-x-1/2 after:bottom-0 uppercase text-sm text-white h-full block flex items-center  after:bg-transparent after:w-[80%] after:h-[2px] hover:after:bg-red-shade-300 after:absolute after:content-['']`;

  const handleLinkHover = (link: string) => {
    setLinkHovered(link);
  };

  // useEffect(() => {
  //   const loadNavItems = async () => {
  // const { data, error } = await getNavbarItems(locale);
  // // const { data, error } = await fetchNavItems();
  // if (error) {
  //   console.error(error);
  // } else {
  //   console.log(data);
  //   // setNavItems(data);
  // }
  // };

  //   loadNavItems();
  // }, []);

  return (
    <nav className='hidden h-full items-center 2xl:flex'>
      <ul className='flex h-full items-stretch'>
        {navLinks.length > 0 &&
          navLinks.map((item) => {
            // console.log(item);
            return (
              <li
                onMouseEnter={() => handleLinkHover(item.slug)}
                onMouseLeave={() => handleLinkHover('')}
                key={item.id}
                className={listStyles}
              >
                <ActiveLink
                  href={`/${item.slug}`}
                  activeClassName='!text-red-shade-350'
                  className={linksStyles}
                >
                  {item.name}
                </ActiveLink>
                {item.slug === 'products' &&
                  Array.isArray(productsSubNav) &&
                  productsSubNav.length > 0 && (
                    <NavSub
                      name={item.slug}
                      currentHovered={linkHovered}
                      items={productsSubNav}
                    />
                  )}
              </li>
            );
          })}
      </ul>
    </nav>
  );
}

export default Navbar;
