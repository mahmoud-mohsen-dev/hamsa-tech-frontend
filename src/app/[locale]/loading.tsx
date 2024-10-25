'use client';
import useAddColoredNavClass from '@/hooks/useAddColoredNavClass';
import { Spin } from 'antd';

function Loading() {
  useAddColoredNavClass();
  return (
    <div className='loader grid h-[calc(100vh-64px)] w-full place-content-center'>
      <Spin size='large' />
    </div>
  );
}

export default Loading;
