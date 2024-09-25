function Info({
  infoKey,
  value,
  className,
  isCapitalized = true
}: {
  infoKey: string;
  value: React.ReactNode;
  className?: string;
  isCapitalized?: boolean;
}) {
  return (
    <div
      className={`ml-6 mt-3 flex items-center gap-20 ${className}`}
    >
      <h3 className='min-w-[180px] text-base font-semibold capitalize text-gray-normal'>
        {infoKey}
      </h3>
      <h3
        className={`flex text-base font-normal text-gray-normal ${isCapitalized ? 'capitalize' : 'normal-case'}`}
      >
        {value ?? ''}
      </h3>
    </div>
  );
}

export default Info;
