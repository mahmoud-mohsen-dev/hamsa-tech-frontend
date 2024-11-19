import React, { useEffect, useState } from 'react';
import { ConfigProvider, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useLocale, useTranslations } from 'next-intl';
import { useUser } from '@/context/UserContext';
import { getCookie } from '@/utils/cookieUtils';
import { fetchGraphqlClientAuthenticated } from '@/services/graphqlCrud';
import { getUserAvatarPhotoResponse } from '@/types/userResponseTypes';

const getAvatarUserQuery = (userID: string) => {
  return `query usersPermissionsUser {
    usersPermissionsUser(id: "${userID}") {
        data {
            attributes {
                avatar_photo {
                    data { 
                        id
                        attributes {
                            alternativeText
                            url
                            name
                        }
                    }
                }
            }
        }
    }
  }`;
};

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

const getBase64 = (file: FileType): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

const UploadImage: React.FC = () => {
  const locale = useLocale();
  const t = useTranslations(
    'AccountLayoutPage.SettingsPage.content.avatar'
  );
  const emptyFileList: UploadFile[] = [
    {
      uid: '1',
      name: t('noImage'),
      status: 'removed'
    }
  ];
  const { userId } = useUser();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    // {
    //   uid: '2',
    //   name: 'image.png',
    //   status: 'done',
    //   url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=htmlFormat&fit=crop&w=500&q=100'
    // }
    // ...emptyFileList
  ]);

  const getUserAvatarPhoto = async () => {
    try {
      const { data, error } = (await fetchGraphqlClientAuthenticated(
        getAvatarUserQuery(userId ?? '')
      )) as getUserAvatarPhotoResponse;

      if (
        error ||
        !data ||
        !data.usersPermissionsUser?.data?.attributes?.avatar_photo
          ?.data?.id ||
        !data?.usersPermissionsUser?.data?.attributes?.avatar_photo
          ?.data?.attributes
      ) {
        console.error(error);
        // setFileList([]);
        return [];
      }

      const profilePhoto: {
        uid: string;
        name: string;
        status: 'done';
        url: string;
      } = {
        uid: data.usersPermissionsUser.data.attributes.avatar_photo
          .data.id,
        name:
          data.usersPermissionsUser.data.attributes.avatar_photo.data
            .attributes?.name ||
          data.usersPermissionsUser.data.attributes.avatar_photo.data
            .attributes?.alternativeText ||
          '',
        status: 'done',
        url:
          data.usersPermissionsUser.data.attributes?.avatar_photo.data
            ?.attributes?.url ?? ''
      };

      // console.log(profilePhoto);
      // setFileList(profilePhoto);
      return [profilePhoto];
    } catch (err) {
      console.error('Error getting user avatar photo:', err);
      // setFileList([]);
      return [];
    }
  };

  useEffect(() => {
    // const result = getUserAvatarPhoto();
    // console.log(result);
    // if (result) {
    //   // setFileList(result);
    // }
    getUserAvatarPhoto().then((result) => {
      // console.log(result);
      setFileList(result);
    });
  }, []);

  // Define the upload function
  const customRequest = async ({ file, onSuccess, onError }: any) => {
    const newFileData = {
      alternativeText: t('altText', {
        userId: userId || ''
      })
    };

    const formData = new FormData();
    formData.append('path', 'avatar-of-users');
    formData.append('fileInfo', JSON.stringify(newFileData));

    formData.append('files', file);
    formData.append('ref', 'plugin::users-permissions.user');
    formData.append('refId', userId ?? '');
    formData.append('field', 'avatar_photo');

    const token = getCookie('token');

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`
          },
          body: formData
        }
      );
      const data = await response.json();

      if (!data) {
        throw new Error('API request failed');
      }

      // console.log(data);
      onSuccess(data); // Pass the response data to the component
    } catch (error) {
      console.error(error);
      onError(error); // Trigger error in the component
    }
  };

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
    // console.log(info.fileList);
    let newFileList = [...info.fileList];

    // 1. Limit the number of uploaded files
    // Only to show two recent uploaded files, and old ones will be replaced by the new
    newFileList = newFileList.slice(-2);

    // 2. Read from response and show file link
    newFileList = newFileList.map((file) => {
      if (file.response) {
        // Component will show file.url as link
        file.url = file.response.url;
      }
      return file;
    });

    setFileList(newFileList);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#1677ff',
          colorBorder: fileList.length === 0 ? '#d9d9d9' : '#1677ff',
          lineWidth: 2
        }
      }}
    >
      <div className='flex flex-col items-center space-y-5 sm:flex-row sm:space-y-0'>
        {/* Image */}
        <div className='upload-avatar-image'>
          <Upload
            customRequest={customRequest}
            // action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`}
            listType='picture-circle'
            fileList={
              fileList.length === 0 ? emptyFileList : fileList
            }
            onPreview={handlePreview}
            onChange={handleChange}
            maxCount={1}
            multiple={false}
            showUploadList={
              fileList.length === 0 ?
                {
                  showRemoveIcon: false,
                  removeIcon: false,
                  showPreviewIcon: false
                }
              : true
            }
          />
        </div>

        <div
          className={`flex flex-col space-y-5 ${locale === 'ar' ? 'mr-8' : 'ml-8'}`}
        >
          {/* Upload Button */}
          <ImgCrop rotationSlider>
            <Upload
              customRequest={customRequest}
              // action={`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/upload`}
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}
              multiple={false}
              maxCount={1}
            >
              {fileList.length >= 2 ? null : (
                <button
                  type='button'
                  className='rounded-lg border border-indigo-200 bg-[#202142] px-7 py-3.5 text-base font-medium text-indigo-100 hover:bg-indigo-900 focus:z-10 focus:outline-none focus:ring-4 focus:ring-indigo-200'
                >
                  {t('changePicture')}
                </button>
              )}
            </Upload>
          </ImgCrop>
        </div>
      </div>

      {/* Pop Up Image */}
      {previewImage && (
        <Image
          wrapperStyle={{ display: 'none' }}
          style={{ objectFit: 'cover' }}
          preview={{
            visible: previewOpen,
            onVisibleChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) =>
              !visible && setPreviewImage('')
          }}
          src={previewImage}
        />
      )}
    </ConfigProvider>
  );
};

export default UploadImage;
