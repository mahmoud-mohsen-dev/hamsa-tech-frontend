'use client';
// import { Link } from '@/navigation';
// import { forwardRef } from 'react';

// Define the base props type for MyButton (without href)
interface BaseButtonProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
  target?: '_blank' | '_self';
  className?: string;
}

// // Extend BaseButtonProps for AnchorProps, making href optional
// interface MyButtonProps extends BaseButtonProps {
//   href?: string; // Optional for MyButton
// }

// Extend BaseButtonProps for AnchorProps, making href required
interface AnchorProps extends BaseButtonProps {
  href: string; // Required for Anchor
  applyDefaultClasses?: boolean;
}

// // Use React.ForwardRefRenderFunction to properly type the forwarded ref
// const MyButton: React.ForwardRefRenderFunction<
//   HTMLAnchorElement,
//   MyButtonProps
// > = (
//   { onClick, href, children, target = '_self', className = '' },
//   ref
// ) => {
//   return (
//     <a
//       href={href}
//       onClick={onClick}
//       ref={ref}
//       target={target}
//       className={className}
//     >
//       {children}
//     </a>
//   );
// };

// // Use React.forwardRef to wrap the component
// const ForwardAnchor = forwardRef(MyButton);

function Anchor({
  children,
  href = '',
  className = '',
  applyDefaultClasses = true,
  target = '_self',
  onClick = () => {}
}: AnchorProps) {
  return (
    <a
      className={`flex items-center gap-2 ${applyDefaultClasses ? 'bounded text-xs text-blue-sky-normal hover:text-blue-sky-accent hover:underline' : ''} ${className}`}
      target={target}
      href={href}
      onClick={onClick}
    >
      {children}
    </a>
    // <Link href={href} passHref legacyBehavior>
    //   <ForwardAnchor
    //     target={target}
    //     className={className}
    //     onClick={onClick}
    //   >
    //     {children}
    //   </ForwardAnchor>
    // </Link>
  );
}

export default Anchor;
