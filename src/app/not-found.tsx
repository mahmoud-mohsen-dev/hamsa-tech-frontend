// // import { Link } from '@/i18n/routing';
// // eslint-disable-next-line
// import Link from 'next/link';

// import Error from 'next/error';
// eslint-disable-next-line no-restricted-imports
import Link from 'next/link';

// // Render the default Next.js 404 page when a route
// // is requested that doesn't match the middleware and
// // therefore doesn't have a locale associated with it.

// export default function NotFound() {
//   return (
//     <html lang='en'>
//       <body>
//         <div style={{ textAlign: 'center', padding: '50px' }}>
//           <h1>404 - Page Not Found</h1>
//           <p>Sorry, the page you are looking for does not exist.</p>
//           <Link href='/'>
//             {/* <a style={{ color: 'blue', textDecoration: 'underline' }}> */}
//             Go back to Home
//             {/* </a> */}
//           </Link>
//         </div>
//       </body>
//     </html>
//   );
// }

// 'use client';

// import Error from 'next/error';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang='en'>
      <body>
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <h1 className='text-xl font-bold text-black-medium'>
            404 - Page Not Found
          </h1>
          <h3 className='font-semiboldbold mt-3 text-lg text-black-light'>
            Sorry, the page you are looking for does not exist.
          </h3>
          <Link
            href='/'
            className='mx-auto mt-5 w-fit rounded-sm bg-blue-accent px-4 py-2 text-base font-bold capitalize text-white'
          >
            Go back to Home
          </Link>
        </div>
      </body>
    </html>
  );
}
