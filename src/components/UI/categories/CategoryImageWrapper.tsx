function CategoryImageWrapper({
  image,
  alt = ''
}: {
  image: string;
  alt: string;
}) {
  return (
    <div className='border-gray-[#e8e9eb] flex flex-col items-center justify-center border-b border-r border-solid p-5 transition-all duration-300 ease-linear'>
      <img
        src={image}
        alt={alt}
        className='block h-full scale-100 object-contain transition-all duration-300 ease-in hover:scale-110'
      />
    </div>
  );
}

export default CategoryImageWrapper;
