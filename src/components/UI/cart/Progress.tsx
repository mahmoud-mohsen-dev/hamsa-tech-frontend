import { Progress } from 'antd';
import { BsBoxSeam } from 'react-icons/bs';

function AppProgress() {
  return (
    <div className='progress-wrapper'>
      <Progress
        strokeLinecap='butt'
        percent={75}
        showInfo={false}
        strokeColor='rgb(153, 213, 207)'
        trailColor='white'
        style={{ lineHeight: 1, height: 40 }}
      />
      <div className='progress-label w-full text-sm font-medium'>
        <BsBoxSeam size={20} className='mr-2.5' />
        <div>
          <span>Spend </span>
          <b className='font-bold uppercase'>110 EGP</b>
          <span> to </span>
          <b className='uppercase'>FREE SHIPPING</b>
        </div>
      </div>
    </div>
  );
}

export default AppProgress;
