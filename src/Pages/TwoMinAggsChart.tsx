// import React, { useEffect, useRef } from 'react';
// import {
//   createChart,
//   CandlestickSeries,
//   HistogramSeries,
//   ISeriesApi,
//   UTCTimestamp,
//   CandlestickData,
//   HistogramData,
// } from 'lightweight-charts';
// import config from '../Pages/config';
// import axios from 'axios';

// type PolygonAgg = {
//   v: number; vw: number; o: number; c: number; h: number; l: number; t: number; n: number;
// };
// type ApiResponse = { results?: PolygonAgg[] };

// interface Props {
//   ticker: string;
//   from: string;
//   to: string;
//   multiplier?: number;
//   timespan?: 'minute' | 'hour' | 'day';
//   height?: number;
//   onClose?: () => void;
// }

// const toSec = (ms: number) => Math.floor(ms / 1000) as UTCTimestamp;

// const TwoMinAggsChart: React.FC<Props> = ({
//   ticker, from, to, multiplier = 2, timespan = 'minute', height = 500,
// }) => {
//   const containerRef = useRef<HTMLDivElement>(null);
//   const chartRef = useRef<ReturnType<typeof createChart>>();
//   const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>();
//   const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>();

//   useEffect(() => {
//     if (!containerRef.current) return;

//     const chart = createChart(containerRef.current, {
//         width: containerRef.current.clientWidth,
//         height,
//         layout: { background: { color: '#131722' }, textColor: '#d1d4dc' },
//         grid: {
//           vertLines: { color: '#1e222d' },
//           horzLines: { color: '#1e222d' },
//         },
//         rightPriceScale: { borderVisible: false },
//         timeScale: {
//           borderVisible: false,
//           timeVisible: true,
//           secondsVisible: false,
//           tickMarkFormatter: (time: any) => {
//             const ts = typeof time === 'number' ? time : (time?.timestamp as number);
//             const d = new Date(ts * 1000);
//             return new Intl.DateTimeFormat('en-US', {
//               timeZone: 'America/New_York',
//               hour: '2-digit',
//               minute: '2-digit',
//             }).format(d);
//           },
//         },
//       });

//       // series
// const candleSeries = chart.addSeries(CandlestickSeries, {
//     upColor: '#4caf50',
//     downColor: '#ef5350',
//     borderUpColor: '#4caf50',
//     borderDownColor: '#ef5350',
//     wickUpColor: '#4caf50',
//     wickDownColor: '#ef5350',
//   });
  
//   const volumeSeries = chart.addSeries(HistogramSeries, {
//     priceScaleId: 'left',                 // ⬅️ move volume to LEFT scale
//     priceFormat: { type: 'volume' },      // ⬅️ show 1.2M, 450k, etc.
//     priceLineVisible: false,
//   });
  
//   // price scales layout
//   chart.priceScale('right').applyOptions({
//     scaleMargins: { top: 0.05, bottom: 0.25 },  // room for volume below
//   });
//   chart.priceScale('left').applyOptions({
//     scaleMargins: { top: 0.80, bottom: 0.00 },  // volume panel
//     entireTextOnly: true,
//   });
  
//   // make left axis visible
//   chart.applyOptions({
//     leftPriceScale: { visible: true, borderVisible: false },
//     rightPriceScale: { visible: true, borderVisible: false },
//   });

//     chartRef.current = chart;
//     candleSeriesRef.current = candleSeries;
//     volumeSeriesRef.current = volumeSeries;

//     const ro = new ResizeObserver(entries => {
//       for (const e of entries) chart.applyOptions({ width: e.contentRect.width });
//     });
//     ro.observe(containerRef.current);

//     return () => {
//       ro.disconnect();
//       chart.remove();
//     };
//   }, [height]);

//   useEffect(() => {
//     const load = async () => {
//       const url = `${config.API_BASE_URL}/api/polygon/aggs?ticker=${encodeURIComponent(
//         ticker
//       )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(
//         to
//       )}&multiplier=${multiplier}&timespan=${timespan}`;
  
//       try {
//         const res = await fetch(url, {
//           headers: { 'ngrok-skip-browser-warning': 'true' },
//         });
//         if (!res.ok) throw new Error(`HTTP ${res.status}`);
  
