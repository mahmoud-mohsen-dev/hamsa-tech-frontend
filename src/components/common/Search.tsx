'use client';
import { useMyContext } from '@/context/Store';
import { MeiliSearch } from 'meilisearch';
import React, { useEffect, useRef } from 'react';
import { LuSearch } from 'react-icons/lu';
import Btn from '../UI/Btn';
import { trimText } from '@/utils/helpers';
import { useTranslations } from 'next-intl';

const client = new MeiliSearch({
  host:
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ||
    'http://127.0.0.1:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY
});

const Search = () => {
  const { searchData, setSearchData, searchTerm, setSearchTerm } =
    useMyContext();
  const t = useTranslations('NavbarDrawer.searchModal');
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  const onSearchSubmit = async () => {
    if (!trimText(searchTerm)) {
      setSearchData(null);
      return;
    }

    // Abort the previous request if it exists
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create a new AbortController for the new request
    const controller = new AbortController();
    abortControllerRef.current = controller;
    try {
      const results = await client.multiSearch(
        {
          queries: [
            {
              indexUid: 'products',
              q: searchTerm,
              limit: 50
            }
            // {
            //   indexUid: 'blog',
            //   q: searchTerm,
            //   limit: 5
            // }
          ]
        },
        { signal: controller.signal }
      ); // Pass the AbortController signal

      console.log('results', results);
      if (results) {
        setSearchData(results);
      }
    } catch (error: any) {
      if (error.name === 'AbortError') {
        console.log('Request aborted');
      } else {
        console.error('Search error:', error);
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
      return;
    }

    const handler = setTimeout(() => {
      onSearchSubmit();
    }, 750); // Wait 750ms after typing stops

    return () => {
      clearTimeout(handler);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort(); // Abort the previous request
      }
    };
  }, [searchTerm]);

  return (
    <form
      className={`flex w-full grow items-center justify-between gap-3`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearchSubmit();
      }}
    >
      <div className={`flex w-full grow items-center gap-3`}>
        <LuSearch className='text-gray-medium' size={24} />
        <input
          type='search'
          placeholder={t('searchPlaceholder')}
          value={searchTerm ?? ''}
          onChange={handleInputChange}
          className='w-[calc(100%-120px)] bg-transparent p-2 px-2 font-sans tracking-wide outline-none placeholder:text-gray-normal focus-visible:text-black-medium'
        />
      </div>
      {searchData?.results && searchData?.results.length > 0 && (
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
