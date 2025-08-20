



// import React, { useState, useEffect } from 'react';
// import { Calendar, Tooltip, Typography, Row, Col, Button, Modal, Card } from 'antd';
// import axios from 'axios';
// import dayjs, { Dayjs } from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import utc from 'dayjs/plugin/utc';
// import config from './config';

// dayjs.extend(isBetween);
// dayjs.extend(utc);

// type Trade = {
//   Symbol: string;
//   Description?: string;
//   ImageUrl?: string;
//   PL: number;
//   TradeDate: Dayjs; // normalized to UTC Dayjs in state
// };

// const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
// const fmtPL = (n: number) => `${n >= 0 ? '+' : ''}${round2(n).toFixed(2)}`;

// // Build the exact image URL your API serves
// const imageSrcFor = (raw?: string) => {
//   if (!raw) return '';
//   const safe = raw.split(/[/\\]/).pop()?.trim() || '';
//   return `${config.API_BASE_URL}/api/trades-data/images/${encodeURIComponent(safe)}`;
// };

// const TradesCalendar: React.FC = () => {
//   const [tradeData, setTradeData] = useState<Trade[]>([]);
//   const [currentMonth, setCurrentMonth] = useState(dayjs.utc().startOf('month'));

//   // Modal state
//   const [modalOpen, setModalOpen] = useState(false);
//   const [modalDate, setModalDate] = useState<Dayjs | null>(null);
//   const [modalTrades, setModalTrades] = useState<Trade[]>([]);

//   useEffect(() => {
//     axios
//       .get(`${config.API_BASE_URL}/api/trades-data/get`, {
//         headers: { 'ngrok-skip-browser-warning': 'true' },
//       })
//       .then((response) => {
//         const updatedData: Trade[] = response.data.map((item: any) => ({
//           ...item,
//           TradeDate: dayjs.utc(item.TradeDate),
//           PL: Number(item.PL) || 0,
//         }));
//         setTradeData(updatedData);
//       })
//       .catch((error) => {
//         console.error('Error fetching trade data:', error);
//       });
//   }, []);

//   const getDateTrades = (date: Dayjs) =>
//     tradeData.filter((item) => item.TradeDate.isSame(dayjs.utc(date), 'day'));

//   const calculateWeeklySummary = (weekStart: Dayjs, weekEnd: Dayjs) => {
//     const weeklyTrades = tradeData.filter((item) =>
//       item.TradeDate.isBetween(weekStart, weekEnd, 'day', '[]')
//     );
//     const totalPL = weeklyTrades.reduce((acc, t) => acc + (Number(t.PL) || 0), 0);
//     return { totalPL, tradeCount: weeklyTrades.length };
//   };

//   // Open modal with all trades for the clicked date
//   const openTradesModal = (date: Dayjs) => {
//     const trades = getDateTrades(dayjs.utc(date).startOf('day'));
//     setModalTrades(trades);
//     setModalDate(dayjs.utc(date));
//     setModalOpen(true);
//   };

//   const dateCellRender = (date: Dayjs) => {
//     const trades = getDateTrades(dayjs.utc(date).startOf('day'));
//     if (trades.length === 0) return null;

//     const totalPL = trades.reduce((acc, t) => acc + (Number(t.PL) || 0), 0);
//     const cellColor = totalPL > 0 ? '#d4f4dd' : totalPL < 0 ? '#f8d7da' : 'transparent';

//     return (
//       <div style={{ backgroundColor: cellColor, padding: 5, borderRadius: 5 }}>
//         <div style={{ marginBottom: 6 }}>
//           <Typography.Text strong>{fmtPL(totalPL)}</Typography.Text>
//           <Typography.Text style={{ marginLeft: 6 }}>
//             {`${trades.length} trade${trades.length > 1 ? 's' : ''}`}
//           </Typography.Text>
//         </div>

//         {/* One button per trade for that day */}
//         <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
//           {trades.map((t, idx) => (
//             <Tooltip key={idx} title={`${t.Symbol} ${fmtPL(t.PL)}`}>
//               <Button
//                 size="small"
//                 onClick={() => openTradesModal(date)}
//                 style={{
//                   padding: '0 8px',
//                   lineHeight: '20px',
//                   height: 22,
//                   fontSize: 12,
//                   fontWeight: 600,
//                   color: '#fff',
//                   background: t.PL >= 0 ? '#52c41a' : '#ff4d4f',
//                   borderColor: 'transparent',
//                 }}
//               >
//                 {fmtPL(t.PL)}
//               </Button>
//             </Tooltip>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   const renderMonthlySummary = () => {
//     const weeks: React.ReactNode[] = [];

