'use client';

import React, { useState } from 'react';
import { Checkbox, Rate, Slider } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { v4 } from 'uuid';
import Btn from '../../Btn';
import { GrPowerReset } from 'react-icons/gr';
import { FaCheck } from 'react-icons/fa6';

const CheckboxGroup = Checkbox.Group;

const plainBrandOptions = [
  'Hikvision',
  'Ezviz',
  'Cyber',
  'Hilook',
  'Commax',
  'Farfisa',
  'Master'
];

const defaultBrandCheckedList = [...plainBrandOptions];

const plainRateOptions = [5, 4, 3, 2, 1].map((rate) => ({
  label: <Rate disabled key={v4()} defaultValue={rate} />,
  value: rate
}));

const defaultRateCheckedList = [5, 4, 3, 2, 1];

function BrandFilter() {
  const [brandCheckedList, setCheckedList] = useState(
    defaultBrandCheckedList
  );
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [rateCheckedList, setRateCheckedList] = useState(
    defaultRateCheckedList
  );

  const checkAllBrands =
    plainBrandOptions.length === brandCheckedList.length;
  const onBrandChange = (list: string[]) => {
    setCheckedList(list);
  };
  const onBrandCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? plainBrandOptions : []);
  };

  const checkAllRates =
    plainRateOptions.length === rateCheckedList.length;
  const onRateChange = (list: number[]) => {
    setRateCheckedList(list);
  };
  const onRateCheckAllChange = (e: CheckboxChangeEvent) => {
    setRateCheckedList(
      e.target.checked ? defaultRateCheckedList : []
    );
  };

  const onSliderChange = (newValue: number[]) => {
    if (
      newValue &&
      typeof newValue[0] === 'number' &&
      typeof newValue[1] === 'number'
    ) {
      setSliderValues(newValue);
    }
  };

  return (
    <div className='brands-filter mt-5'>
      <h3 className='ml-[24px] w-fit text-lg text-black-medium'>
        Brands
      </h3>

      <Checkbox
        onChange={onBrandCheckAllChange}
        checked={checkAllBrands}
        className='check-all'
      >
        {checkAllBrands ? 'Uncheck' : 'Check'} all
      </Checkbox>
      <CheckboxGroup
        options={plainBrandOptions}
        value={brandCheckedList}
        onChange={onBrandChange}
      />

      {/* Price Slider */}
      <h3 className='ml-[24px] mt-5 w-fit text-lg text-black-medium'>
        Price
      </h3>
      <Slider
        tooltip={{ open: false }}
        range
        defaultValue={sliderValues ?? [0, 100]}
        value={sliderValues ?? [0, 100]}
        onChange={onSliderChange}
        disabled={false}
        style={{ marginInline: '24px' }}
      />
      <p className='ml-6 text-sm text-black-light'>
        Price: (EGP){sliderValues[0]} - (EGP){sliderValues[1]}
      </p>

      {/* Rate CheckBox Group */}
      <h3 className='ml-[24px] mt-5 w-fit text-lg text-black-medium'>
        Rate
      </h3>
      <Checkbox
        onChange={onRateCheckAllChange}
        checked={checkAllRates}
        className='check-all'
        style={{ marginBottom: '3px' }}
      >
        {checkAllRates ? 'Uncheck' : 'Check'} all
      </Checkbox>
      <CheckboxGroup
        options={plainRateOptions}
        value={rateCheckedList}
        onChange={onRateChange}
        style={{ gap: '5px' }}
      />
      <div className='mt-6 flex items-center gap-2'>
        <Btn className='bg-green-600 px-6 py-[5px] text-base font-normal text-white'>
          <FaCheck />
          <span>Apply</span>
        </Btn>
        <Btn className='bg-red-shade-300 px-5 py-[5px] text-base font-normal text-white'>
          <GrPowerReset />
          <span>Reset</span>
        </Btn>
      </div>
    </div>
  );
}

export default BrandFilter;
