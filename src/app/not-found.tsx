// eslint-disable-next-line no-restricted-imports
import Link from 'next/link';

// Render the default Next.js 404 page when a route
// is requested that doesn't match the middleware and
// therefore doesn't have a locale associated with it.

export default function NotFound() {
  return (
    <html lang='en'>
      <body className='bg-white'>
        <section className='grid place-content-center bg-white md:min-h-screen'>
          <div className='mx-auto max-w-screen-xl px-4 py-8 lg:px-6 lg:py-16'>
            <div className='mx-auto max-w-screen-sm text-center'>
              <h1 className='mb-4 text-7xl font-extrabold tracking-tight text-blue-sky-medium lg:text-9xl'>
                404
              </h1>
              <p className='mb-4 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl'>
                Page Not Found
              </p>
              <p className='mb-4 text-lg font-light text-gray-500'>
                Sorry, the page you are looking for does not exist.
              </p>
              <Link
                href='/'
                className='bg-primary-600 hover:bg-primary-800 focus:ring-primary-300 my-4 inline-flex rounded-lg bg-blue-sky-medium px-5 py-2.5 text-center text-sm font-medium capitalize text-white focus:outline-none focus:ring-4'
              >
                Go back to Home
              </Link>
            </div>
          </div>
        </section>
      </body>
    </html>
  );
}
