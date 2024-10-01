export function getEgyptianGovernorates(language: string = 'en') {
  const governorates: {
    ar: {
      label: string;
      value: string;
    }[];
    en: {
      label: string;
      value: string;
    }[];
  } = {
    ar: [
      { label: 'القاهرة', value: 'cairo' },
      { label: 'الجيزة', value: 'giza' },
      { label: 'القليوبية', value: 'qalyubia' },
      { label: 'الإسكندرية', value: 'alexandria' },
      { label: 'البحيرة', value: 'beheira' },
      { label: 'مطروح', value: 'matruh' },
      { label: 'الدقهلية', value: 'dakahlia' },
      { label: 'كفر الشيخ', value: 'kafr-elsheikh' },
      { label: 'الغربية', value: 'gharbia' },
      { label: 'المنوفية', value: 'menoufia' },
      { label: 'دمياط', value: 'damietta' },
      { label: 'بورسعيد', value: 'port-said' },
      { label: 'الإسماعيلية', value: 'ismailia' },
      { label: 'السويس', value: 'suez' },
      { label: 'الشرقية', value: 'sharqia' },
      { label: 'شمال سيناء', value: 'north-sinai' },
      { label: 'جنوب سيناء', value: 'south-sinai' },
      { label: 'بني سويف', value: 'bani-suef' },
      { label: 'المنيا', value: 'minya' },
      { label: 'الفيوم', value: 'faiyum' },
      { label: 'أسيوط', value: 'asyut' },
      { label: 'الوادي الجديد', value: 'new-valley' },
      { label: 'سوهاج', value: 'sohag' },
      { label: 'قنا', value: 'qena' },
      { label: 'الأقصر', value: 'luxor' },
      { label: 'أسوان', value: 'aswan' },
      { label: 'البحر الأحمر', value: 'red-sea' }
    ],
    en: [
      { label: 'Cairo', value: 'cairo' },
      { label: 'Giza', value: 'giza' },
      { label: 'Qalyubia', value: 'qalyubia' },
      { label: 'Alexandria', value: 'alexandria' },
      { label: 'Beheira', value: 'beheira' },
      { label: 'Matruh', value: 'matruh' },
      { label: 'Dakahlia', value: 'dakahlia' },
      { label: 'Kafr El Sheikh', value: 'kafr-elsheikh' },
      { label: 'Gharbia', value: 'gharbia' },
      { label: 'Menoufia', value: 'menoufia' },
      { label: 'Damietta', value: 'damietta' },
      { label: 'Port Said', value: 'port-said' },
      { label: 'Ismailia', value: 'ismailia' },
      { label: 'Suez', value: 'suez' },
      { label: 'Sharqia', value: 'sharqia' },
      { label: 'North Sinai', value: 'north-sinai' },
      { label: 'South Sinai', value: 'south-sinai' },
      { label: 'Bani Suef', value: 'bani-suef' },
      { label: 'Minya', value: 'minya' },
      { label: 'Faiyum', value: 'faiyum' },
      { label: 'Asyut', value: 'asyut' },
      { label: 'New Valley', value: 'new-valley' },
      { label: 'Sohag', value: 'sohag' },
      { label: 'Qena', value: 'qena' },
      { label: 'Luxor', value: 'luxor' },
      { label: 'Aswan', value: 'aswan' },
      { label: 'Red Sea', value: 'red-sea' }
    ]
  };

  return language === 'ar' || language === 'en' ?
      governorates[language]
    : governorates.en;
}
