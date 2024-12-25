'use client';
import { useMyContext } from '@/context/Store';
import { MeiliSearch } from 'meilisearch';
import React, { useEffect, useRef } from 'react';
import { LuSearch } from 'react-icons/lu';
import Btn from '../UI/Btn';
import { trimText } from '@/utils/helpers';
import { useTranslations } from 'next-intl';
import { Spin } from 'antd';
import { AiOutlineLoading } from 'react-icons/ai';

const client = new MeiliSearch({
  host:
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ||
    'http://127.0.0.1:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY
});

const Search = () => {
  const {
    setSearchData,
    searchTerm,
    setSearchTerm,
    isSearchbarLoading,
    setIsSearchbarLoading
  } = useMyContext();
  const t = useTranslations('NavbarDrawer.searchModal');
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input

  const onSearchSubmit = async () => {
    if (!trimText(searchTerm)) {
      setSearchData(null);
      return;
    }

    // setIsSearchbarLoading(true);
    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Set loading to true for a new request
    setIsSearchbarLoading(true);

    // Create a new AbortController for the new request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      // setIsSearchbarLoading(true);
      const results = await client.multiSearch(
        {
          queries: [
            {
              indexUid: 'products',
              q: searchTerm,
              limit: 50
            },
            {
              indexUid: 'blog',
              q: searchTerm,
              limit: 5
            }
          ]
        },
        { signal: controller.signal }
      ); // Pass the AbortController signal

      console.log('results', results);
      if (results) {
        setSearchData(results);
        // setIsSearchbarLoading(false);
        return;
      }

      setSearchData(null);
      // setIsSearchbarLoading(false);
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        // setIsSearchbarLoading(false);
        console.error('Search error:', error);
      }
    } finally {
      // Only reset loading if the request is not aborted
      if (controller.signal.aborted === false) {
        setIsSearchbarLoading(false);
      }
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const value = e.target.value;
    setSearchTerm(value);
  };

  const handleRemove = () => {
    setSearchTerm(null);
    setSearchData(null);
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
  };

  // Debounce logic with useEffect
  useEffect(() => {
    if (!searchTerm) {
      setSearchData(null);
      setIsSearchbarLoading(false); // Stop loading when search term is cleared
      return;
    }
    // const handler = setTimeout(() => {
    onSearchSubmit();
    // }, 50); // Wait 750ms after typing stops

    return () => {
      // clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Abort the previous request
      }
    };
  }, [searchTerm]);

  useEffect(() => {
    // Auto-focus the input field on mount
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <form
      className={`flex w-full grow items-center justify-between gap-3`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearchSubmit();
      }}
    >
      <div className={`flex w-full grow items-center gap-3`}>
        {isSearchbarLoading ?
          <Spin
            // indicator={<LoadingOutlined spin />}
            indicator={
              <AiOutlineLoading
                className='animate-spin'
                style={{ fontSize: '24px' }}
              />
            }
            size='default'
            style={{
              color: '#9b9b9b'
            }}
            //     hover ? '#1773b0 '
            //     : isLiked ? '#65b531 '
            //     : '#6b7280 ',
            //   marginRight: locale == 'ar' ? '0px' : '0.375rem',
            //   marginLeft: locale === 'ar' ? '0.375rem' : '0px'
            // }}
          />
        : <LuSearch className='text-gray-medium' size={24} />}
        <input
          type='search'
          placeholder={t('searchPlaceholder')}
          value={searchTerm ?? ''}
          onChange={handleInputChange}
          className='w-[calc(100%-120px)] bg-transparent p-2 px-2 font-sans tracking-wide outline-none placeholder:text-gray-normal focus-visible:text-black-medium'
          ref={inputRef}
        />
      </div>
      {searchTerm && searchTerm.length > 0 && (
        <Btn
          className='mx-9 !px-0 font-inter text-base font-medium text-blue-sky-medium !shadow-none'
          onClick={handleRemove}
        >
          {t('clearText')}
        </Btn>
      )}
    </form>
  );
};

export default Search;
