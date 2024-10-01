import { Link } from '@/navigation';

function SignupPage() {
  return (
    <section className='mx-auto flex flex-col items-center justify-center px-6 md:h-screen lg:py-0'>
      <div className='w-full rounded-lg bg-white shadow sm:max-w-md md:mt-0 xl:p-0'>
        <div className='space-y-4 p-6 sm:p-8 md:space-y-6'>
          <h1 className='text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl'>
            Create an account
          </h1>
          <form className='space-y-4 md:space-y-6' action='#'>
            <div>
              <label
                htmlFor='email'
                className='mb-2 block text-sm font-medium text-gray-900'
              >
                Your email
              </label>
              <input
                type='email'
                name='email'
                id='email'
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900'
                placeholder='name@company.com'
                required
              />
            </div>
            <div>
              <label
                htmlFor='password'
                className='mb-2 block text-sm font-medium text-gray-900'
              >
                Password
              </label>
              <input
                type='password'
                name='password'
                id='password'
                placeholder='••••••••'
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900'
                required
              />
            </div>
            <div>
              <label
                htmlFor='confirm-password'
                className='mb-2 block text-sm font-medium text-gray-900'
              >
                Confirm password
              </label>
              <input
                type='confirm-password'
                name='confirm-password'
                id='confirm-password'
                placeholder='••••••••'
                className='focus:ring-primary-600 focus:border-primary-600 block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900'
                required
              />
            </div>
            <div className='flex items-start'>
              <div className='flex h-5 items-center'>
                <input
                  id='terms'
                  aria-describedby='terms'
                  type='checkbox'
                  className='focus:ring-3 focus:ring-primary-300 h-4 w-4 rounded border border-gray-300 bg-gray-50'
                  required
                />
              </div>
              <div className='ml-3 text-sm'>
                <label
                  htmlFor='terms'
                  className='font-light text-gray-500'
                >
                  I accept the{' '}
                  <a
                    className='text-primary-600 font-medium hover:underline'
                    href='#'
                  >
                    Terms and Conditions
                  </a>
                </label>
              </div>
            </div>
            <button
              type='submit'
              className='bg-primary-600 hover:bg-primary-700 focus:ring-primary-300 w-full rounded-lg px-5 py-2.5 text-center text-sm font-medium text-white focus:outline-none focus:ring-4'
            >
              Create an account
            </button>
            <p className='text-sm font-light text-gray-500'>
              Already have an account?{' '}
              <Link
                href='/login'
                className='text-primary-600 font-medium hover:underline'
              >
                Login here
              </Link>
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

export default SignupPage;
