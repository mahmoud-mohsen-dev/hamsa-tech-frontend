interface InputChangeQuantityType {
  handleDecrement: () => void;
  isLoading: boolean;
  inputQuantity: number;
  maxValue: number;
  minValue: number;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleIncrement: () => void;
  handleBlur: (e: React.ChangeEvent<HTMLInputElement>) => void;
  classNameWrapper?: string;
  classNameIncrement?: string;
  classNameDecrement?: string;
  classNameInput?: string;
  classNameParent?: string;
}

function InputChangeQuantity({
  handleDecrement,
  isLoading,
  inputQuantity,
  maxValue,
  minValue,
  handleChange,
  handleIncrement,
  handleBlur,
  classNameWrapper,
  classNameIncrement,
  classNameDecrement,
  classNameInput,
  classNameParent
}: InputChangeQuantityType) {
  return (
    <div
      className={`inline-block rounded-lg border border-gray-200 bg-white px-3 py-2 text-black-medium ${classNameWrapper ?? ''}`}
    >
      <div
        className={`flex items-center gap-x-1.5 ${classNameParent ?? ''}`}
      >
        <button
          type='button'
          onClick={handleDecrement}
          className={`inline-flex size-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${classNameIncrement ?? ''}`}
          aria-label='Decrease'
          disabled={isLoading || inputQuantity === 0}
        >
          <svg
            className='size-3.5 shrink-0'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14'></path>
          </svg>
        </button>
        <input
          className={`no-arrows w-8 border-0 bg-transparent p-0 text-center text-gray-800 focus:ring-0 ${classNameInput ?? ''}`}
          style={{ MozAppearance: 'textfield' }}
          type='number'
          value={inputQuantity}
          max={maxValue}
          min={minValue}
          // readOnly
          disabled={isLoading}
          onChange={handleChange}
          onBlur={handleBlur}
        />
        <button
          type='button'
          onClick={handleIncrement}
          className={`inline-flex size-6 items-center justify-center gap-x-2 rounded-md border border-gray-200 bg-white text-sm font-medium text-gray-800 shadow-sm hover:bg-gray-50 focus:bg-gray-50 focus:outline-none disabled:pointer-events-none disabled:opacity-50 ${classNameDecrement ?? ''}`}
          aria-label='Increase'
          disabled={inputQuantity === maxValue || isLoading}
        >
          <svg
            className='size-3.5 shrink-0'
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          >
            <path d='M5 12h14'></path>
            <path d='M12 5v14'></path>
          </svg>
        </button>
      </div>
    </div>
  );
}

export default InputChangeQuantity;
