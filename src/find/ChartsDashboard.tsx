import React from 'react';
import { Row, Col, Card, Typography } from 'antd';
import PercentTable from '../charts/PercentTable';
import MarketCapTable from '../charts/MarketCapTable';
import FloatTable from '../charts/FloatTable';
import PriceRangeTable from '../charts/PriceRangeTable';
import TimeBucketTable from '../charts/TimeBucketTable';
import VolumeTable from '../charts/VolumeTable';
import DailyDollarTable from '../charts/DailyDollarTable';
import PremarketDollarTable from '../charts/PremarketDollarTable';
import Ration from '../charts/Ration';

type Pair = { idx: number; value: number };

type Props = {
  gapPercentData: Pair[];
  gapHighPricePercent: Pair[];
  marketCapData: Pair[];
  floatData: Pair[];
  premarketVolumeData: Pair[];
  volumeData: Pair[];

  volume935: Pair[];
  volume940: Pair[];
  volume945: Pair[];
  volume10: Pair[];
  volume1030: Pair[];


  yesterdayVolume: Pair[];
        yesterdayClose: Pair[];
        yesterdayHigh: Pair[];
        tomorrowsHigh: Pair[];
        pmHigh: Pair[];
        pmLow: Pair[];
        changePercent: Pair[];



  volumeFromOpenToHODData: Pair[];
  volumeFromHODToCloseData: Pair[];
  dailyDollarData: Pair[];
  premarketDollarData: Pair[];
  vwapData: Pair[];
  vPMRData: Pair[];
  preDailyRatioData: Pair[];
  openPriceData: Pair[];
  highOpenRation: Pair[];
   volumeToPremarketRatio: Pair[];
  highPriceData: Pair[];
  lowPriceData: Pair[];
  closePriceData: Pair[];
  priceBeforeGap: Pair[];
  vwapPM: Pair[];
  minSMAOpen1005: Pair[];
  sma10: Pair[];
  ema10: Pair[];
  rsi10: Pair[];
  atr10: Pair[];
  rvol10: Pair[];
  smaHod1005: Pair[];
  emaOpen1005: Pair[];
  timeHighs: string[];
  timeLows: string[];
  timeHighVolumes: string[];

  timeHighBeforeLowCount: number;
  timeLowBeforeHighCount: number;

  timeHighBeforeLowIndexes: Set<number>;
  timeLowBeforeHighIndexes: Set<number>;
};


const { Text } = Typography;


const ChartsDashboard: React.FC<Props> = (props) => {
  const {
    gapPercentData, gapHighPricePercent, marketCapData, floatData, premarketVolumeData,
    volumeData, volume935, volume940, volume945, volume10, volume1030, 
    yesterdayVolume, yesterdayClose, yesterdayHigh, tomorrowsHigh, pmHigh, pmLow, changePercent,
    volumeFromOpenToHODData, volumeFromHODToCloseData, dailyDollarData,
    premarketDollarData, vwapData, vPMRData, preDailyRatioData, openPriceData, highOpenRation, volumeToPremarketRatio,
    highPriceData, lowPriceData, closePriceData, priceBeforeGap, sma10, ema10, rsi10, atr10, 
    rvol10, smaHod1005,  emaOpen1005, vwapPM, minSMAOpen1005,
    timeHighs, timeLows, timeHighVolumes,
    timeHighBeforeLowCount, timeLowBeforeHighCount,
    timeHighBeforeLowIndexes, timeLowBeforeHighIndexes
  } = props;

  const total =
  (timeHighBeforeLowCount ?? 0) + (timeLowBeforeHighCount ?? 0);

    const pct = (n: number | undefined) =>
  total ? ((Number(n || 0) / total) * 100).toFixed(1) : '0.0';

  return (
    <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
      <Col span={2}>
        <PercentTable
        title="GapPercent"
          data={gapPercentData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PercentTable
        title="ChangePercent"
          data={changePercent}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PercentTable
        title="GapHighPricePercent"
          data={gapHighPricePercent}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      

      <Col span={2}>
        <MarketCapTable
          marketCapData={marketCapData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <FloatTable
          floatData={floatData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="PM Volume"
          volumeData={premarketVolumeData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume"
          volumeData={volumeData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume935"
          volumeData={volume935}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume940"
          volumeData={volume940}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume945"
          volumeData={volume945}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume10"
          volumeData={volume10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="Volume1030"
          volumeData={volume1030}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="YesterdayVolume"
          volumeData={yesterdayVolume}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>


      

      <Col span={2}>
        <VolumeTable
        title="OpentoHOD Volume"
          volumeData={volumeFromOpenToHODData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <VolumeTable
        title="HODtoClose Volume"
          volumeData={volumeFromHODToCloseData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

   


      <Col span={2}>
        <DailyDollarTable
          dailyDollarData={dailyDollarData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PremarketDollarTable
          premarketDollarData={premarketDollarData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="VWRAP"
          data={vwapData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="VPMRatio"
          data={vPMRData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>
      <Col span={2}>
        <PriceRangeTable
          title="YesterdayClose"
          data={yesterdayClose}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>
      <Col span={2}>
        <PriceRangeTable
          title="YesterdayHigh"
          data={yesterdayHigh}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="TomorrowsHigh"
          data={tomorrowsHigh}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="PMHigh"
          data={pmHigh}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>
      <Col span={2}>
        <PriceRangeTable
          title="PMLow"
          data={pmLow}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <Ration
          title="VolumeToPremarketRatio"
          data={volumeToPremarketRatio}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <Ration
          title="HighOpenRation"
          data={highOpenRation}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>


      <Col span={2}>
        <PriceRangeTable
          title="Open"
          data={openPriceData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="High"
          data={highPriceData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="Low"
          data={lowPriceData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="Close"
          data={closePriceData}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

     

      <Col span={2}>
        <PriceRangeTable
          title="PriceBeforeGap"
          data={priceBeforeGap}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="SMA10"
          data={sma10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="EMA10"
          data={ema10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="RSI10"
          data={rsi10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="ATR10"
          data={atr10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="RVOL10"
          data={rvol10}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="SmaHod1005"
          data={smaHod1005}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="EmaOpen1005"
          data={emaOpen1005}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="VwapPM"
          data={vwapPM}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}>
        <PriceRangeTable
          title="MinSMAOpen1005"
          data={minSMAOpen1005}
          timeHighBeforeLowIndexes={timeHighBeforeLowIndexes}
          timeLowBeforeHighIndexes={timeLowBeforeHighIndexes}
        />
      </Col>

      <Col span={2}><TimeBucketTable timeData={timeHighs} title="Time High Buckets" /></Col>
      <Col span={2}><TimeBucketTable timeData={timeLows} title="Time Low Buckets" /></Col>
      <Col span={2}><TimeBucketTable timeData={timeHighVolumes} title="Time High Volume Buckets" /></Col>

      <Col span={2}>
        <Card title="TimeHigh < TimeLow" bordered={false}>
            {timeHighBeforeLowCount}{' '}
            <Text type="danger">({pct(timeHighBeforeLowCount)}%)</Text>
        </Card>
        </Col>

        <Col span={2}>
        <Card title="TimeLow < TimeHigh" bordered={false}>
            {timeLowBeforeHighCount}{' '}
            <Text type="danger">({pct(timeLowBeforeHighCount)}%)</Text>
        </Card>
        </Col>
    </Row>
  );
};

export default ChartsDashboard;

