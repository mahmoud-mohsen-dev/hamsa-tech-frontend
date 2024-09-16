'use client';
// import { Button, Input, Space } from 'antd';
import { IoIosSend } from 'react-icons/io';

function SubcribeInput() {
  return (
    <div className='relative w-full max-w-80'>
      <input
        defaultValue=''
        placeholder='Subscribe with us'
        className='w-full rounded-md bg-[rgba(255,255,255,.1)] p-3 pr-12 ring ring-transparent ring-offset-blue-gray-medium focus:outline-none focus:ring-blue-300 focus:ring-offset-2'
      ></input>
      <button className='absolute right-0 top-1/2 w-10 -translate-y-1/2'>
        <IoIosSend size={28} />
      </button>
    </div>
  );
}

export default SubcribeInput;
