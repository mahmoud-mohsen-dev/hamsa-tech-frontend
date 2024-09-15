import { useLocale, useTranslations } from 'next-intl';
import LocalSwitcherSelect from './LocalSwitcherSelect';

function LocalSwitcher() {
  const t = useTranslations('LocaleSwitcher');
  const locale = useLocale();
  return (
    <LocalSwitcherSelect defaultValue={locale} label={t('label')}>
      {['en', 'ar'].map((cur) => (
        <option key={cur} value={cur}>
          {t(`locale`, { locale: cur })}
        </option>
      ))}
    </LocalSwitcherSelect>
  );
}

export default LocalSwitcher;
