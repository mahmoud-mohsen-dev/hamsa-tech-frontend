'use client';

import { useUser } from '@/context/UserContext';
import { Link } from '@/navigation';
import PostAComment from './PostOrEditAComment';
import { useTranslations } from 'next-intl';
import { useBlog } from '@/context/BlogContext';
import { useEffect, useState } from 'react';
import { Skeleton, Space } from 'antd';

function CreateACommentOrPromptToSignin({
  blogIds
}: {
  blogIds: { arId: string | null; enId: string | null };
}) {
  const { userId } = useUser();
  const { setBlogIds } = useBlog();
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    if (blogIds?.arId || blogIds?.enId) {
      setBlogIds(blogIds);
      setIsloading(false);
    }
  }, []);

  const t = useTranslations('ProductPage.reviewsTabSection');

  return (
    isLoading ?
      <div style={{ width: '100%', marginBottom: '32px' }}>
        <Skeleton.Node
          active={true}
          // style={{ width: '100%', height: '96px', display: 'block' }}
          style={{ width: '100%', height: '200px' }}
          className='!w-full'
        />
      </div>
    : userId ? <PostAComment blogIds={blogIds} />
    : <div className='flex flex-wrap items-center gap-2.5 p-6 font-openSans text-lg font-bold text-black-medium'>
        <h3>{t('singinIsRequired')}</h3>
        <Link
          href='/signin'
          className='text-red-shade-350 hover:text-blue-sky-medium hover:underline'
        >
          {t('signinText')}
        </Link>
      </div>
  );
}

export default CreateACommentOrPromptToSignin;
