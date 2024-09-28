import { Spin } from 'antd';

function Loading() {
  return (
    <div className='grid h-screen w-full place-content-center'>
      <Spin size='large' />
    </div>
  );
}

export default Loading;
