function Info({
  infoKey,
  value,
  className = '',
  isCapitalized = true
}: {
  infoKey: string;
  value: React.ReactNode;
  className?: string;
  isCapitalized?: boolean;
}) {
  return value ?
      <div
        className={`mt-3 grid grid-cols-[120px_1fr] gap-4 md:grid-cols-[200px_1fr] md:gap-5 2xl:ml-6 ${className}`}
      >
        <h3 className='text-base font-semibold capitalize text-gray-normal'>
          {infoKey}
        </h3>
        <h3
          className={`text-base font-normal text-gray-normal ${isCapitalized ? 'capitalize' : 'normal-case'}`}
        >
          {value ?? ''}
        </h3>
      </div>
    : null;
}

export default Info;
