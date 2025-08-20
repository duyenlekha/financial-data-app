import { ColumnsType } from 'antd/es/table';
import { Input, Button, Select } from 'antd';
import dayjs from 'dayjs';
import { FindRow } from './types';
import { formatNumber, parseTimeToMinutes, handleDateFilter, isTrue, isFalse } from './utils';

const { Option } = Select;

export function buildColumns(
  filters: any,
  closedRedCounts: { true: number; false: number },
  brokePMHighCounts: { true: number; false: number },
  handleEdit: (id: number) => void,
  cover50Count: number = 0, // 👈 added
  cover70Count: number = 0  // 👈 added
): ColumnsType<FindRow> {
  return [
    {
      title: 'Symbol',
      dataIndex: 'Symbol',
      key: 'Symbol',
      sorter: (a, b) => (a.Symbol || '').localeCompare(b.Symbol || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Symbol"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <div>
            <a onClick={() => clearFilters?.()}>Reset</a>
            <a onClick={() => confirm()} style={{ marginLeft: 8 }}>Search</a>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) => (record.Symbol || '').toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Sector',
      dataIndex: 'Sector',
      key: 'Sector',
      sorter: (a: any, b: any) => (a.Sector || '').localeCompare(b.Sector || ''),
      render: (text: string) => text || 'N/A',
      filters: [
        { text: 'Consumer Discretionary', value: 'Consumer Discretionary' },
        { text: 'Consumer Staples', value: 'Consumer Staples' },
        { text: 'Consumer Defensive', value: 'Consumer Defensive' },
        { text: 'Consumer Cyclical', value: 'Consumer Cyclical' },
        { text: 'Communication Services', value: 'Communication Services' },
        { text: 'Media', value: 'Media' },
        { text: 'Real Estate', value: 'Real Estate' },
        { text: 'Healthcare', value: 'Healthcare' },
        { text: 'Financial Services', value: 'Financial Services' },
        { text: 'Finance', value: 'Finance' },
        { text: 'Energy', value: 'Energy' },
        { text: 'Utilities', value: 'Utilities' },
        { text: 'Technology', value: 'Technology' },
        { text: 'Industrials', value: 'Industrials' },
        { text: 'Basic Materials', value: 'Basic Materials' },
        { text: 'N/A', value: 'N/A' },
      ],
      onFilter: (value, record: any) => (record.Sector || 'N/A') === value,
    },
    {
      title: 'Exchange',
      dataIndex: 'Exchange',
      key: 'Exchange',
      sorter: (a: any, b: any) => (a.Exchange || '').localeCompare(b.Exchange || ''),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            placeholder="Search Exchange"
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            onPressEnter={() => confirm()}
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <div>
            <a onClick={() => clearFilters?.()}>Reset</a>
            <a onClick={() => confirm()} style={{ marginLeft: 8 }}>Search</a>
          </div>
        </div>
      ),
      onFilter: (value: any, record: any) => (record.Exchange || '').toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Date',
      dataIndex: 'TradeDate',
      key: 'TradeDate',
      sorter: (a, b) => new Date(a.TradeDate || '').getTime() - new Date(b.TradeDate || '').getTime(),
      sortDirections: ['ascend', 'descend'],
      render: (text) => (text && dayjs(text).isValid() ? dayjs(text).format('MM/DD/YYYY') : 'N/A'),
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }: any) => (
        <div style={{ padding: 8 }}>
          <Input
            value={selectedKeys[0]}
            onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
            placeholder="MM/YYYY or MM/DD/YYYY"
            style={{ width: 188, marginBottom: 8, display: 'block' }}
          />
          <Button onClick={() => confirm()} type="primary" style={{ marginRight: 8 }}>Search</Button>
          <Button onClick={() => clearFilters?.()} type="default">Reset</Button>
        </div>
      ),
      onFilter: handleDateFilter,
    },

    // Prices / volumes
    { title: 'Market Cap', dataIndex: 'MarketCap', key: 'MarketCap', render: (v: number) => formatNumber(v) },
    { title: 'FloatShares', dataIndex: 'FloatShares', key: 'FloatShares', render: (v: number) => formatNumber(v) },
    { title: 'WinRate', dataIndex: 'WinRate', key: 'WinRate', render: (v: number) => formatNumber(v) },
    { title: 'Open', dataIndex: 'OpenPrice', key: 'OpenPrice', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'High', dataIndex: 'HighPrice', key: 'HighPrice', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'Low', dataIndex: 'LowPrice', key: 'LowPrice', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'Close', dataIndex: 'ClosePrice', key: 'ClosePrice', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'HighOpenRation', dataIndex: 'HighOpenRation', key: 'HighOpenRation', render: (v: number) => formatNumber(v) },
    { title: 'PriceBeforeGap', dataIndex: 'PriceBeforeGap', key: 'PriceBeforeGap', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'PremarketHigh', dataIndex: 'PremarketHigh', key: 'PremarketHigh', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'PremarketLow', dataIndex: 'PremarketLow', key: 'PremarketLow', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'YesterdayClose', dataIndex: 'YesterdayClose', key: 'YesterdayClose', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'YesterdayHigh', dataIndex: 'YesterdayHigh', key: 'YesterdayHigh', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'TomorrowsHigh', dataIndex: 'TomorrowsHigh', key: 'TomorrowsHigh', render: (v: number) => `$${formatNumber(v)}` },


    { title: 'Gap%', dataIndex: 'GapPercent', key: 'GapPercent', render: (v: number) => `${formatNumber(v)}%` },
    { title: 'GapHighPrice%', dataIndex: 'GapHighPricePercent', key: 'GapHighPricePercent', render: (v: number) => `${formatNumber(v)}%` },
    {
      title: 'TimeHigh',
      dataIndex: 'TimeHigh',
      key: 'TimeHigh',
      render: (v: string) => v?.slice(0, 5) || ''
    },
    {
      title: 'TimeLow',
      dataIndex: 'TimeLow',
      key: 'TimeLow',
      render: (v: string) => v?.slice(0, 5) || ''
    },
    
    { title: 'PMVolume', dataIndex: 'PremarketVolume', key: 'PremarketVolume', render: (v: number) => formatNumber(v) },
    { title: 'Volume', dataIndex: 'Volume', key: 'Volume', render: (v: number) => formatNumber(v) },
    { title: 'Vol/PM Ratio', dataIndex: 'VolumeToPremarketRatio', key: 'VolumeToPremarketRatio', render: (v: number) => formatNumber(v) },
    { title: 'Open→HOD Vol', dataIndex: 'VolumeFromOpenToHOD', key: 'VolumeFromOpenToHOD', render: (v: number) => formatNumber(v) },
    { title: 'HOD→Close Vol', dataIndex: 'VolumeFromHODToClose', key: 'VolumeFromHODToClose', render: (v: number) => formatNumber(v) },
    
    { title: 'Vol935', dataIndex: 'Volume935', key: 'Volume935', render: (v: number) => formatNumber(v) },
    { title: 'Vol940', dataIndex: 'Volume940', key: 'Volume940', render: (v: number) => formatNumber(v) },
    { title: 'Vol45', dataIndex: 'Volume945', key: 'Volume945', render: (v: number) => formatNumber(v) },
    { title: 'Vol10', dataIndex: 'Volume10', key: 'Volume10', render: (v: number) => formatNumber(v) },
    { title: 'Vol1030', dataIndex: 'Volume1030', key: 'Volume1030', render: (v: number) => formatNumber(v) },
    { title: 'VolumeHODPM', dataIndex: 'VolumeHODPM', key: 'VolumeHODPM', render: (v: number) => formatNumber(v) },
    { title: 'VolumeClosePM', dataIndex: 'VolumeClosePM', key: 'VolumeClosePM', render: (v: number) => formatNumber(v) },
    { title: 'YestVol', dataIndex: 'YesterdayVolume', key: 'YesterdayVolume', render: (v: number) => formatNumber(v) },
    { title: 'Daily$', dataIndex: 'DailyDollar', key: 'DailyDollar', render: (v: number) => `$${formatNumber(v)}` },
    { title: 'PM$', dataIndex: 'PremarketDollar', key: 'PremarketDollar', render: (v: number) => `$${formatNumber(v)}` },

    //{ title: 'PreDailyDollarRatio', dataIndex: 'PreDailyDollarRatio', key: 'PreDailyDollarRatio', render: (v: number) => `$${formatNumber(v)}` },

    // { title: 'VwapPM', dataIndex: 'VwapPM', key: 'VwapPM', render: (v: number) => `$${formatNumber(v)}` },
    // { title: 'RSI10', dataIndex: 'RSI10', key: 'RSI10', render: (v: number) => formatNumber(v) },
    // { title: 'SmaHod1005', dataIndex: 'SmaHod1005', key: 'SmaHod1005', render: (v: number) => formatNumber(v) },
    // { title: 'EmaOpen1005', dataIndex: 'EmaOpen1005', key: 'EmaOpen1005', render: (v: number) => formatNumber(v) },
    // { title: 'ATR10', dataIndex: 'ATR10', key: 'ATR10', render: (v: number) => formatNumber(v) },
    // { title: 'RVOL10', dataIndex: 'RVOL10', key: 'RVOL10', render: (v: number) => formatNumber(v) },
    // { title: 'SMA10', dataIndex: 'SMA10', key: 'SMA10', render: (v: number) => formatNumber(v) },
    // { title: 'EMA10', dataIndex: 'EMA10', key: 'EMA10', render: (v: number) => formatNumber(v) },
    // { title: 'MinSMAOpen1005', dataIndex: 'MinSMAOpen1005', key: 'MinSMAOpen1005', render: (v: number) => formatNumber(v) },
    // { title: 'Day10AverageVolume', dataIndex: 'Day10AverageVolume', key: 'Day10AverageVolume', render: (v: number) => formatNumber(v) },
    // { title: 'VWAP', dataIndex: 'VWAP', key: 'VWAP', render: (v: number) => `$${formatNumber(v)}` },
   
    
    
    

    
    {
      title: 'TimeHighVolume',
      dataIndex: 'TimeHighVolume',
      key: 'TimeHighVolume',
      render: (v: string) => v?.slice(0, 5) || '',
      filterDropdown: ({ confirm, setSelectedKeys, selectedKeys }: any) => (
        <div style={{ padding: 8 }}>
          <Select
            defaultValue={selectedKeys[0] || ''}
            style={{ width: 250, marginBottom: 8 }}
            onChange={(value) => setSelectedKeys([value])}
          >
            <Option value="<_TimeHigh">TimeHighVolume {'<'} TimeHigh</Option>
            <Option value=">_TimeHigh">TimeHighVolume {'>'} TimeHigh</Option>
            <Option value="<_TimeLow">TimeHighVolume {'<'} TimeLow</Option>
            <Option value=">_TimeLow">TimeHighVolume {'>'} TimeLow</Option>
          </Select>
          <div><Button onClick={() => confirm()} type="primary" size="small">Apply</Button></div>
        </div>
      ),
      onFilter: (value: any, record: any) => {
        if (!value) return true;
        const [op, targetField] = String(value).split('_');
        const src = record.TimeHighVolume?.slice(0, 5);
        const tgt = record[targetField]?.slice(0, 5);
        if (!src || !tgt) return false;
        const s = parseTimeToMinutes(src);
        const t = parseTimeToMinutes(tgt);
        if (op === '<') return s < t;
        if (op === '>') return s > t;
        return true;
      }
    },
    

    {
      title: `Cover50 (${cover50Count})`,
      dataIndex: 'EstimatePriceCover50',
      key: 'EstimatePriceCover50',
      render: (value: number) => (isNaN(value) ? '' : `$${formatNumber(value)}`),
    },
    {
      title: `Cover70 (${cover70Count})`,
      dataIndex: 'EstimatePriceCover70',
      key: 'EstimatePriceCover70',
      render: (value: number) => (isNaN(value) ? '' : `$${formatNumber(value)}`),
    },
    
    
    

    {
      title: `ClosedRed (true: ${closedRedCounts.true}, false: ${closedRedCounts.false})`,
      dataIndex: 'ClosedRed',
      key: 'ClosedRed',
      render: (val: any) => (isTrue(val) ? 'TRUE' : isFalse(val) ? 'FALSE' : String(val ?? '')),
      filters: [{ text: 'TRUE', value: 'TRUE' }, { text: 'FALSE', value: 'FALSE' }],
      filteredValue: filters.ClosedRed ? [filters.ClosedRed] : null,
      onFilter: (val: any, rec: any) => (val === 'TRUE' ? isTrue(rec.ClosedRed) : isFalse(rec.ClosedRed)),
    },
    {
      title: `BrokePMHigh (true: ${brokePMHighCounts.true}, false: ${brokePMHighCounts.false})`,
      dataIndex: 'BrokePremarketHigh',
      key: 'BrokePremarketHigh',
      render: (val: any) => (isTrue(val) ? 'TRUE' : isFalse(val) ? 'FALSE' : String(val ?? '')),
      filters: [{ text: 'TRUE', value: 'TRUE' }, { text: 'FALSE', value: 'FALSE' }],
      filteredValue: filters.BrokePremarketHigh ? [filters.BrokePremarketHigh] : null,
      onFilter: (val: any, rec: any) => (val === 'TRUE' ? isTrue(rec.BrokePremarketHigh) : isFalse(rec.BrokePremarketHigh)),
    },

    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: any) => (
        <Button type="primary" onClick={() => handleEdit(record.StockAnalysisId || record.StockAnalysis_Id || record.Id!)}>
          Edit
        </Button>
      ),
    },
  ];
}
