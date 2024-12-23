'use client';

import { revalidateBlogLayoutPage } from '@/app/actions';
import { useBlog } from '@/context/BlogContext';
import { useMyContext } from '@/context/Store';
import { useUser } from '@/context/UserContext';
import {
  deleteBlogComment,
  editReportsBlogComment
} from '@/services/handleBlogComments';
import {
  ConfigProvider,
  Form,
  Modal,
  Popconfirm,
  Radio,
  Skeleton
} from 'antd';
import { useForm } from 'antd/es/form/Form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import type { PopconfirmProps } from 'antd';
import { useIsMount } from '@/hooks/useIsMount';

function DropdownCommentButton({
  commentUserId,
  commentId,
  repliesIds
}: {
  commentUserId: string | null;
  commentId: string | null;
  repliesIds: string[] | null;
}) {
  const [isComponentIsLoading, setComponentIsLoading] =
    useState(true);
  const { setErrorMessage, setSuccessMessage } = useMyContext();

  const {
    blogIds,
    dropdownModalId,
    setDropdownModalId,
    setCommentIdOnEditMode,
    reportModalIdOpened,
    setReportModalIdOpened
  } = useBlog();
  const { userId } = useUser();
  const isSignedIn = userId ? true : false;
  const p = useTranslations('ProductPage.reviewsTabSection');
  const t = useTranslations('BlogPage.child.content');
  const [form] = useForm();
  const [deleteButtonIsLoading, setDeleteButtonIsLoading] =
    useState(false);
  const [reportAbuseButtonIsLoading, setReportAbuseButtonIsLoading] =
    useState(false);
  const { didMount } = useIsMount();

  const isAuthor =
    isSignedIn && commentUserId && `${userId}` === `${commentUserId}`;

  const isDropdownModalOpen =
    commentId !== null &&
    dropdownModalId !== null &&
    dropdownModalId === commentId;

  const isReportModalOpen =
    (
      commentId &&
      reportModalIdOpened &&
      reportModalIdOpened === commentId
    ) ?
      true
    : false;

  const toggleDropdown = () => {
    if (commentId) {
      setDropdownModalId((prevState) => {
        if (prevState === commentId) {
          return null;
        }

        return commentId;
      });
    }
  };

  const closeDropdown = () => {
    setDropdownModalId(null);
  };

  const showEditForm = () => {
    setCommentIdOnEditMode(commentId ?? null);
    closeDropdown();
  };

  const confirmDelete: PopconfirmProps['onConfirm'] = async () => {
    try {
      setDeleteButtonIsLoading(true);
      console.error('triggered confirm delete', commentId);
      const commentRemovedId = await deleteBlogComment({
        commentId,
        repliesIds
      });
      if (!commentRemovedId) {
        setErrorMessage(t('responses.errorMessages.deleteComment'));
        return;
      }

      setSuccessMessage(t('responses.successMessages.deleteComment'));

      revalidateBlogLayoutPage({ blogIds });
    } catch (error) {
      console.error(
        `Failed to delete comment ID: ${commentId} -`,
        error
      );
      setErrorMessage(t('responses.errorMessages.deleteComment'));
    } finally {
      setDeleteButtonIsLoading(false);
      closeDropdown();
    }
  };

  const showReportModal = () => {
    setReportModalIdOpened(commentId);
    closeDropdown();
  };

  const closeReportModal = () => {
    setReportModalIdOpened(null);
  };

  const handleReportModalOk = async () => {
    try {
      const values: {
        'radio-group':
          | undefined
          | 'off-topic'
          | 'inappropriate'
          | 'fake'
          | 'other';
      } = await form.validateFields();

      setReportAbuseButtonIsLoading(true);

      const updateCommentId = await editReportsBlogComment({
        commentId,
        issueType: values['radio-group'] ?? 'other'
      });

      if (!updateCommentId) {
        setErrorMessage(t('responses.errorMessages.report'));
        console.error(
          'Failed to report the comment',
          updateCommentId
        );
        return;
      }

      setSuccessMessage(t('responses.successMessages.report'));
      form.resetFields();
      revalidateBlogLayoutPage({ blogIds });
      closeReportModal();
    } catch (error) {
      console.error('error while submitting a report abuse:', error);
      setErrorMessage(t('responses.errorMessages.report'));
    } finally {
      setTimeout(() => {
        setReportAbuseButtonIsLoading(false);
      }, 1100);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        dropdownModalId &&
        !target.closest(`#dropdown-${dropdownModalId}`)
      ) {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () =>
      document.removeEventListener('mousedown', handleClickOutside);
  }, [dropdownModalId]);

  useEffect(() => {
    if (didMount) {
      setComponentIsLoading(false);
    }
    return () => setComponentIsLoading(true);
  }, []);

  // console.log('isDropdownModalOpen', isDropdownModalOpen);

  return (
    <>
      {isComponentIsLoading ?
        <Skeleton.Button
          active={true}
          size={'small'}
          shape={'square'}
        />
      : isSignedIn && (
          <div className='relative'>
            <button
              className='inline-flex items-center rounded-lg bg-white p-2 text-center text-sm font-medium text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-50'
              type='button'
              onMouseDown={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
              onTouchStart={(e) => {
                e.preventDefault();
                toggleDropdown();
              }}
            >
              <svg
                className='h-4 w-4'
                aria-hidden='true'
                xmlns='http://www.w3.org/2000/svg'
                fill='currentColor'
                viewBox='0 0 16 3'
              >
                <path d='M2 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Zm6.041 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM14 0a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3Z' />
              </svg>
              <span className='sr-only'>
                {t('dropdown.commentSettings')}
              </span>
            </button>
            <div
              className={`z-10 ${isDropdownModalOpen ? 'absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[calc(100%+20px)]' : 'hidden'} w-36 divide-y divide-gray-100 rounded bg-white shadow`}
              id={`dropdown-${commentId}`}
              tabIndex={0}
              onBlur={(e) => {
                if (!e.currentTarget.contains(e.relatedTarget)) {
                  closeDropdown();
                }
              }}
            >
              <ul
                className='py-1 text-sm text-gray-700'
                aria-labelledby='dropdownMenuIconHorizontalButton'
              >
                {isAuthor && (
                  <>
                    <li>
                      <button
                        className='block w-full px-4 py-2 text-start hover:bg-gray-100'
                        onClick={showEditForm}
                      >
                        {t('dropdown.edit')}
                      </button>
                    </li>
                    <li>
                      <Popconfirm
                        title={t('modals.deleteConfirm.title')}
                        description={t(
                          'modals.deleteConfirm.description'
                        )}
                        okButtonProps={{
                          loading: deleteButtonIsLoading
                        }}
                        onConfirm={confirmDelete}
                        okText={t('modals.deleteConfirm.okText')}
                        cancelText={t(
                          'modals.deleteConfirm.cancelText'
                        )}
                      >
                        <button className='block w-full px-4 py-2 text-start hover:bg-gray-100'>
                          {t('dropdown.remove')}
                        </button>
                      </Popconfirm>
                    </li>
                  </>
                )}
                <li>
                  <button
                    className='block w-full px-4 py-2 text-start hover:bg-gray-100'
                    onClick={showReportModal}
                  >
                    {t('dropdown.report')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        )
      }

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
            }
          }
        }}
      >
        {/* Report Modal */}
        <Modal
          title={
            <h2 className='text-base font-bold text-blue-gray-light'>
              {t('modals.reportComment.title')}
            </h2>
          }
          okText={p('reportReview.submitButton')}
          cancelText={p('reportReview.cancelButton')}
          open={isReportModalOpen}
          onOk={handleReportModalOk}
          onCancel={closeReportModal}
          loading={reportAbuseButtonIsLoading}
          classNames={{
            content: '!min-h-fit',
            wrapper: '!top-[calc(50%-350px)]'
          }}
        >
          <h3 className='mt-3 text-sm font-semibold'>
            {t('modals.reportComment.question')}
          </h3>
          <Form layout='vertical' form={form}>
            <Form.Item
              name='radio-group'
              style={{ marginLeft: '10px' }}
              rules={[
                {
                  required: true,
                  message: t('modals.reportComment.formValidation')
                }
              ]}
            >
              <Radio.Group>
                <Radio
                  value='off_topic'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {p('reportReview.offTopic.label')}
                    </span>
                    <span className='text-gray-500'>
                      {t(
                        'modals.reportComment.options.offTopic.description'
                      )}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='inappropriate'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {p('reportReview.inappropriate.label')}
                    </span>
                    <span className='text-gray-500'>
                      {p('reportReview.inappropriate.description')}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='fake'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {p('reportReview.fake.label')}
                    </span>
                    <span className='text-gray-500'>
                      {p('reportReview.fake.description')}
                    </span>
                  </span>
                </Radio>

                <Radio
                  value='other'
                  style={{ marginBlock: '10px', width: '100%' }}
                >
                  <span className='gap-.5 ml-2 flex flex-col'>
                    <span className='text-sm font-medium text-black-light'>
                      {p('reportReview.other.label')}
                    </span>
                    <span className='text-gray-500'>
                      {p('reportReview.other.description')}
                    </span>
                  </span>
                </Radio>
              </Radio.Group>
            </Form.Item>
          </Form>

          <h4 className='text-sm font-medium'>
            {t('modals.reportComment.submitMessage')}
          </h4>
        </Modal>
      </ConfigProvider>
    </>
  );
}

export default DropdownCommentButton;