//         const data: ApiResponse = await res.json();
//         const rows = data.results ?? [];
  
//         const candles: CandlestickData<UTCTimestamp>[] = rows.map(r => ({
//           time: toSec(r.t), // keep UTC for accuracy
//           open: r.o,
//           high: r.h,
//           low: r.l,
//           close: r.c,
//         }));
  
//         const volumes: HistogramData<UTCTimestamp>[] = rows.map(r => ({
//           time: toSec(r.t),
//           value: r.v,
//           color: r.c >= r.o ? 'rgba(76,175,80,0.5)' : 'rgba(239,83,80,0.5)',
//         }));
  
//         candleSeriesRef.current?.setData(candles);
//         volumeSeriesRef.current?.setData(volumes);
//         chartRef.current?.timeScale().fitContent();
//       } catch (err) {
//         console.error('Failed to load aggs:', err);
//       }
//     };
  
//     load();
//   }, [ticker, from, to, multiplier, timespan]);
  

//   return <div ref={containerRef} style={{ width: '100%', height }} />;
// };

// export default TwoMinAggsChart;




import React, { useEffect, useRef } from 'react';
import {
  createChart,
  CandlestickSeries,
  HistogramSeries,
  ISeriesApi,
  UTCTimestamp,
  CandlestickData,
  HistogramData,
} from 'lightweight-charts';
import config from '../Pages/config';

type PolygonAgg = {
  v: number; vw: number; o: number; c: number; h: number; l: number; t: number; n: number;
};
type ApiResponse = { results?: PolygonAgg[] };

interface Props {
  ticker: string;
  from: string;
  to: string;
  multiplier?: number;
  timespan?: 'minute' | 'hour' | 'day';
  height?: number;
  onClose?: () => void;
}

const toSec = (ms: number) => Math.floor(ms / 1000) as UTCTimestamp;

// --- ET helpers ---
const etTimeFmt = new Intl.DateTimeFormat('en-US', {
  timeZone: 'America/New_York',
  hour: '2-digit',
  minute: '2-digit',
});
const getETMinutes = (tsSec: number) => {
  const [hh, mm] = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/New_York',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(tsSec * 1000)).split(':').map(Number);
  return hh * 60 + mm;
};