//     let monthStart = currentMonth.startOf('month');
//     const monthEnd = currentMonth.endOf('month');

//     if (monthStart.day() === 6) monthStart = monthStart.add(2, 'day');
//     else if (monthStart.day() === 0) monthStart = monthStart.add(1, 'day');

//     let firstWeekEnd = monthStart;
//     while (firstWeekEnd.day() !== 5 && firstWeekEnd.isBefore(monthEnd)) {
//       firstWeekEnd = firstWeekEnd.add(1, 'day');
//     }

//     let weekCounter = 1;
//     let currentWeekStart = monthStart;
//     let currentWeekEnd = firstWeekEnd;

//     let totalPLMonth = 0;

//     const { totalPL: firstWeekPL, tradeCount: firstWeekTrades } = calculateWeeklySummary(
//       currentWeekStart,
//       currentWeekEnd
//     );
//     totalPLMonth += firstWeekPL;
//     const firstWeekColor = firstWeekPL > 0 ? 'green' : firstWeekPL < 0 ? 'red' : 'inherit';

//     weeks.push(
//       <Row key="week1" style={{ marginBottom: 10 }}>
//         <Col span={4}><Typography.Text>Week 1</Typography.Text></Col>
//         <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
//         <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
//         <Col span={4}><Typography.Text>{`${firstWeekTrades} trade${firstWeekTrades > 1 ? 's' : ''}`}</Typography.Text></Col>
//         <Col span={4} style={{ color: firstWeekColor }}><Typography.Text>{fmtPL(firstWeekPL)}</Typography.Text></Col>
//       </Row>
//     );

//     weekCounter++;
//     currentWeekStart = currentWeekEnd.add(3, 'day');
//     while (currentWeekStart.isBefore(monthEnd)) {
//       currentWeekEnd = currentWeekStart.add(4, 'day');
//       if (currentWeekEnd.isAfter(monthEnd)) currentWeekEnd = monthEnd;

//       const { totalPL, tradeCount } = calculateWeeklySummary(currentWeekStart, currentWeekEnd);
//       totalPLMonth += totalPL;
//       const colorStyle = totalPL > 0 ? 'green' : totalPL < 0 ? 'red' : 'inherit';

//       weeks.push(
//         <Row key={`week${weekCounter}`} style={{ marginBottom: 10 }}>
//           <Col span={4}><Typography.Text>Week {weekCounter}</Typography.Text></Col>
//           <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
//           <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
//           <Col span={4}><Typography.Text>{`${tradeCount} trade${tradeCount > 1 ? 's' : ''}`}</Typography.Text></Col>
//           <Col span={4} style={{ color: colorStyle }}><Typography.Text>{fmtPL(totalPL)}</Typography.Text></Col>
//         </Row>
//       );

//       weekCounter++;
//       currentWeekStart = currentWeekEnd.add(3, 'day');
//     }

//     const totalColor = totalPLMonth > 0 ? 'green' : totalPLMonth < 0 ? 'red' : 'inherit';
//     weeks.push(
//       <Row key="monthly-total" style={{ fontWeight: 'bold', marginTop: 15 }}>
//         <Col span={16}><Typography.Text>Total Monthly P/L:</Typography.Text></Col>
//         <Col span={4} style={{ color: totalColor }}><Typography.Text>{fmtPL(totalPLMonth)}</Typography.Text></Col>
//       </Row>
//     );

//     return weeks;
//   };

//   const handleMonthChange = (value: Dayjs) => {
//     setCurrentMonth(dayjs.utc(value).startOf('month'));
//   };

//   return (
//     <div>
//       <Typography.Title level={3}>
//         {currentMonth.format('MMMM YYYY')} Trade Calendar
//       </Typography.Title>

//       <Calendar dateCellRender={dateCellRender} onPanelChange={handleMonthChange} />

