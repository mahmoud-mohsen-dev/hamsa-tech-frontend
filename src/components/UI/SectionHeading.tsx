function SectionHeading({
  children,
  className
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`mb-10 flex items-center justify-center gap-2 text-center text-2xl font-bold capitalize text-black-light sm:text-3xl md:text-4xl ${className}`}
    >
      {children}
    </div>
  );
}

export default SectionHeading;
