'user client';
import React, { useState } from 'react';
import { AutoComplete, Input } from 'antd';
import type { AutoCompleteProps } from 'antd';
import { v4 } from 'uuid';

const getRandomInt = (max: number, min = 0) =>
  Math.floor(Math.random() * (max - min + 1)) + min;

const searchResult = (query: string) =>
  new Array(getRandomInt(5))
    .join('.')
    .split('.')
    .map((_, idx) => {
      const category = `${query}${idx}`;
      return {
        value: category,
        label: (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between'
            }}
            key={v4()}
          >
            <span>
              Found {query} on{' '}
              <a
                href={`https://s.taobao.com/search?q=${query}`}
                target='_blank'
                rel='noopener noreferrer'
              >
                {category}
              </a>
            </span>
            <span>{getRandomInt(200, 100)} results</span>
          </div>
        )
      };
    });

const SearchInputField: React.FC = () => {
  const [options, setOptions] = useState<
    AutoCompleteProps['options']
  >([]);

  const handleSearch = (value: string) => {
    setOptions(value ? searchResult(value) : []);
  };

  const onSelect = (value: string) => {
    console.log('onSelect', value);
  };

  return (
    <AutoComplete
      popupMatchSelectWidth={250}
      style={{
        width: '100%',
        marginTop: 50,
        height: 36,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column'
      }}
      options={options}
      onSelect={onSelect}
      onSearch={handleSearch}
      // size='large'
    >
      <Input.Search
        // size='large'
        placeholder='Search'
        enterButton
        className='search-input-navbar transition-all duration-300'
      />
    </AutoComplete>
  );
};

export default SearchInputField;
