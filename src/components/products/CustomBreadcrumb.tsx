import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({
  items,
  locale
}: {
  items: { href: string; title: React.ReactNode }[];
  locale?: string;
}) => (
  <Breadcrumb
    style={{ margin: locale === 'ar' ? '0 15px 0 0' : '0 0 0 24px' }}
    items={items}
  />
);

export default CustomBreadcrumb;
