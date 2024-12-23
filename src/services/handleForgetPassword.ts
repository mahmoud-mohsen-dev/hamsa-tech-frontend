import { setCookie } from '@/utils/cookieUtils';
import { postRestAPI } from './graphqlCrud';

export const sendResetCode = async ({
  setLoadingMessage,
  setErrorMessage,
  setSuccessMessage,
  email,
  invalidEmailAddressText,
  invalidEmailAddressRegisteredByGoogleOrFacebookText,
  codeSentSuccessfullyMessageText,
  errorDuringFormSubmissionText,
  routerPushToOtpPage
}: {
  setLoadingMessage: React.Dispatch<React.SetStateAction<boolean>>;
  setErrorMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  setSuccessMessage: React.Dispatch<
    React.SetStateAction<string | null>
  >;
  email: string;
  invalidEmailAddressText: string;
  invalidEmailAddressRegisteredByGoogleOrFacebookText?: string;
  codeSentSuccessfullyMessageText: string;
  errorDuringFormSubmissionText: string;
  routerPushToOtpPage: () => void;
}) => {
  try {
    setLoadingMessage(true);
    const { data, error } = await postRestAPI({
      pathname: 'auth/forgot-password-otp',
      body: { email }
    });

    if (
      error ===
      'This email address was registered using Facebook or Google login and cannot be used to change the password.'
    ) {
      console.error(error);
      if (invalidEmailAddressRegisteredByGoogleOrFacebookText) {
        setErrorMessage(
          invalidEmailAddressRegisteredByGoogleOrFacebookText
        );
        return;
      }
    }

    if (error || !data?.ok) {
      console.error(error);
      setErrorMessage(invalidEmailAddressText);
      return;
    }

    setSuccessMessage(codeSentSuccessfullyMessageText);
    // setEmailResetPassword(email);
    const fifteenMinutes = 900000 * (1 / 864e5);
    setCookie('emailResetPassword', email, fifteenMinutes);
    setTimeout(routerPushToOtpPage, 500);
  } catch (err) {
    console.error('Error during form submission:', err);
    setErrorMessage(errorDuringFormSubmissionText);
  } finally {
    setTimeout(() => {
      setLoadingMessage(false);
    }, 500);
  }
};
