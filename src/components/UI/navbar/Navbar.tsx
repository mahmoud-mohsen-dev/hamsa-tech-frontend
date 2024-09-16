import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import ActiveLink from './ActiveLink';
// import { fetchNavItems } from '@/services/navItemRequst';
import NavSub from './NavSub';
import { NavItemType } from '@/types';
import { useLocale } from 'next-intl';
import { NavbarLinkData } from '@/types/getNavItems';
import { capitalize } from '@/utils/helpers';
// import { clear } from 'console';
// import { getNavbarItems } from '@/services/navItems';

interface PropsType {
  linkHovered: string;
  setLinkHovered: Dispatch<SetStateAction<string>>;
  navLinks: NavbarLinkData[];
}

function Navbar({
  linkHovered,
  setLinkHovered,
  navLinks
}: PropsType) {
  console.log(navLinks);
  // const locale = useLocale();
  const [navItems] = useState<NavItemType | null>(null);

  const listStyles = 'h-full flex items-center';
  const linksStyles = `nav_link 2xl:px-3 3xl:px-5 font-medium relative after:left-1/2 after:-translate-x-1/2 after:bottom-0 uppercase text-sm text-white h-full block flex items-center  after:bg-transparent after:w-[80%] after:h-[2px] hover:after:bg-red-shade-300 after:absolute after:content-['']`;

  const handleLinkHover = (link: string) => {
    setLinkHovered(link);
  };

  useEffect(() => {
    const loadNavItems = async () => {
      // const { data, error } = await getNavbarItems(locale);
      // // const { data, error } = await fetchNavItems();
      // if (error) {
      //   console.error(error);
      // } else {
      //   console.log(data);
      //   // setNavItems(data);
      // }
    };

    loadNavItems();
  }, []);

  return (
    <nav className='hidden h-full items-center 2xl:flex'>
      <ul className='flex h-full items-stretch'>
        {navLinks[0] &&
          navLinks[0].attributes.navbar.length > 0 &&
          navLinks[0].attributes.navbar.map((item) => {
            return (
              <li
                onMouseEnter={() => handleLinkHover(item.name)}
                onMouseLeave={() => handleLinkHover('')}
                key={item.id}
                className={listStyles}
              >
                <ActiveLink
                  href={`${item.slug}`}
                  activeClassName='!text-red-shade-350'
                  className={linksStyles}
                >
                  {item.name}
                </ActiveLink>
                {/* <NavSub
                  name={item.name}
                  currentHovered={linkHovered}
                  items={item.children ?? []}
                /> */}
              </li>
            );
          })}
        {/* <li
          onMouseEnter={() => handleLinkHover('products')}
          onMouseLeave={() => handleLinkHover('')}
          className={listStyles}
        >
          <ActiveLink
            href={`/products?category=${encodeURIComponent('Indoor HD Cameras')}`}
            activeClassName='!text-red-shade-350'
            className={linksStyles}
          >
            Products
          </ActiveLink>
          <NavSub
            name='products'
            currentHovered={linkHovered}
            items={navItems?.products ?? []}
          />
        </li>
        <li
          onMouseEnter={() => handleLinkHover('offers')}
          onMouseLeave={() => handleLinkHover('')}
          className={listStyles}
        >
          <ActiveLink
            href='/offers'
            activeClassName='!text-red-shade-350'
            className={linksStyles}
          >
            Offers
          </ActiveLink>
          <NavSub
            name='offers'
            currentHovered={linkHovered}
            items={navItems?.offers ?? []}
          />
        </li>
        <li
          onMouseEnter={() => handleLinkHover('blog')}
          onMouseLeave={() => handleLinkHover('')}
          className={listStyles}
        >
          <ActiveLink
            href='/blog'
            activeClassName='!text-red-shade-350'
            className={linksStyles}
          >
            Blog
          </ActiveLink>
          <NavSub
            name='blog'
            currentHovered={linkHovered}
            items={navItems?.blog ?? []}
          />
        </li>
        <li
          onMouseEnter={() => handleLinkHover('about')}
          onMouseLeave={() => handleLinkHover('')}
          className={listStyles}
        >
          <ActiveLink
            href='/about'
            activeClassName='!text-red-shade-350'
            className={linksStyles}
          >
            About Us
          </ActiveLink>
          <NavSub
            name='about'
            currentHovered={linkHovered}
            items={navItems?.aboutUs ?? []}
          />
        </li>
        <li
          onMouseEnter={() => handleLinkHover('support')}
          onMouseLeave={() => handleLinkHover('')}
          className={listStyles}
        >
          <ActiveLink
            href='/support'
            activeClassName='!text-red-shade-350'
            className={linksStyles}
          >
            Support
          </ActiveLink>
          <NavSub
            name='support'
            currentHovered={linkHovered}
            items={navItems?.support ?? []}
          />
        </li> */}
      </ul>
    </nav>
  );
}

export default Navbar;
