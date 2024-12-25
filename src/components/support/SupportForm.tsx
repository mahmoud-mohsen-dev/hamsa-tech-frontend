'use client';
import React, { useEffect, useState } from 'react';
import { Button, ConfigProvider, Form, Input } from 'antd';
import { useLocale, useTranslations } from 'next-intl';
import { capitalize } from '@/utils/helpers';
import { fetchGraphqlClient } from '@/services/graphqlCrud';
import { CreateSupportResponseType } from '@/types/supportResponseTypes';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { useMyContext } from '@/context/Store';

type CreateSupportQueryPropsType = {
  fullName: string;
  email: string;
  message: string;
};

type FormType = {
  fullName: string;
  email: string;
  message: string;
};

const createSupportQuery = ({
  fullName,
  email,
  message
}: CreateSupportQueryPropsType) => {
  return `
  mutation CreateSupport {
    createSupport(
        data: { full_name: "${capitalize(fullName)}", email: "${email}", message: "${message}", publishedAt: "${new Date().toISOString()}" }
    ) {
        data {
            id
        }
    }
  }`;
};

function SupportForm() {
  const locale = useLocale();
  const t = useTranslations('SupportPage.content');
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm<FormType>();
  const { setLoadingMessage, setErrorMessage, setSuccessMessage } =
    useMyContext();

  // Effect to handle loading message
  useEffect(() => {
    if (loading) {
      setLoadingMessage(true);
    } else {
      setTimeout(() => {
        setLoadingMessage(false);
      }, 2500);
    }
  }, [loading]);

  const onFinish = async (formValues: FormType) => {
    setLoading(true);
    try {
      const { data, error } = (await fetchGraphqlClient(
        createSupportQuery({ ...formValues })
      )) as CreateSupportResponseType;

      if (error || !data?.createSupport?.data?.id) {
        throw new Error('Failed to submit form');
      }

      setSuccessMessage(t('form.submission.successMessage'));
      form.resetFields();
    } catch (error) {
      setErrorMessage(t('form.submission.errorMessage'));
    } finally {
      setLoading(false);
    }
  };

  const onFinishFailed = (errorInfo: ValidateErrorEntity<any>) => {
    setErrorMessage(
      errorInfo?.errorFields[0]?.errors[0] ??
        t('form.submission.errorMessage')
    );
    console.log('Form submission failed:', errorInfo);
  };

  // Custom function to render the label with reversed asterisk
  const renderReversedLabel = (label: string) => (
    <span>
      {label} <span style={{ color: 'red' }}>*</span>
    </span>
  );

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          borderRadius: 4,
          paddingContentHorizontal: 30,
          fontFamily: 'var(--inter)',
          fontSize: locale === 'ar' ? 15 : 14
        },
        components: {
          Input: {
            paddingBlock: 10,
            paddingInline: 15,
            colorTextPlaceholder: '#afafaf'
          },
          Button: {
            paddingBlock: 18
          }
        }
      }}
    >
      {/* {contextHolder} */}
      <Form
        name='support-form'
        layout='vertical'
        form={form}
        onFinish={onFinish}
        onFinishFailed={onFinishFailed}
        style={{ marginTop: '20px' }}
        requiredMark={false}
      >
        <Form.Item
          label={renderReversedLabel(t('form.fields.name.label'))}
          name='fullName'
          rules={[
            {
              required: true,
              message: t('form.fields.name.requiredMessage')
            }
          ]}
        >
          <Input placeholder={t('form.fields.name.placeholder')} />
        </Form.Item>

        <Form.Item
          label={renderReversedLabel(t('form.fields.email.label'))}
          name='email'
          rules={[
            {
              required: true,
              type: 'email',
              message: t('form.fields.email.requiredMessage')
            }
          ]}
        >
          <Input placeholder={t('form.fields.email.placeholder')} />
        </Form.Item>

        <Form.Item
          label={renderReversedLabel(t('form.fields.message.label'))}
          name='message'
          rules={[
            {
              required: true,
              message: t('form.fields.message.requiredMessage')
            }
          ]}
        >
          <Input.TextArea
            rows={4}
            placeholder={t('form.fields.message.placeholder')}
          />
        </Form.Item>

        <Form.Item style={{ margin: 0 }}>
          <Button type='primary' htmlType='submit' loading={loading}>
            {t('form.submission.submitButton')}
          </Button>
        </Form.Item>
      </Form>
    </ConfigProvider>
  );
}

export default SupportForm;
