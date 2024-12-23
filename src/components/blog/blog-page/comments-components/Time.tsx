import dayjs from 'dayjs';
import 'dayjs/locale/en'; // Import the English locale
import 'dayjs/locale/ar'; // Import the Arabic locale
import { useLocale } from 'next-intl';

type PropsType = {
  createdAtInput: string | null;
  publishedAtInput: string | null;
};

function Time({ createdAtInput, publishedAtInput }: PropsType) {
  const locale = useLocale();
  dayjs.locale(locale);
  const createdAt = dayjs(createdAtInput ?? '');
  const publishedAt = dayjs(publishedAtInput ?? '');
  // Check if publishedAt is at least 5 seconds after createdAt
  const differenceInSeconds = publishedAt.diff(createdAt, 'second');

  return (
    <time
      dateTime={createdAt.format('DD-MMMM-YYYY')}
      title={createdAt.format('DD MMMM YYYY ( hh:mm A )')}
    >
      {(() => {
        return `${
          differenceInSeconds >= 5 ?
            locale === 'ar' ?
              ' { تم التعديل } '
            : ' { Edited } '
          : ''
        } ${publishedAt.format('DD MMMM YYYY ( hh:mm A )')}`;
      })()}
    </time>
  );
}

export default Time;
