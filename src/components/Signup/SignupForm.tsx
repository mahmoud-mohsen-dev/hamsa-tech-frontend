'use client';
import { Link, useRouter } from '@/navigation';
import {
  fetchGraphql,
  fetchGraphqlClient,
  fetchGraphqlClientAuthenticated
} from '@/services/graphqlCrud';
import {
  Checkbox,
  ConfigProvider,
  Form,
  Input,
  message,
  Select,
  Space
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useLocale, useTranslations } from 'next-intl';
import { IoIosArrowDown } from 'react-icons/io';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import {
  SignupResponseType,
  UpdateSignupUserResponseType
} from '@/types/authincationResponseTypes';
import { getIdFromToken, setCookie } from '@/utils/cookieUtils';
import { useUser } from '@/context/UserContext';
const { Option } = Select;

const signupQUery = ({
  email,
  password
}: {
  email: string;
  password: string;
}) => {
  return `mutation {
    register(input: {
      username: "${email}",
      email: "${email}",
      password: "${password}"
    }) {
      jwt
    }
  }`;
};

const updateTheSignupUser = ({
  id,
  fullName,
  phoneNumber,
  aggreeToOurTerms,
  subscribedToNewsLetterAndOffers,
  prefix
}: {
  id: string;
  fullName: string;
  phoneNumber: string;
  aggreeToOurTerms: boolean;
  subscribedToNewsLetterAndOffers: boolean;
  prefix: string;
}) => {
  return `mutation UpdateUsersPermissionsUser {
    updateUsersPermissionsUser(
        id: "${id}"
        data: {
            full_name: "${fullName}"
            phone: "${phoneNumber}"
            aggree_to_our_terms: ${aggreeToOurTerms}
            subscribed_to_new_offers_and_newsletters: ${subscribedToNewsLetterAndOffers}
            phone_country_code: ${prefix}
        }
    ) {
        data {
            id
        }
    }
  }`;
};

