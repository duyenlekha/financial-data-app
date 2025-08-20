import React, { useState, useEffect } from 'react';
import { Table, Modal, Button } from 'antd';
import config from '../Pages/config';
import { ApiResponse, FindRow, Comparison } from './types';
import { fetchFindData } from '../services/findApi';
import FiltersPanel from './FiltersPanel';
import ComparisonBuilder from './ComparisonBuilder';
import ChartsDashboard from './ChartsDashboard';
import { buildColumns } from './columns';
import { parseTimeToMinutes, isTimeLike, isTrue, isFalse } from './utils';
import TwoMinAggsChart from '../Pages/TwoMinAggsChart';

type Pair = { idx: number; value: number };

const FindTable: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<any>({});
  const [comparisons, setComparisons] = useState<Comparison[]>([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleEdit, setIsModalVisibleEdit] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);

  const [data, setData] = useState<FindRow[]>([]);
  const [rawData, setRawData] = useState<FindRow[]>([]);


  const [gapPercentData, setGapPercentData] = useState<Pair[]>([]);
  const [gapHighPricePercent, setGapHighPricePercent] = useState<Pair[]>([]);
  const [marketCapData, setMarketCapData] = useState<Pair[]>([]);
  const [floatData, setFloatData] = useState<Pair[]>([]);
  const [premarketVolumeData, setPremarketVolumeData] = useState<Pair[]>([]);
  const [volumeData, setVolumeData] = useState<Pair[]>([]);
  const [openPriceData, setOpenPriceData] = useState<Pair[]>([]);
  const [highOpenRation, setHighOpenRation] = useState<Pair[]>([]);
  const [volumeToPremarketRatio, setVolumeToPremarketRatio] = useState<Pair[]>([]);
  const [vPMRData, setVPMRData] = useState<Pair[]>([]);
  const [preDailyRatioData, setpreDailyRatioVPMRData] = useState<Pair[]>([]);
  const [highPriceData, setHighPriceData] = useState<Pair[]>([]);
  const [lowPriceData, setLowPriceData] = useState<Pair[]>([]);
  const [closePriceData, setClosePriceData] = useState<Pair[]>([]);
  const [priceBeforeGap, setPriceBeforeGap] = useState<Pair[]>([]);
  const [sma10, setSMA10] = useState<Pair[]>([]);
  const [ema10, setEMA10] = useState<Pair[]>([]);
  const [rsi10, setRSI10] = useState<Pair[]>([]);
  const [atr10, setATR10] = useState<Pair[]>([]);
  const [rvol10, setRVOL10] = useState<Pair[]>([]);
  const [vwapPM, setVwapPM] = useState<Pair[]>([]);
  const [smaHod1005, setSmaHod1005] = useState<Pair[]>([]);
  const [emaOpen1005, setEmaOpen1005] = useState<Pair[]>([]);
  const [minSMAOpen1005, setMinSMAOpen1005] = useState<Pair[]>([]);
  const [volumeFromOpenToHODData, setVolumeFromOpenToHODData] = useState<Pair[]>([]);
  const [volumeFromHODToCloseData, setVolumeFromHODToCloseData] = useState<Pair[]>([]);

  const [volume935, setVolume935] = useState<Pair[]>([]);
  const [volume940, setVolume940] = useState<Pair[]>([]);
  const [volume945, setVolume945] = useState<Pair[]>([]);
  const [volume10, setVolume10] = useState<Pair[]>([]);
  const [volume1030, setVolume1030] = useState<Pair[]>([]);
  const [yesterdayVolume, setYesterdayVolume] = useState<Pair[]>([]);
  const [yesterdayClose, setYesterdayClose] = useState<Pair[]>([]);
  const [yesterdayHigh, setYesterdayHigh] = useState<Pair[]>([]);
  const [tomorrowsHigh, setTomorrowsHigh] = useState<Pair[]>([]);
  const [pmHigh, setPMHigh] = useState<Pair[]>([]);
  const [pmLow, setPMLow] = useState<Pair[]>([]);
  const [changePercent, setChangePercent] = useState<Pair[]>([]);
  const [dailyDollarData, setDailyDollarData] = useState<Pair[]>([]);
  const [premarketDollarData, setPremarketDollarData] = useState<Pair[]>([]);
  const [vwapData, setVWAPData] = useState<Pair[]>([]);
  const [cover50Count, setCover50Count] = useState<number>(0);
  const [cover70Count, setCover70Count] = useState<number>(0);

  const [timeHighBeforeLowCount, setTimeHighBeforeLowCount] = useState<number>(0);
  const [timeLowBeforeHighCount, setTimeLowBeforeHighCount] = useState<number>(0);
  const [timeHighBeforeLowIndexes, setTimeHighBeforeLowIndexes] = useState<Set<number>>(new Set());
  const [timeLowBeforeHighIndexes, setTimeLowBeforeHighIndexes] = useState<Set<number>>(new Set());
  const [timeHighs, setTimeHighs] = useState<string[]>([]);
  const [timeLows, setTimeLows] = useState<string[]>([]);

  const [timePMHighBeforeLowCount, setTimePMHighBeforeLowCount] = useState<number>(0);
  const [timePMLowBeforeHighCount, setTimePMLowBeforeHighCount] = useState<number>(0);
  const [timePMHighBeforeLowIndexes, setTimePMHighBeforeLowIndexes] = useState<Set<number>>(new Set());
  const [timePMLowBeforeHighIndexes, setTimePMLowBeforeHighIndexes] = useState<Set<number>>(new Set());
  const [timePMHighs, setTimePMHighs] = useState<string[]>([]);
  const [timePMLows, setTimePMLows] = useState<string[]>([]);
  const [timeHighVolumes, setTimeHighVolumes] = useState<string[]>([]);


  const [isChartOpen, setIsChartOpen] = useState(false);
  const [chartTicker, setChartTicker] = useState<string>('');
  const [chartFrom, setChartFrom] = useState<string>('');
  const [chartTo, setChartTo] = useState<string>('');

  





    const toPairs = (rows: FindRow[], pick: (row: FindRow) => any): Pair[] =>
    rows
      .map((row, idx) => ({ idx, value: pick(row) }))
      .filter(p => typeof p.value === 'number' && !isNaN(p.value));

      const fetchData = async () => {
        setLoading(true);
      
   
        const normalizedComparisons = comparisons
          .filter(c => c.fieldA && (c.useValue ? c.value !== null && c.value !== undefined : c.fieldB))
          .map(c => ({
            fieldA: c.fieldA,
            operator: c.operator,         
            useValue: !!c.useValue,
            value: c.useValue ? c.value : undefined,
            fieldB: c.useValue ? undefined : c.fieldB
          }));
      
    
        let queryString = '';
        for (const key in filters) {
          const v = (filters as any)[key];
          if (v !== undefined && v !== null && v !== '') {
            queryString += `&${key}=${v}`;
          }
        }
      
 
        if (normalizedComparisons.length > 0) {
          queryString += `&comparisons=${encodeURIComponent(JSON.stringify(normalizedComparisons))}`;
        }
    try {
      const result: ApiResponse = await fetchFindData(queryString);

      setData(result.data);
      setRawData(result.data);

      setCover50Count(
        result.data.filter(
          (item: any) =>
            typeof item.EstimatePriceCover50 === 'number' &&
            !isNaN(item.EstimatePriceCover50) &&
            item.EstimatePriceCover50 !== 0
        ).length
      );

      setCover70Count(
        result.data.filter(
          (item: any) =>
            typeof item.EstimatePriceCover70 === 'number' &&
            !isNaN(item.EstimatePriceCover70) &&
            item.EstimatePriceCover70 !== 0
        ).length
      );


      computeTimeIndexSets(result.data);
      setGapPercentData(toPairs(result.data, r => (r as any).GapPercent));
      setGapHighPricePercent(toPairs(result.data, r => (r as any).GapHighPricePercent));
      setMarketCapData(toPairs(result.data, r => (r as any).MarketCap));
      setFloatData(toPairs(result.data, r => (r as any).FloatShares));
      setPremarketVolumeData(toPairs(result.data, r => (r as any).PremarketVolume));
      setVolumeData(toPairs(result.data, r => (r as any).Volume));
      setVPMRData(toPairs(result.data, r => (r as any).VolumeToPremarketRatio));
      setpreDailyRatioVPMRData(toPairs(result.data, r => (r as any).PreDailyDollarRatio));
      setOpenPriceData(toPairs(result.data, r => (r as any).OpenPrice));
      setHighOpenRation(toPairs(result.data, r => (r as any).HighOpenRation));
      setVolumeToPremarketRatio(toPairs(result.data, r => (r as any).VolumeToPremarketRatio));
      setHighPriceData(toPairs(result.data, r => (r as any).HighPrice));
      setLowPriceData(toPairs(result.data, r => (r as any).LowPrice));
      setClosePriceData(toPairs(result.data, r => (r as any).ClosePrice));
      setPriceBeforeGap(toPairs(result.data, r => (r as any).PriceBeforeGap));

      setSMA10(toPairs(result.data, r => (r as any).SMA10));
      setEMA10(toPairs(result.data, r => (r as any).EMA10));
      setRSI10(toPairs(result.data, r => (r as any).RSI10));
      setATR10(toPairs(result.data, r => (r as any).ATR10));
      setRVOL10(toPairs(result.data, r => (r as any).RVOL10));
      setSmaHod1005(toPairs(result.data, r => (r as any).SmaHod1005));
      setEmaOpen1005(toPairs(result.data, r => (r as any).EmaOpen1005));

      setVwapPM(toPairs(result.data, r => (r as any).VwapPM));
      setMinSMAOpen1005(toPairs(result.data, r => (r as any).MinSMAOpen1005));
      setVolumeFromOpenToHODData(toPairs(result.data, r => (r as any).VolumeFromOpenToHOD));
      setVolumeFromHODToCloseData(toPairs(result.data, r => (r as any).VolumeFromHODToClose));
      setDailyDollarData(toPairs(result.data, r => (r as any).DailyDollar));
      setPremarketDollarData(toPairs(result.data, r => (r as any).PremarketDollar));
      setVWAPData(toPairs(result.data, r => (r as any).VWAP));

      setVolume935(toPairs(result.data, r => (r as any).Volume935));
      setVolume940(toPairs(result.data, r => (r as any).Volume940));
      setVolume945(toPairs(result.data, r => (r as any).Volume945));
      setVolume10(toPairs(result.data, r => (r as any).Volume10));
      setVolume1030(toPairs(result.data, r => (r as any).Volume1030));


      setYesterdayVolume(toPairs(result.data, r => (r as any).YesterdayVolume));
      setYesterdayClose(toPairs(result.data, r => (r as any).YesterdayClose));
      setYesterdayHigh(toPairs(result.data, r => (r as any).YesterdayHigh));
      setTomorrowsHigh(toPairs(result.data, r => (r as any).TomorrowsHigh));
      setPMHigh(toPairs(result.data, r => (r as any).PremarketHigh));
      setPMLow(toPairs(result.data, r => (r as any).PremarketLow));
      setChangePercent(toPairs(result.data, r => (r as any).ChangePercent));



      

      setTimeHighVolumes(result.data.map((x: any) => x.TimeHighVolume).filter((v: string) => typeof v === 'string'));
      setTimeHighs(result.data.map((x: any) => x.TimeHigh).filter((v: string) => typeof v === 'string'));
      setTimeLows(result.data.map((x: any) => x.TimeLow).filter((v: string) => typeof v === 'string'));
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const computeTimeIndexSets = (rows: FindRow[]) => {
    const hiBeforeLo = new Set<number>();
    const loBeforeHi = new Set<number>();

    const toMin = (t: string) => {
      const [h, m] = t.slice(0, 5).split(':').map(Number);
      return h * 60 + m;
    };

    rows.forEach((row, idx) => {
      const th = typeof row.TimeHigh === 'string' ? row.TimeHigh.slice(0, 5) : null;
      const tl = typeof row.TimeLow === 'string' ? row.TimeLow.slice(0, 5) : null;
      if (th && tl) {
        const a = toMin(th), b = toMin(tl);
        if (a < b) hiBeforeLo.add(idx);
        else if (b < a) loBeforeHi.add(idx);
      }
    });

    setTimeHighBeforeLowIndexes(hiBeforeLo);
    setTimeLowBeforeHighIndexes(loBeforeHi);
    setTimeHighBeforeLowCount(hiBeforeLo.size);
    setTimeLowBeforeHighCount(loBeforeHi.size);
  };




const handleApplyFilters = () => {
    fetchData(); 
  };


  console.log("Data:", data)



  const showModal = (imageUrl: string) => { setSelectedImageUrl(imageUrl); setIsModalVisible(true); };
  const handleOk = () => { setIsModalVisible(false); setSelectedImageUrl(null); };
  const handleCancel = () => { setIsModalVisible(false); setSelectedImageUrl(null); };

  const handleEdit = (id: number) => { setEditingId(id); setIsModalVisibleEdit(true); };
  const closeEditModal = () => { setIsModalVisibleEdit(false); setEditingId(null); fetchData(); };

  const openChart = (row: FindRow) => {
    const tradeDate = (row as any).TradeDate || (row as any).Date; // fallback
    if (!tradeDate) {
      console.warn('No TradeDate/Date on row:', row);
      return;
    }
    setChartTicker(row.Symbol);
    setChartFrom(String(tradeDate).slice(0, 10)); // ensure 'YYYY-MM-DD'
    setChartTo(String(tradeDate).slice(0, 10));
    setIsChartOpen(true);
  };
  const closeChart = () => setIsChartOpen(false);


  const closedRedCounts = {
    true: data.filter((x) => isTrue(x.ClosedRed)).length,
    false: data.filter((x) => isFalse(x.ClosedRed)).length,
  };
  const brokePMHighCounts = {
    true: data.filter((x) => isTrue(x.BrokePremarketHigh)).length,
    false: data.filter((x) => isFalse(x.BrokePremarketHigh)).length,
  };

  const baseColumns = buildColumns(
    filters,
    closedRedCounts,
    brokePMHighCounts,
    handleEdit,
    cover50Count,   
    cover70Count
  );

  const columns = [
    {
        title: 'Chart',
        key: 'chart',
        fixed: 'right' as const,
        render: (_: any, row: FindRow) => (
          <Button size="small" onClick={() => openChart(row)}>Chart</Button>
        ),
      },
    ...baseColumns,
    
  ];

  return (
    <>
      <FiltersPanel
        filters={filters}
        setFilters={setFilters}
        onApply={fetchData}
      />



      <ComparisonBuilder
        comparisons={comparisons}
        setComparisons={setComparisons}
        onApply={fetchData}
      />

      <Table
        columns={columns.map((c) => ({ ...c, onCell: () => ({ style: { fontSize: '12px' } }) }))}
        dataSource={data}
        rowKey={(r: FindRow) => r.StockAnalysisId || (r as any).StockAnalysis_Id || r.Id || `${r.Symbol}-${r.TradeDate}`}
        loading={loading}
        pagination={{ pageSizeOptions: ['10', '20', '50', '100'], defaultPageSize: 10, showSizeChanger: true }}
        style={{ fontSize: '12px' }}
      />

      <ChartsDashboard
        gapPercentData={gapPercentData}
        gapHighPricePercent={gapHighPricePercent}
        marketCapData={marketCapData}
        floatData={floatData}
        premarketVolumeData={premarketVolumeData}
        volumeData={volumeData}

        volume935={volume935}
        volume940={volume940}
        volume945={volume945}
        volume10={volume10}
        volume1030={volume1030}


        yesterdayVolume={yesterdayVolume}
        yesterdayClose={yesterdayClose}
        yesterdayHigh={yesterdayHigh}
        tomorrowsHigh={tomorrowsHigh}
        pmHigh={pmHigh}
        pmLow={pmLow}
        changePercent={changePercent}




        volumeFromOpenToHODData={volumeFromOpenToHODData}
        volumeFromHODToCloseData={volumeFromHODToCloseData}
        dailyDollarData={dailyDollarData}
        premarketDollarData={premarketDollarData}
        vwapData={vwapData}
        vPMRData={vPMRData}
        preDailyRatioData={preDailyRatioData}
        openPriceData={openPriceData}
        highOpenRation={highOpenRation}
        volumeToPremarketRatio={volumeToPremarketRatio}
        highPriceData={highPriceData}
        lowPriceData={lowPriceData}
        closePriceData={closePriceData}
        priceBeforeGap={priceBeforeGap}
        sma10={sma10}
        ema10={ema10}
        rsi10={rsi10}
        atr10={atr10}
        rvol10={rvol10}
        
        smaHod1005={smaHod1005}
        emaOpen1005={emaOpen1005}
        vwapPM={vwapPM}

        minSMAOpen1005={minSMAOpen1005}
        timeHighs={timeHighs}
        timeLows={timeLows}
        timeHighVolumes={timeHighVolumes}
        timeHighBeforeLowCount={timeHighBeforeLowCount}
        timeLowBeforeHighCount={timeLowBeforeHighCount}
        timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
        timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
      />

      <Modal open={isModalVisible} onOk={handleOk} onCancel={handleCancel} footer={null} width={2000}>
        {selectedImageUrl && (
          <img
            src={`${config.API_BASE_URL}/images/${encodeURIComponent(selectedImageUrl)}`}
            alt="Detailed View"
            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
          />
        )}
      </Modal>

      <Modal open={isModalVisibleEdit} onCancel={closeEditModal} footer={null} width={1700}>
        {editingId && (
          <div style={{ padding: 24 }}>Mount your <b>EditFindData</b> here.</div>
        )}
      </Modal>

      <Modal
       title={
        chartTicker
          ? `${chartTicker} — ${chartFrom === chartTo ? chartFrom : `${chartFrom} → ${chartTo}`} (ET)`
          : 'Chart'
      }
  open={isChartOpen}
  onCancel={closeChart}
  footer={null}
  width={1200}
  bodyStyle={{ padding: 0, height: 640 }}
  destroyOnClose
>
  <TwoMinAggsChart
    key={`${chartTicker}-${chartFrom}-${chartTo}`}   // force remount on change
    ticker={chartTicker}
    from={chartFrom}
    to={chartTo}
    height={640}
  />
</Modal>

    </>
  );
};

export default FindTable;




