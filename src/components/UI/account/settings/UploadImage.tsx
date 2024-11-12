import React, { useState } from 'react';
// import { PlusOutlined } from '@ant-design/icons';
import { ConfigProvider, Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';
import ImgCrop from 'antd-img-crop';
import { useLocale } from 'next-intl';

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
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '2',
      name: 'image.png',
      status: 'done',
      url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTB8fGZhY2V8ZW58MHx8MHx8fDA%3D&auto=htmlFormat&fit=crop&w=500&q=100'
    }
    // {
    //   uid: '-xxx',
    //   percent: 50,
    //   name: 'image.png',
    //   status: 'uploading',
    //   url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png'
    // },
  ]);
  const emptyFileList: UploadFile[] = [
    {
      uid: '1',
      name: 'No Image',
      status: 'removed'
    }
  ];

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = (info) => {
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
            action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
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
            //   style={{ objectFit: 'cover' }}
          />
        </div>

        <div
          className={`flex flex-col space-y-5 ${locale === 'ar' ? 'mr-8' : 'ml-8'}`}
        >
          {/* Upload Button */}
          <ImgCrop rotationSlider>
            <Upload
              action='https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload'
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
                  Change picture
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
          //   sizes=''=
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
