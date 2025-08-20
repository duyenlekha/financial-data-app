import dayjs from 'dayjs';

export const formatNumber = (num?: number | null): string => {
  if (num === undefined || num === null || isNaN(num as any)) return 'N/A';
  if (num >= 1_000_000_000) return (num / 1_000_000_000).toFixed(1) + 'B';
  if (num >= 1_000_000) return (num / 1_000_000).toFixed(1) + 'M';
  if (num >= 1_000) return (num / 1_000).toFixed(1) + 'K';
  return Number(num).toFixed(2);
};

export const parseTimeToMinutes = (time: string): number => {
  const [h, m] = time.split(':');
  return parseInt(h, 10) * 60 + parseInt(m, 10);
};

export const isTimeLike = (val: any): boolean =>
  typeof val === 'string' && /^\d{1,2}:\d{2}(:\d{2})?$/.test(val);

export const isTrue = (v: any) => v === true || v === 1 || v === 'TRUE';
export const isFalse = (v: any) => v === false || v === 0 || v === 'FALSE';

export const handleDateFilter = (value: any, record: any) => {
  const recordDate = dayjs(record.Date);

  const monthPattern = /^(0[1-9]|1[0-2])\/\d{4}$/;
  if (monthPattern.test(value)) {
    const [month, year] = value.split('/');
    const target = dayjs(`${year}-${month}-01`);
    return recordDate.isSame(target, 'month');
  }

  const datePattern = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
  if (datePattern.test(value)) {
    const [day, month, year] = value.split('/');
    const target = dayjs(`${year}-${month}-${day}`);
    return recordDate.isSame(target, 'day');
  }
  return true;
};

// ---- Prices ----
export const PRICE_FIELDS: string[] = [
  'OpenPrice',
  'HighPrice',
  'LowPrice',
  'ClosePrice',
  'PriceBeforeGap',
  'PremarketHigh',
  'PremarketLow',
  'YesterdayHigh',
  'YesterdayClose',
  'TomorrowsHigh',
  'VWAP',
  'VwapPM',
  'EstimatePriceCover50',
  'EstimatePriceCover70',
];

// ---- Volumes ----
export const VOLUME_FIELDS: string[] = [
  'Volume',
  'PremarketVolume',
  'YesterdayVolume',
  'VolumeFromOpenToHOD',
  'VolumeFromHODToClose',
  'Volume935',
  'Volume940',
  'Volume945',
  'Volume10',
  'Volume1030',
  'VolumeHODPM',
  'VolumeClosePM',
  'Day10AverageVolume',
];

// ---- Size & Dollar ----
export const SIZE_AND_DOLLAR_FIELDS: string[] = [
    'WinRate',
  'FloatShares',
  'MarketCap',
  'DailyDollar',
  'PremarketDollar',
  'GapPercent',
  'GapHighPricePercent',
  'ChangePercent',
  'VolumeToPremarketRatio',
  'PreDailyDollarRatio',
  'OpenToHODVolumeRatio',
  'PreOpenToHODVolumeRatio',
  'RVOL10',
];


// ---- Indicators ----
export const INDICATOR_FIELDS: string[] = [
  'SMA10',
  'EMA10',
  'SmaHod1005',
  'EmaOpen1005',
  'MinSMAOpen1005',
  'ATR10',
  'RSI10',
  'TimeHigh',
  'TimeLow',
  'TimeHighVolume',
  'Country',
];






export const filterableFields: string[] = [
  ...PRICE_FIELDS,
  ...VOLUME_FIELDS,
  ...SIZE_AND_DOLLAR_FIELDS,
  ...INDICATOR_FIELDS,
];


export const filterColumns7: string[][] = [
  PRICE_FIELDS,
  VOLUME_FIELDS,
  SIZE_AND_DOLLAR_FIELDS,
  INDICATOR_FIELDS,
];


export const filterGroups7: { title: string; fields: string[] }[] = [
  { title: 'Prices', fields: PRICE_FIELDS },
  { title: 'Volumes', fields: VOLUME_FIELDS },
  { title: 'Size & $', fields: SIZE_AND_DOLLAR_FIELDS },
  { title: 'Indicators', fields: INDICATOR_FIELDS },
];


export const filterColumns: string[][] = [
  PRICE_FIELDS,
  VOLUME_FIELDS,
  [
    ...SIZE_AND_DOLLAR_FIELDS,
    ...INDICATOR_FIELDS,
  ],
];

export const numberSeries = (arr: any[], key: string) =>
  arr.map((x: any) => x[key]).filter((v: any) => typeof v === 'number' && !isNaN(v));




