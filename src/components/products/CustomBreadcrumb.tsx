import { Breadcrumb } from 'antd';

const CustomBreadcrumb = ({
  items
}: {
  items: { href: string; title: React.ReactNode }[];
}) => <Breadcrumb style={{ marginLeft: '24px' }} items={items} />;

export default CustomBreadcrumb;
