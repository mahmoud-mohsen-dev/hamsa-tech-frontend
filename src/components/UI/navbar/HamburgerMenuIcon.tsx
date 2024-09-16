import { useState } from 'react';

function HamburgerMenuIcon() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <button
      className='h-10 w-10'
      onClick={() => {
        setIsOpen(!isOpen);
      }}
    >
      <div className='grid justify-items-center gap-1.5'>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light transition ${isOpen ? 'translate-y-[.59375rem] rotate-45' : ''}`}
        ></span>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light ${isOpen ? 'scale-x-0' : ''}`}
        ></span>
        <span
          className={`h-[.2rem] w-[1.8rem] rounded-full bg-black-light transition ${isOpen ? '-translate-y-[.59375rem] -rotate-45' : ''}`}
        ></span>
      </div>
    </button>
  );
}

export default HamburgerMenuIcon;
