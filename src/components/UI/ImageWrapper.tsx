// import Image from 'next/image';

function ImageWrapper({
  imgSrc,
  alt,
  className = ''
}: {
  imgSrc: string;
  alt: string;
  className?: string;
}) {
  return (
    <div>
      <img
        src={imgSrc}
        alt={alt}
        style={{ height: '40px' }}
        className={`object-contain ${className}`}
      />
    </div>
  );
}

export default ImageWrapper;
