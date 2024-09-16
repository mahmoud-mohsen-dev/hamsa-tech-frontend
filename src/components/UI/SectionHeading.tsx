function SectionHeading({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={`mb-10 text-center text-2xl font-bold capitalize text-black-light sm:text-3xl md:text-4xl ${className}`}
    >
      {children}
    </h2>
  );
}

export default SectionHeading;
