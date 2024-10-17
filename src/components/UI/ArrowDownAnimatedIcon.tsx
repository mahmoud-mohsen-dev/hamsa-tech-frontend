'use client';

interface ArrowDownAnimatedIconProps {
  iconIsActive: boolean;
  handleIconIsActive: () => void;
}

function ArrowDownAnimatedIcon({
  iconIsActive,
  handleIconIsActive
}: ArrowDownAnimatedIconProps) {
  console.log(iconIsActive);
  return (
    <button
      className={`custom-animated-arrow-down ${iconIsActive ? 'custom-animated-arrow-down-open' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        handleIconIsActive();
      }}
    >
      <span className='arrow-before'></span>
      <span className='arrow-after'></span>
    </button>
  );
}

export default ArrowDownAnimatedIcon;
