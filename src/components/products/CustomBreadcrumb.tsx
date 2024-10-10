import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({
  items,
  locale
}: {
  items: { href: string; title: React.ReactNode }[];
  locale?: string;
}) => (
  <div
    className={`${locale === 'ar' ? 'lg:mr-[15px]' : 'lg:ml-[24px]'}`}
  >
    <Breadcrumb
      // style={{
      //   margin: locale === 'ar' ? '0 15px 0 0' : '0 0 0 24px'
      // }}
      items={items}
    />
  </div>
);

export default CustomBreadcrumb;
