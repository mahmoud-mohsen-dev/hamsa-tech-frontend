'use client';

import React, { useState } from 'react';
import { Checkbox, Rate, Slider } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { v4 } from 'uuid';
import Btn from '../../Btn';
import { GrPowerReset } from 'react-icons/gr';
import { FaCheck } from 'react-icons/fa6';
import { BrandData } from '@/types/getBrandsFilter';
import { capitalize } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';

const CheckboxGroup = Checkbox.Group;

// const plainBrandOptions = [
//   'Hikvision',
//   'Ezviz',
//   'Cyber',
//   'Hilook',
//   'Commax',
//   'Farfisa',
//   'Master'
// ];

// const defaultBrandCheckedList = [...plainBrandOptions];

const plainRateOptions = [5, 4, 3, 2, 1].map((rate) => ({
  label: <Rate disabled key={v4()} defaultValue={rate} />,
  value: rate
}));

const defaultRateCheckedList = [5, 4, 3, 2, 1];

interface PropsType {
  data: BrandData[];
}

function BrandFilter({ data }: PropsType) {
  const locale = useLocale();
  const t = useTranslations('ProductsPage.filtersSidebar');
  // console.log(data);
  const brandsList = data.map((brand) =>
    locale === 'ar' ?
      brand?.attributes?.name
    : capitalize(brand?.attributes?.name)
  );
  // console.log(brandsList);

  const [brandCheckedList, setCheckedList] = useState(brandsList);
  const [sliderValues, setSliderValues] = useState([0, 100]);
  const [rateCheckedList, setRateCheckedList] = useState(
    defaultRateCheckedList
  );
  // console.log(brandCheckedList);

  const checkAllBrands =
    brandsList.length === brandCheckedList.length;
  const onBrandChange = (list: string[]) => {
    setCheckedList(list);
  };
  const onBrandCheckAllChange = (e: CheckboxChangeEvent) => {
    setCheckedList(e.target.checked ? brandsList : []);
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
        {t('brandTitle')}
      </h3>

      <Checkbox
        onChange={onBrandCheckAllChange}
        checked={checkAllBrands}
        className='check-all'
      >
        {checkAllBrands ? t('uncheckAll') : t('checkAll')}
      </Checkbox>
      <CheckboxGroup
        options={brandsList}
        value={brandCheckedList}
        onChange={onBrandChange}
      />

      {/* Price Slider */}
      <h3 className='ml-[24px] mt-5 w-fit text-lg text-black-medium'>
        {t('priceRangeTitle')}
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
        <span>{t('priceSubTitle')}: </span>
        <span dir='ltr'>
          EGP ({sliderValues[0]}) - EGP ({sliderValues[1]})
        </span>
        {/* <span></span> */}
      </p>

      {/* Rate CheckBox Group */}
      <h3 className='ml-[24px] mt-5 w-fit text-lg text-black-medium'>
        {t('rateTitle')}
      </h3>
      <Checkbox
        onChange={onRateCheckAllChange}
        checked={checkAllRates}
        className='check-all'
        style={{ marginBottom: '3px' }}
      >
        {checkAllRates ? t('uncheckAll') : t('checkAll')}
      </Checkbox>
      <CheckboxGroup
        options={plainRateOptions}
        value={rateCheckedList}
        onChange={onRateChange}
        style={{ gap: '5px' }}
      />
      <div
        className={`${locale === 'ar' ? '' : 'ml-[24px]'} mt-5 flex items-center gap-2`}
      >
        <Btn
          className='bg-green-600 px-4 py-[6px] text-base font-normal text-white'
          defaultPadding={false}
        >
          <FaCheck />
          <span>{t('applyButton')}</span>
        </Btn>
        <Btn
          className='bg-red-shade-300 px-4 py-[6px] text-base font-normal text-white'
          defaultPadding={false}
        >
          <GrPowerReset />
          <span>{t('resetButton')}</span>
        </Btn>
      </div>
    </div>
  );
}

export default BrandFilter;
