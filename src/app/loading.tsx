import { Spin } from 'antd';

function Loading() {
  return (
    <div className='grid h-screen w-screen place-content-center'>
      <Spin size='large' />
    </div>
  );
}

export default Loading;
