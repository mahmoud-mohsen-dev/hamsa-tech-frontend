import { getTranslations } from 'next-intl/server';
import SingupToNewsLetterForm from './SingupToNewsLetterForm';

async function SignupToNewsLetter({
  className = 'relative -top-12 bg-white'
}: {
  className?: string;
}) {
  const t = await getTranslations(
    'BlogPage.child.content.signupToNewsLetter'
  );
  return (
    <section className={className}>
      <div className='mx-auto max-w-screen-xl px-4'>
        <div className='mx-auto max-w-screen-md sm:text-center'>
          <h2 className='mb-4 text-2xl font-extrabold tracking-tight text-gray-900 sm:text-4xl'>
            {t('title')}
          </h2>
          <p className='mx-auto mb-8 max-w-2xl text-gray-500 sm:text-xl md:mb-12'>
            {t('description')}
          </p>

          <SingupToNewsLetterForm />
        </div>
      </div>
    </section>
  );
}

export default SignupToNewsLetter;
