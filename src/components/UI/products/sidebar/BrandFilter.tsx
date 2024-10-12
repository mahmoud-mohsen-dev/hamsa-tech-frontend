'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Checkbox, ConfigProvider, Rate, Slider, Spin } from 'antd';
import { CheckboxChangeEvent } from 'antd/es/checkbox';
import { v4 } from 'uuid';
import Btn from '../../Btn';
import { GrPowerReset } from 'react-icons/gr';
import { FaCheck } from 'react-icons/fa6';
import { BrandData } from '@/types/getBrandsFilter';
import { capitalize } from '@/utils/helpers';
import { useLocale, useTranslations } from 'next-intl';
import { usePathname, useRouter } from '@/navigation';
import { useParams, useSearchParams } from 'next/navigation';
import { useMyContext } from '@/context/Store';
import { fetchProducts } from '@/services/products';
import { useIsMount } from '@/hooks/useIsMount';
import { clear } from 'console';

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

const plainRateOptions = [5, 4, 3, 2, 1, 0].map((rate) => ({
  label: <Rate disabled key={v4()} defaultValue={rate} />,
  value: rate
}));

const defaultRateCheckedList = [5, 4, 3, 2, 1, 0];

interface PropsType {
  data: BrandData[];
}

function BrandFilter({ data }: PropsType) {
  const {
    // setCompleteProductsApiData,
    // setProductsData,
    globaLoading
    // setGlobalLoading
  } = useMyContext();

  const searchParams = useSearchParams();
  const params = new URLSearchParams(searchParams.toString());
  const router = useRouter();
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations('ProductsPage.filtersSidebar');
  const { didMount } = useIsMount();

  const category = params.get('category') ?? ''; // Get the "category" parameter from the URL
  const subCategory = params.get('sub-category') ?? ''; // Get the "sub-category" parameter from the URL
  // const paramsSortBy = params.get('sort-by'); // Get the "sort-by" parameter from the URL
  // const paramsPageSize = params.get('page-size'); // Get the "page-size" parameter from the URL
  // const page = params.get('page'); // Get the "page" parameter from the

  const brandParams = params.get('brands');
  const priceMinParams = params.get('price-min');
  const priceMaxParams = params.get('price-max');
  const ratesParams = params.get('rates');

  const initialBrandsList = data.map((brand) =>
    locale === 'ar' ?
      brand?.attributes?.name
    : capitalize(brand?.attributes?.name)
  );
  let paramsCheckedList: string[] = [];
  // brandParams &&
  if (
    typeof brandParams === 'string' &&
    brandParams.split(',').length > 0
  ) {
    paramsCheckedList = brandParams
      .split(',')
      .map((paramsCheckdBrand) => {
        const name = data.find(
          (item) => item.attributes.slug === paramsCheckdBrand
        )?.attributes.name;

        return (
          name ?
            locale === 'ar' ?
              name
            : capitalize(name)
          : ''
        );
      });
  }

  // console.log(paramsCheckedList);

  const [brandCheckedList, setBrandCheckedList] = useState(
    brandParams ? paramsCheckedList : initialBrandsList
  );
  // console.log(brandCheckedList);

  const [sliderValues, setSliderValues] = useState([
    Number(priceMinParams) ?? 0,
    Number(priceMaxParams) ?? 0
  ]);
  const minMaxRef = useRef<null | number[]>(null);
  const categoryRef = useRef<null | string>(null);
  const subCategoryRef = useRef<null | string>(null);

  const [rateCheckedList, setRateCheckedList] = useState(
    ratesParams ?
      ratesParams?.split(',').map((item) => Number(item))
    : defaultRateCheckedList
  );

  const checkAllBrands =
    initialBrandsList.length === brandCheckedList.length;
  const onBrandChange = (list: string[]) => {
    setBrandCheckedList(list);
  };
  const onBrandCheckAllChange = (e: CheckboxChangeEvent) => {
    setBrandCheckedList(e.target.checked ? initialBrandsList : []);
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

  const minPriceValue =
    minMaxRef?.current && typeof minMaxRef?.current[0] === 'number' ?
      minMaxRef?.current[0]
    : (Number(priceMinParams) ?? 0);
  const maxPriceValue =
    minMaxRef?.current && typeof minMaxRef?.current[1] === 'number' ?
      minMaxRef?.current[1]
    : (Number(priceMaxParams) ?? 0);

  const onSliderChange = (newValue: number[]) => {
    if (
      newValue &&
      typeof newValue[0] === 'number' &&
      typeof newValue[1] === 'number'
    ) {
      setSliderValues(newValue);
    }
  };

  const handleApply = () => {
    const brandsSlugChecked = brandCheckedList
      .map((checked) => {
        const foundBrand = data.find(
          (brand) =>
            brand.attributes.name.toLowerCase() ===
            checked.toLowerCase()
        );
        // console.log(foundBrand);
        return foundBrand?.attributes.slug ?? null;
      })
      .filter((checkedBrand) => checkedBrand !== null);

    params.set('page', '1');
    params.set('brands', brandsSlugChecked.join(','));
    params.set('price-min', sliderValues[0].toString() ?? '0');
    params.set('price-max', sliderValues[1].toString() ?? '0');
    params.set('rates', rateCheckedList.join(','));
    router.replace(pathname + '?' + params.toString());
  };

  const handleReset = () => {
    setBrandCheckedList(initialBrandsList);
    setRateCheckedList(defaultRateCheckedList);

    setSliderValues([minPriceValue, maxPriceValue]);
    params.delete('brands');
    params.delete('price-min');
    params.delete('price-max');
    params.delete('rates');
    router.replace(pathname + '?' + params.toString());
  };

  useEffect(() => {
    const getProductsPrices = async () => {
      try {
        const { data: resData, error: resError } =
          await fetchProducts(
            category,
            subCategory,
            locale,
            1,
            100, // page size
            null
          );

        if (!resData || resError) {
          console.error('Error fetching products');
          console.error(resError);
        }
        if (resData?.products?.data) {
          // console.log(resData?.products?.data);
          const prices = resData?.products?.data.map(
            (product) => product.attributes.final_product_price
          );
          // console.log(prices);
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          // console.log([minPrice, maxPrice]);
          setSliderValues([minPrice, maxPrice]);
          minMaxRef.current = [minPrice, maxPrice];
          // setCompleteProductsApiData(resData.products);
          // setProductsData(resData.products.data);
        }
      } catch (err: any) {
        console.error('Error fetching products prices:', err);
        // setError(err);
        // setProductsData([]);
      }
    };

    if (
      didMount ||
      categoryRef.current === category ||
      subCategoryRef.current === subCategory
    ) {
      getProductsPrices();
    }
    categoryRef.current = category;
    subCategoryRef.current = subCategory;
  }, [category, subCategory, locale]);

  useEffect(() => {
    if (category || subCategory) {
      handleReset();
    }
  }, [category, subCategory]);

  return (
    <div className='brands-filter mt-5'>
      <h3
        className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} w-fit text-lg text-black-medium`}
      >
        {t('brandTitle')}
      </h3>

      <Checkbox
        onChange={onBrandCheckAllChange}
        checked={checkAllBrands}
        className='check-all'
        style={{ marginRight: locale === 'ar' ? '15px' : '' }}
      >
        {checkAllBrands ? t('uncheckAll') : t('checkAll')}
      </Checkbox>
      <CheckboxGroup
        options={initialBrandsList}
        value={brandCheckedList}
        onChange={onBrandChange}
        style={{ marginRight: locale === 'ar' ? '15px' : '' }}
      />

      {/* Price Slider */}
      <h3
        className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} mt-5 w-fit text-lg text-black-medium`}
      >
        {t('priceRangeTitle')}
      </h3>
      {/* <div> */}
      <ConfigProvider direction={locale === 'ar' ? 'rtl' : 'ltr'}>
        <Slider
          min={minPriceValue}
          max={maxPriceValue}
          tooltip={{ open: false }}
          range
          defaultValue={sliderValues}
          value={sliderValues}
          onChange={onSliderChange}
          disabled={false}
          style={{
            margin:
              locale === 'en' ?
                '10px 24px 5px 30px'
              : '10px 30px 5px 24px'
          }}
        />
      </ConfigProvider>
      {/* </div> */}
      <p
        className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} text-sm text-black-light`}
      >
        <span>{t('priceSubTitle')}: </span>
        <span className='inline-flex gap-2'>
          <span>EGP ({sliderValues[0]})</span>
          <span> - </span>
          <span>EGP ({sliderValues[1]})</span>
        </span>
        {/* <span></span> */}
      </p>

      {/* Rate CheckBox Group */}
      <h3
        className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} mt-5 w-fit text-lg text-black-medium`}
      >
        {t('rateTitle')}
      </h3>
      <Checkbox
        onChange={onRateCheckAllChange}
        checked={checkAllRates}
        className='check-all'
        style={{
          marginBottom: '3px',
          marginRight: locale === 'ar' ? '15px' : ''
        }}
      >
        {checkAllRates ? t('uncheckAll') : t('checkAll')}
      </Checkbox>
      <CheckboxGroup
        options={plainRateOptions}
        value={rateCheckedList}
        onChange={onRateChange}
        style={{
          gap: '5px',
          marginRight: locale === 'ar' ? '15px' : ''
        }}
      />
      <div
        className={`${locale === 'ar' ? 'mr-[15px]' : 'ml-[24px]'} mb-[100px] mt-5 flex items-center gap-2`}
      >
        <Btn
          className='bg-green-600 px-3 py-[6px] text-sm font-normal text-white'
          defaultPadding={false}
          onClick={handleApply}
        >
          {globaLoading ?
            <Spin
              className='white'
              size='default'
              style={{ paddingInline: '12px' }}
            />
          : <>
              <FaCheck />
              <span>{t('applyButton')}</span>
            </>
          }
        </Btn>
        <Btn
          className='bg-red-shade-300 px-3 py-[6px] text-sm font-normal text-white'
          defaultPadding={false}
          onClick={handleReset}
        >
          <GrPowerReset />
          <span>{t('resetButton')}</span>
        </Btn>
      </div>
    </div>
  );
}

export default BrandFilter;
