import { useMyContext } from '@/context/Store';
import { message } from 'antd';
import { useTranslations } from 'next-intl';
import { useEffect } from 'react';

function useHandleMessagePopup() {
  const {
    loadingMessage,
    errorMessage,
    successMessage,
    setLoadingMessage,
    setErrorMessage,
    setSuccessMessage
  } = useMyContext();
  const t = useTranslations('CheckoutPage.content');
  const [messageApi, contextHolder] = message.useMessage();

  // Effect to handle loading message
  useEffect(() => {
    if (loadingMessage) {
      messageApi.open({
        type: 'loading',
        content: t('form.loading')
      });
      window.scrollTo(0, 0);
    } else {
      messageApi.destroy();
      setLoadingMessage(false);
      setErrorMessage('');
      setSuccessMessage('');
    }
  }, [loadingMessage]);

  // Effect to handle error message
  useEffect(() => {
    if (errorMessage) {
      message.error(errorMessage);
      setErrorMessage('');
    }
  }, [errorMessage]);

  // Effect to handle success message
  useEffect(() => {
    if (successMessage) {
      messageApi.success(successMessage);
      setSuccessMessage('');
    }
  }, [successMessage]);
  return { contextHolder, loadingMessage };
}

export default useHandleMessagePopup;