//       <style>
//         {`
//           .ant-picker-calendar th:nth-child(1),
//           .ant-picker-calendar td:nth-child(1) { display: none; }
//           .ant-picker-calendar th:nth-child(7),
//           .ant-picker-calendar td:nth-child(7) { display: none; }
//         `}
//       </style>

//       <Typography.Title level={4} style={{ marginTop: 20 }}>
//         {currentMonth.format('MMMM YYYY')} Summary
//       </Typography.Title>
//       {renderMonthlySummary()}

//       <Modal
//       title={modalDate ? `Trades on ${modalDate.format('MM/DD/YYYY')}` : 'Trades'}
//       open={modalOpen} // AntD v5; if v4 use visible={modalOpen}
//       onCancel={() => setModalOpen(false)}
//       footer={null}
//       width="100%" // full width
//       style={{ top: 0, paddingBottom: 0 }}
//       bodyStyle={{ height: 'calc(100vh - 55px)', overflowY: 'auto' }}
//       className="full-screen-modal"
//       destroyOnClose
//     >
//       <Row gutter={[16, 16]}>
//         {modalTrades.map((t, i) => (
//           <Col key={i} xs={24} sm={12} md={12} lg={12} xl={12}>
//             <Card
//               hoverable
//               title={`${t.Symbol} — ${fmtPL(t.PL)}`}
//               cover={
//                 t.ImageUrl ? (
//                   <img
//                     alt={t.Symbol}
//                     src={imageSrcFor(t.ImageUrl)}
//                     style={{
//                       maxHeight: '70vh', // ✅ Much bigger than before
//                       width: '100%',
//                       objectFit: 'contain',
//                     }}
//                     onError={(e) => {
//                       (e.target as HTMLImageElement).style.display = 'none';
//                     }}
//                   />
//                 ) : undefined
//               }
//             >
//               <Typography.Paragraph style={{ marginBottom: 0, fontSize: 16 }}>
//                 {t.Description || 'No description'}
//               </Typography.Paragraph>
//             </Card>
//           </Col>
//         ))}
//       </Row>
//     </Modal>
//     </div>
//   );
// };

// export default TradesCalendar;






import React, { useState, useEffect } from 'react';
import { Calendar, Tooltip, Typography, Row, Col, Button, Modal, Card } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import config from './config';

dayjs.extend(isBetween);

type Trade = {
  Symbol: string;
  Description?: string;
  ImageUrl?: string;
  PL: number;
  TradeDate: Dayjs;   // local Dayjs (NOT UTC)
  _dateKey: string;   // YYYY-MM-DD for exact calendar grouping
};

const round2 = (n: number) => Math.round((n + Number.EPSILON) * 100) / 100;
const fmtPL = (n: number) => `${n >= 0 ? '+' : ''}${round2(n).toFixed(2)}`;
const dateKey = (d: Dayjs | string) =>
  (dayjs.isDayjs(d) ? d : dayjs(d)).format('YYYY-MM-DD');

// Build robust image URL and append ngrok param so <img> works without headers
const imageSrcFor = (raw?: string) => {
  if (!raw) return '';
  const trimmed = String(raw).trim();

  // Absolute URL or data URL
  if (/^(https?:)?\/\//i.test(trimmed) || trimmed.startsWith('data:')) {
    try {
      const u = new URL(trimmed, window.location.origin);
      if (u.hostname.includes('ngrok')) u.searchParams.set('ngrok-skip-browser-warning', 'true');
      return u.toString();
    } catch {
      return trimmed;
    }
  }

  // Treat as filename/path segment from your API
  const safe = trimmed.split(/[/\\]/).pop() || '';
  const base = `${config.API_BASE_URL}/api/trades-data/images/${encodeURIComponent(safe)}`;
  try {
    const u = new URL(base);
    if (u.hostname.includes('ngrok')) u.searchParams.set('ngrok-skip-browser-warning', 'true');
    return u.toString();
  } catch {
    return `${base}?ngrok-skip-browser-warning=true`;
  }
};

