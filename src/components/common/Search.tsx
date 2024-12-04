'use client';
import { useMyContext } from '@/context/Store';
import { InputProps } from 'antd';
import { MeiliSearch } from 'meilisearch';
import React from 'react';
import { LuSearch } from 'react-icons/lu';

const client = new MeiliSearch({
  host:
    process.env.NEXT_PUBLIC_MEILISEARCH_HOST ||
    'http://127.0.0.1:7700',
  apiKey: process.env.NEXT_PUBLIC_MEILISEARCH_KEY
});

export type SearchProps = React.InputHTMLAttributes<HTMLInputElement>;

const Search = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    const { setSearchData } = useMyContext();
    const [searchTerm, setSearchTerm] = React.useState('');

    const onSearchSubmit = async (e: any) => {
      e.preventDefault();
      const results = await client.multiSearch({
        queries: [
          {
            indexUid: 'product',
            q: searchTerm,
            limit: 10
          },
          {
            indexUid: 'blog',
            q: searchTerm,
            limit: 5
          }
        ]
      });

      console.log('results', results);
      if (results) {
        setSearchData(results);
      }
      // TODO: Render results
    };

    return (
      <form
        className={`flex w-full grow items-center gap-3 ${className ?? ''}`}
        onSubmit={onSearchSubmit}
      >
        <LuSearch className='text-gray-medium' size={24} />
        <input
          // {...props}
          type='search'
          placeholder='Search...'
          ref={ref}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='w-[calc(100%-70px)] bg-transparent p-2 px-2 outline-none placeholder:text-gray-medium focus-visible:text-black-medium'
        />
      </form>
    );
  }
);

export default Search;
