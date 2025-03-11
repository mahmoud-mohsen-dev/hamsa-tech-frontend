'use client';
import useAddColoredNavClass from '@/hooks/useAddColoredNavClass';
import { Spin } from 'antd';

function Loading({
  className = 'h-[calc(100vh-64px)]'
}: {
  className?: string;
}) {
  useAddColoredNavClass();
  return (
    <div
      className={`loader grid ${className} w-full place-content-center`}
    >
      <Spin size='large' />
    </div>
  );
}

export default Loading;