const TradesCalendar: React.FC = () => {
  const [tradeData, setTradeData] = useState<Trade[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().startOf('month'));

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<Dayjs | null>(null);
  const [modalTrades, setModalTrades] = useState<Trade[]>([]);

  useEffect(() => {
    axios
      .get(`${config.API_BASE_URL}/api/trades-data/get`, {
        headers: { 'ngrok-skip-browser-warning': 'true' },
      })
      .then((response) => {
        const updatedData: Trade[] = response.data.map((item: any) => {
          // If DB stores *date only*, you can parse like: dayjs(item.TradeDate, 'YYYY-MM-DD')
          const d = dayjs(item.TradeDate);
          return {
            ...item,
            TradeDate: d,             // keep in local time (no UTC conversion)
            _dateKey: dateKey(d),
            PL: Number(item.PL) || 0,
          };
        });
        setTradeData(updatedData);
      })
      .catch((error) => {
        console.error('Error fetching trade data:', error);
      });
  }, []);

  const getDateTrades = (d: Dayjs) => {
    const key = dateKey(d);
    return tradeData.filter((t) => t._dateKey === key);
  };

  const calculateWeeklySummary = (weekStart: Dayjs, weekEnd: Dayjs) => {
    const weeklyTrades = tradeData.filter(
      (t) => !t.TradeDate.isBefore(weekStart, 'day') && !t.TradeDate.isAfter(weekEnd, 'day')
    );
    const totalPL = weeklyTrades.reduce((acc, t) => acc + (Number(t.PL) || 0), 0);
    return { totalPL, tradeCount: weeklyTrades.length };
  };

  const openTradesModal = (d: Dayjs) => {
    const trades = getDateTrades(d.startOf('day'));
    setModalTrades(trades);
    setModalDate(d.startOf('day'));
    setModalOpen(true);
  };

  const dateCellRender = (d: Dayjs) => {
    const trades = getDateTrades(d.startOf('day'));
    if (trades.length === 0) return null;

    const totalPL = trades.reduce((acc, t) => acc + (Number(t.PL) || 0), 0);
    const cellColor = totalPL > 0 ? '#d4f4dd' : totalPL < 0 ? '#f8d7da' : 'transparent';

    return (
      <div style={{ backgroundColor: cellColor, padding: 5, borderRadius: 5 }}>
        <div style={{ marginBottom: 6 }}>
          <Typography.Text strong>{fmtPL(totalPL)}</Typography.Text>
          <Typography.Text style={{ marginLeft: 6 }}>
            {`${trades.length} trade${trades.length > 1 ? 's' : ''}`}
          </Typography.Text>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {trades.map((t, idx) => (
            <Tooltip key={idx} title={`${t.Symbol} ${fmtPL(t.PL)}`}>
              <Button
                size="small"
                onClick={() => openTradesModal(d)}
                style={{
                  padding: '0 8px',
                  lineHeight: '20px',
                  height: 22,
                  fontSize: 12,
                  fontWeight: 600,
                  color: '#fff',
                  background: t.PL >= 0 ? '#52c41a' : '#ff4d4f',
                  borderColor: 'transparent',
                }}
              >
                {fmtPL(t.PL)}
              </Button>
            </Tooltip>
          ))}
        </div>
      </div>
    );
  };

  const renderMonthlySummary = () => {
    const weeks: React.ReactNode[] = [];

    let monthStart = currentMonth.startOf('month');
    const monthEnd = currentMonth.endOf('month');

    if (monthStart.day() === 6) monthStart = monthStart.add(2, 'day');
    else if (monthStart.day() === 0) monthStart = monthStart.add(1, 'day');

    let firstWeekEnd = monthStart;
    while (firstWeekEnd.day() !== 5 && firstWeekEnd.isBefore(monthEnd)) {
      firstWeekEnd = firstWeekEnd.add(1, 'day');
    }

    let weekCounter = 1;
    let currentWeekStart = monthStart;
    let currentWeekEnd = firstWeekEnd;

    let totalPLMonth = 0;

    const { totalPL: firstWeekPL, tradeCount: firstWeekTrades } =
      calculateWeeklySummary(currentWeekStart, currentWeekEnd);
    totalPLMonth += firstWeekPL;
    const firstWeekColor = firstWeekPL > 0 ? 'green' : firstWeekPL < 0 ? 'red' : 'inherit';

    weeks.push(
      <Row key="week1" style={{ marginBottom: 10 }}>
        <Col span={4}><Typography.Text>Week 1</Typography.Text></Col>
        <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
        <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
        <Col span={4}><Typography.Text>{`${firstWeekTrades} trade${firstWeekTrades > 1 ? 's' : ''}`}</Typography.Text></Col>
        <Col span={4} style={{ color: firstWeekColor }}><Typography.Text>{fmtPL(firstWeekPL)}</Typography.Text></Col>
      </Row>
    );

    weekCounter++;
    currentWeekStart = currentWeekEnd.add(3, 'day');
    while (currentWeekStart.isBefore(monthEnd)) {
      currentWeekEnd = currentWeekStart.add(4, 'day');
      if (currentWeekEnd.isAfter(monthEnd)) currentWeekEnd = monthEnd;

      const { totalPL, tradeCount } = calculateWeeklySummary(currentWeekStart, currentWeekEnd);
      totalPLMonth += totalPL;
      const colorStyle = totalPL > 0 ? 'green' : totalPL < 0 ? 'red' : 'inherit';

      weeks.push(
        <Row key={`week${weekCounter}`} style={{ marginBottom: 10 }}>
          <Col span={4}><Typography.Text>Week {weekCounter}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{`${tradeCount} trade${tradeCount > 1 ? 's' : ''}`}</Typography.Text></Col>
          <Col span={4} style={{ color: colorStyle }}><Typography.Text>{fmtPL(totalPL)}</Typography.Text></Col>
        </Row>
      );

      weekCounter++;
      currentWeekStart = currentWeekEnd.add(3, 'day');
    }

    const totalColor = totalPLMonth > 0 ? 'green' : totalPLMonth < 0 ? 'red' : 'inherit';
    weeks.push(
      <Row key="monthly-total" style={{ fontWeight: 'bold', marginTop: 15 }}>
        <Col span={16}><Typography.Text>Total Monthly P/L:</Typography.Text></Col>
        <Col span={4} style={{ color: totalColor }}><Typography.Text>{fmtPL(totalPLMonth)}</Typography.Text></Col>
      </Row>
    );

    return weeks;
  };

  const handleMonthChange = (value: Dayjs) => {
    setCurrentMonth(dayjs(value).startOf('month'));
  };

  return (
    <div>
      <Typography.Title level={3}>
        {currentMonth.format('MMMM YYYY')} Trade Calendar
      </Typography.Title>

      <Calendar dateCellRender={dateCellRender} onPanelChange={handleMonthChange} />

      <style>
        {`
          .ant-picker-calendar th:nth-child(1),
          .ant-picker-calendar td:nth-child(1) { display: none; }
          .ant-picker-calendar th:nth-child(7),
          .ant-picker-calendar td:nth-child(7) { display: none; }
        `}
      </style>

      <Typography.Title level={4} style={{ marginTop: 20 }}>
        {currentMonth.format('MMMM YYYY')} Summary
      </Typography.Title>
      {renderMonthlySummary()}

      <Modal
        title={modalDate ? `Trades on ${modalDate.format('MM/DD/YYYY')}` : 'Trades'}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
        width="100%"
        style={{ top: 0, paddingBottom: 0 }}
        bodyStyle={{ height: 'calc(100vh - 55px)', overflowY: 'auto' }}
        className="full-screen-modal"
        destroyOnClose
      >
        <Row gutter={[16, 16]}>
          {modalTrades.map((t, i) => (
            <Col key={i} xs={24} sm={12} md={12} lg={12} xl={12}>
              <Card
                hoverable
                title={`${t.Symbol} — ${fmtPL(t.PL)}`}
                cover={
                  t.ImageUrl ? (
                    <img
                      alt={t.Symbol}
                      src={imageSrcFor(t.ImageUrl)}
                      style={{ maxHeight: '70vh', width: '100%', objectFit: 'contain' }}
                      onError={(e) => {
                        const el = e.target as HTMLImageElement;
                        console.error('Image failed to load:', el.src);
                        // el.style.display = 'none'; // uncomment to hide broken images
                      }}
                    />
                  ) : undefined
                }
              >
                <Typography.Paragraph style={{ marginBottom: 0, fontSize: 16 }}>
                  {t.Description || 'No description'}
                </Typography.Paragraph>
              </Card>
            </Col>
          ))}
        </Row>
      </Modal>
    </div>
  );
};

export default TradesCalendar;