function SignupForm() {
  const t = useTranslations('SignupPage.content');
  const e = useTranslations('CheckoutPage.content');
  const router = useRouter();
  const [form] = useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const { setUserId } = useUser();
  const locale = useLocale();

  const onFinish = (formValues: {
    fullName: string;
    email: string;
    password: string;
    aggreeToTerms: boolean;
    newsLetterAndOffersSubscription: boolean;
    phone: { number: string; prefix: string };
  }) => {
    // Perform form submission logic here
    const {
      fullName,
      email,
      password,
      phone: { number, prefix },
      aggreeToTerms,
      newsLetterAndOffersSubscription
    } = formValues;

    const createUser = async () => {
      try {
        console.log('Received values of form:', formValues);
        messageApi.open({
          type: 'loading',
          content: e('form.loading'),
          duration: 0
        });
        // Make API call to register user
        const { data: signupData, error: signupError } =
          (await fetchGraphqlClient(
            signupQUery({
              email,
              password
            })
          )) as SignupResponseType;

        if (
          signupError ||
          !signupData ||
          !signupData?.register?.jwt
        ) {
          const messageError =
            signupError === 'Email or Username are already taken' ?
              t('formValidationErrorMessages.emailTakenError')
            : 'Error creating user';
          messageApi.error(messageError);
          console.error('Error creating user:', signupError);
          return;
        }
        setCookie('token', signupData.register.jwt);
        const userloggedInId = getIdFromToken();

        if (!userloggedInId) {
          messageApi.error('error while getting user id');
          console.error(
            'error while getting user id: ',
            userloggedInId
          );
          return;
        }
        // set the user id in the user context
        setUserId(userloggedInId);

        // Make API call to update user permissions
        const { data: signupUpdateData, error: signupUpdateError } =
          (await fetchGraphqlClientAuthenticated(
            updateTheSignupUser({
              id: userloggedInId,
              fullName,
              phoneNumber: number,
              prefix,
              aggreeToOurTerms: aggreeToTerms,
              subscribedToNewsLetterAndOffers:
                newsLetterAndOffersSubscription
            })
          )) as UpdateSignupUserResponseType;

        if (
          signupUpdateError ||
          !signupUpdateData ||
          !signupUpdateData?.updateUsersPermissionsUser?.data?.id
        ) {
          messageApi.error('Error occured while creating user');
          console.error(
            'Error updating user permissions:',
            signupUpdateError
          );
          return;
        }

        messageApi.success('successfully registered');
        router.push('/products');
      } catch (error) {
        console.log(error);
      } finally {
        setTimeout(messageApi.destroy, 2500);
      }
    };
    createUser();
  };

  // Function to handle form submission failure (validation errors)
  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    messageApi.error(
      errorInfo?.errorFields[0]?.errors[0] ??
        e('form.formSubmissionFailed')
    );
    console.log('Form submission failed:', errorInfo);
  };

  const validateFullName = (_: any, value: string) => {
    if (!value) {
      return Promise.reject(
        new Error(t('formValidationErrorMessages.fullNameRequired'))
      );
    }

    // Regex to allow English letters, Arabic letters, and spaces
    const namePattern = /^[a-zA-Z\u0621-\u064A\s]+$/;
    const names = value.trim().split(/\s+/); // Split by spaces

    // Check for minimum and maximum number of names
    const minNames = 2; // Minimum number of names
    const maxNames = 4; // Maximum number of names

    if (names.length < minNames || names.length > maxNames) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.fullNameLengthError')
        )
      );
    }

    for (const name of names) {
      if (!namePattern.test(name)) {
        return Promise.reject(
          new Error(
            t('formValidationErrorMessages.fullNameCharacterError')
          )
        );
      }
    }

    return Promise.resolve();
  };

  const validatePassword = (_: any, value: string) => {
    const minLength = 8;
    const maxLength = 20;

    if (!value) {
      return Promise.reject(
        new Error(t('formValidationErrorMessages.passwordRequired'))
      );
    }

    if (value.length < minLength) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.minValidationPasswordError')
        )
      );
    }
    if (value.length > maxLength) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.maxValidationPasswordError')
        )
      );
    }

    const hasLetter = /[a-zA-Z]/.test(value); // Check for at least one English letter
    const hasNumber = /\d/.test(value); // Check for at least one number

    // Check if it contains only valid characters (letters, numbers, special characters)
    const validCharactersPattern =
      /^[a-zA-Z0-9!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]*$/;

    if (!validCharactersPattern.test(value)) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.passwordInvalidCharacters')
        )
      );
    }

    if (!hasLetter) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.passwordLetterError')
        )
      );
    }

    if (!hasNumber) {
      return Promise.reject(
        new Error(
          t('formValidationErrorMessages.passwordNumberError')
        )
      );
    }

    return Promise.resolve();
  };

  const validatePhone = (_: any, value: string) => {
    const phoneNumberPattern = /^[0-9]*$/; // Regex to allow only numbers
    if (!value) {
      return Promise.reject(
        new Error(t('formValidationErrorMessages.phoneRequired'))
      );
    }
    if (!phoneNumberPattern.test(value)) {
      return Promise.reject(
        new Error(t('formValidationErrorMessages.phoneTypeError'))
      );
    }

    const prefix = form.getFieldValue(['phone', 'prefix']); // Use form instance to get prefix
    console.log(prefix);
    const isValidLength =
      prefix === 'Egypt_20' &&
      (value.length === 10 || value.length === 11); // Example for Egypt
    if (!isValidLength) {
      return Promise.reject(
        new Error(t('formValidationErrorMessages.phoneLengthError'))
      );
    }
    return Promise.resolve();
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          fontFamily: 'var(--font-inter)',
          colorPrimary: '#1677ff',
          borderRadius: 8,
          lineWidth: 1
        },
        components: {
          Input: {
            activeShadow: '0 0 0 3px rgba(5, 145, 255, 0.1)',
            paddingBlock: 10,
            paddingInline: 15
          },
          Checkbox: {
            borderRadiusSM: 5
          }
        }
      }}
    >
      <Form
        form={form}
        colon={false}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        initialValues={{
          aggreeToTerms: false,
          newsLetterAndOffersSubscription: false,
          phone: { prefix: 'Egypt_20' }
        }}
      >
        {contextHolder}
        <Form.Item
          name='fullName'
          rules={[{ validator: validateFullName }]}
        >
          <Input placeholder={t('fullNamePlaceholder')} />
        </Form.Item>
        <Form.Item
          name='email'
          rules={[
            { type: 'email' },
            {
              required: true,
              message: t('formValidationErrorMessages.emailRequired')
            }
          ]}
        >
          <Input placeholder={t('emailPlaceholder')} />
        </Form.Item>

        <Form.Item
          name='password'
          rules={[{ validator: validatePassword }]}
          hasFeedback
        >
          <Input.Password placeholder={t('passwordPlaceholder')} />
        </Form.Item>

        <Form.Item>
          <Space.Compact block>
            <Form.Item
              name={['phone', 'prefix']}
              noStyle
              rules={[
                { required: true, message: 'Select country code' }
              ]}
            >
              <Select
                style={{ width: '175px', height: 45 }}
                suffixIcon={<IoIosArrowDown size={18} />}
              >
                <Option value='Egypt_20'>
                  {locale === 'ar' ? '‫Egypt‬ 20+' : '+20 Egypt'}
                </Option>
              </Select>
            </Form.Item>

            <Form.Item
              name={['phone', 'number']}
              noStyle
              rules={[{ validator: validatePhone }]}
            >
              <Input
                // style={{ width: '100%' }}
                placeholder={t('phonePlaceholder')}
              />
            </Form.Item>
          </Space.Compact>
        </Form.Item>

        <Form.Item
          name='aggreeToTerms'
          aria-describedby='aggree-to-terms-of-use-and-privacy-policy'
          rules={[
            {
              validator: (_, value) =>
                value ?
                  Promise.resolve()
                : Promise.reject(
                    new Error(
                      t('formValidationErrorMessages.termsRequired')
                    )
                  )
            }
          ]}
          valuePropName='checked'
          style={{ marginBottom: 0 }}
        >
          <Checkbox>
            {t('aggreeToTermsLabel')}{' '}
            <Link href='/terms-of-use'>{t('termsOfUse')}</Link>{' '}
            {t('andLabel')}{' '}
            <Link href='/privacy-policy'>{t('privacyPolicy')}</Link>
          </Checkbox>
        </Form.Item>

        <Form.Item
          name='newsLetterAndOffersSubscription'
          aria-describedby='news-letter-and-offers-subscription'
          valuePropName='checked'
          style={{ marginBottom: 0 }}
        >
          <Checkbox>{t('newsLetterCheckboxLable')}</Checkbox>
        </Form.Item>
        <button
          type='submit'
          className='my-4 w-full rounded-lg bg-blue-sky-accent px-5 py-2.5 text-center text-sm font-medium text-white hover:bg-blue-sky-medium focus:outline-none focus:ring-4 focus:ring-blue-sky-medium'
        >
          {t('signupButton')}
        </button>
        <p className='text-sm font-light text-gray-500'>
          {t('signinLabel')}{' '}
          <Link
            href='/signin'
            className='font-medium text-blue-sky-accent hover:underline'
          >
            {t('signinLink')}
          </Link>
        </p>
      </Form>
    </ConfigProvider>
  );
}

export default SignupForm;