const TwoMinAggsChart: React.FC<Props> = ({
  ticker, from, to, multiplier = 2, timespan = 'minute', height = 500,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<ReturnType<typeof createChart>>();
  const candleSeriesRef = useRef<ISeriesApi<'Candlestick'>>();
  const volumeSeriesRef = useRef<ISeriesApi<'Histogram'>>();

  // overlay canvas for session shading
  const overlayRef = useRef<HTMLCanvasElement | null>(null);
  const timesRef = useRef<UTCTimestamp[]>([]);

  const drawSessions = () => {

    const etClock = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });
      
      const inPremarketET = (tsSec: number) => {
        const [hh, mm] = etClock.format(new Date(tsSec * 1000)).split(':').map(Number);
        const minutes = hh * 60 + mm;
        return minutes >= 4 * 60 && minutes < 9 * 60 + 30; // 04:00–09:29
      };
      
      const inAfterHoursET = (tsSec: number) => {
        const [hh, mm] = etClock.format(new Date(tsSec * 1000)).split(':').map(Number);
        const minutes = hh * 60 + mm;
        return minutes >= 16 * 60 && minutes < 20 * 60; // 16:00–19:59
      };
    const chart = chartRef.current;
    const canvas = overlayRef.current;
    if (!chart || !canvas) return;
  
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  
    // match canvas size to container
    const { clientWidth: w, clientHeight: h } = containerRef.current!;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    const ts = chart.timeScale();
    const times = timesRef.current;
    if (!times.length) return;
  
    const xs = times.map(t => ts.timeToCoordinate(t) ?? -1);
    let lastDx = 6;
    for (let i = 0; i < xs.length; i++) {
      const x = xs[i];
      if (x < 0) continue;
      const xNext = i < xs.length - 1 ? xs[i + 1] : x + lastDx;
      const dx = Math.max(1, (xNext >= 0 ? xNext - x : lastDx));
      lastDx = dx;
  
      const t = times[i] as number;
  
      if (inPremarketET(t)) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // premarket → soft white overlay
        ctx.fillRect(x, 0, dx, h);
      } else if (inAfterHoursET(t)) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)'; // after-hours → soft white overlay
        ctx.fillRect(x, 0, dx, h);
      }
    }
  };


  

  useEffect(() => {
    if (!containerRef.current) return;

    const chart = createChart(containerRef.current, {
      width: containerRef.current.clientWidth,
      height,
      layout: { background: { color: '#131722' }, textColor: '#d1d4dc' },
      grid: {
        vertLines: { color: '#1e222d' },
        horzLines: { color: '#1e222d' },
      },
      rightPriceScale: { borderVisible: false },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
        tickMarkFormatter: (time: any) => {
          const ts = typeof time === 'number' ? time : (time?.timestamp as number);
          const d = new Date(ts * 1000);
          return etTimeFmt.format(d);
        },
      },
    });

    const candleSeries = chart.addSeries(CandlestickSeries, {
      upColor: '#4caf50',
      downColor: '#ef5350',
      borderUpColor: '#4caf50',
      borderDownColor: '#ef5350',
      wickUpColor: '#4caf50',
      wickDownColor: '#ef5350',
    });

    const volumeSeries = chart.addSeries(HistogramSeries, {
      priceScaleId: 'left',
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
    });

    // layout: put volume in a bottom panel with labels on the left
    chart.priceScale('right').applyOptions({
      scaleMargins: { top: 0.05, bottom: 0.25 },
    });
    chart.priceScale('left').applyOptions({
      scaleMargins: { top: 0.80, bottom: 0.00 },
      entireTextOnly: true,
    });
    chart.applyOptions({
      leftPriceScale: { visible: true, borderVisible: false },
      rightPriceScale: { visible: true, borderVisible: false },
    });

    // overlay canvas on top of chart
    const overlay = document.createElement('canvas');
    overlay.style.position = 'absolute';
    overlay.style.left = '0';
    overlay.style.top = '0';
    overlay.style.width = '100%';
    overlay.style.height = '100%';
    overlay.style.pointerEvents = 'none';
    containerRef.current.style.position = 'relative';
    containerRef.current.appendChild(overlay);
    overlayRef.current = overlay;

    chartRef.current = chart;
    candleSeriesRef.current = candleSeries;
    volumeSeriesRef.current = volumeSeries;

    // v5: keep handler ref and unsubscribe explicitly
    const handleRangeChange = () => drawSessions();
    chart.timeScale().subscribeVisibleTimeRangeChange(handleRangeChange);

    // resize observer
    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        chart.applyOptions({ width: e.contentRect.width, height: e.contentRect.height });
        drawSessions();
      }
    });
    ro.observe(containerRef.current);

    return () => {
      chart.timeScale().unsubscribeVisibleTimeRangeChange(handleRangeChange);
      ro.disconnect();
      overlay.remove();
      chart.remove();
    };
  }, [height]);

  useEffect(() => {
    const load = async () => {
      const url = `${config.API_BASE_URL}/api/polygon/aggs?ticker=${encodeURIComponent(
        ticker
      )}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(
        to
      )}&multiplier=${multiplier}&timespan=${timespan}`;

      try {
        const res = await fetch(url, {
          headers: { 'ngrok-skip-browser-warning': 'true' },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data: ApiResponse = await res.json();
        const rows = data.results ?? [];

        const candles: CandlestickData<UTCTimestamp>[] = rows.map(r => ({
          time: toSec(r.t),
          open: r.o,
          high: r.h,
          low: r.l,
          close: r.c,
        }));

        const volumes: HistogramData<UTCTimestamp>[] = rows.map(r => ({
          time: toSec(r.t),
          value: r.v,
          color: r.c >= r.o ? 'rgba(76,175,80,0.5)' : 'rgba(239,83,80,0.5)',
        }));

        candleSeriesRef.current?.setData(candles);
        volumeSeriesRef.current?.setData(volumes);

        timesRef.current = rows.map(r => toSec(r.t));
        chartRef.current?.timeScale().fitContent();
        drawSessions();
      } catch (err) {
        console.error('Failed to load aggs:', err);
      }
    };

    load();
  }, [ticker, from, to, multiplier, timespan]);

  return <div ref={containerRef} style={{ width: '100%', height, position: 'relative' }} />;
};

export default TwoMinAggsChart;
