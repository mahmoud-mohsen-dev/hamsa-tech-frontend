import { Spin } from 'antd';

function Loading() {
  return (
    <div className='grid h-[calc(100vh-64px)] w-full place-content-center'>
      <Spin size='large' />
    </div>
  );
}

export default Loading;
