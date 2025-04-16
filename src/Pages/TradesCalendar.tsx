import React, { useState, useEffect } from 'react';
import { Calendar, Tooltip, Typography, Row, Col } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';
dayjs.extend(isBetween);
dayjs.extend(utc);

const TradesCalendar: React.FC = () => {
  const [tradeData, setTradeData] = useState<any[]>([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs.utc().startOf('month')); // Start at current month

  useEffect(() => {
    axios.get('http://localhost:5003/api/trades-data/get')
      .then(response => {
        const updatedData = response.data.map((item: any) => ({
          ...item,
          TradeDate: dayjs(item.TradeDate), 
        }));
        setTradeData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching trade data:', error);
      });
  }, []);

  const getDateTrades = (date: Dayjs) => {
    return tradeData.filter(item =>
      dayjs(item.TradeDate).isSame(dayjs(date), 'day') 
    );
  };
  

  const calculateWeeklySummary = (weekStart: Dayjs, weekEnd: Dayjs) => {
    const weeklyTrades = tradeData.filter(item => {
      const tradeDate = dayjs(item.TradeDate); 
      return tradeDate.isBetween(weekStart, weekEnd, 'day', '[]');
    });

    const totalPL = weeklyTrades.reduce((acc, trade) => acc + trade.PL, 0);
    const tradeCount = weeklyTrades.length;

    return { totalPL, tradeCount };
  };

 

    const dateCellRender = (date: Dayjs) => {
      const trades = getDateTrades(dayjs(date).startOf('day'));
  
      if (trades.length === 0) {
        return null;
      }
  
      const totalPL = trades.reduce((acc, trade) => acc + trade.PL, 0);
      const cellColor = totalPL > 0 ? '#d4f4dd' : totalPL < 0 ? '#f8d7da' : 'transparent';
  
      return (
        <div style={{ backgroundColor: cellColor, padding: '5px', borderRadius: '5px' }}>
          <Tooltip
            title={trades.map((trade, index) => (
              <div key={index}>
                <Typography.Text strong>{trade.Symbol}</Typography.Text>: {trade.Description} ({trade.PL >= 0 ? '+' : ''}{trade.PL})
              </div>
            ))}
          >
            <Typography.Text>{`${totalPL >= 0 ? '+' : ''}${totalPL}`}</Typography.Text>
            <br />
            <Typography.Text>{`${trades.length} trade${trades.length > 1 ? 's' : ''}`}</Typography.Text>
          </Tooltip>
        </div>
      );
    };

  const renderMonthlySummary = () => {
    const weeks = [];
    let monthStart = currentMonth.startOf('month'); 
    let monthEnd = currentMonth.endOf('month'); 
    if (monthStart.day() === 6) {
      monthStart = monthStart.add(2, 'days'); 
    } else if (monthStart.day() === 0) {
      monthStart = monthStart.add(1, 'days'); 
    }
    let firstWeekEnd = monthStart;
    while (firstWeekEnd.day() !== 5 && firstWeekEnd.isBefore(monthEnd)) {
      firstWeekEnd = firstWeekEnd.add(1, 'day');
    }

    let weekCounter = 1;
    let currentWeekStart = monthStart;
    let currentWeekEnd = firstWeekEnd;

    let totalPLMonth = 0; 
    const { totalPL: firstWeekPL, tradeCount: firstWeekTrades } = calculateWeeklySummary(currentWeekStart, currentWeekEnd);
    totalPLMonth += firstWeekPL;
    const firstWeekColor = firstWeekPL > 0 ? 'green' : firstWeekPL < 0 ? 'red' : 'inherit';

    weeks.push(
      <Row key="week1" style={{ marginBottom: '10px' }}>
        <Col span={4}><Typography.Text>Week 1</Typography.Text></Col>
        <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
        <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
        <Col span={4}><Typography.Text>{`${firstWeekTrades} trade${firstWeekTrades > 1 ? 's' : ''}`}</Typography.Text></Col>
        <Col span={4} style={{ color: firstWeekColor }}>
          <Typography.Text>{`${firstWeekPL >= 0 ? '+' : ''}${firstWeekPL}`}</Typography.Text>
        </Col>
      </Row>
    );

    weekCounter++;
    currentWeekStart = currentWeekEnd.add(3, 'days'); 
    while (currentWeekStart.isBefore(monthEnd)) {
      currentWeekEnd = currentWeekStart.add(4, 'days'); 

      if (currentWeekEnd.isAfter(monthEnd)) {
        currentWeekEnd = monthEnd; 
      }

      const { totalPL, tradeCount } = calculateWeeklySummary(currentWeekStart, currentWeekEnd);
      totalPLMonth += totalPL; 
      const colorStyle = totalPL > 0 ? 'green' : totalPL < 0 ? 'red' : 'inherit';

      weeks.push(
        <Row key={`week${weekCounter}`} style={{ marginBottom: '10px' }}>
          <Col span={4}><Typography.Text>Week {weekCounter}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{currentWeekStart.format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{currentWeekEnd.format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{`${tradeCount} trade${tradeCount > 1 ? 's' : ''}`}</Typography.Text></Col>
          <Col span={4} style={{ color: colorStyle }}>
            <Typography.Text>{`${totalPL >= 0 ? '+' : ''}${totalPL}`}</Typography.Text>
          </Col>
        </Row>
      );

      weekCounter++;
      currentWeekStart = currentWeekEnd.add(3, 'days'); 
    }

    const totalColor = totalPLMonth > 0 ? 'green' : totalPLMonth < 0 ? 'red' : 'inherit';

    weeks.push(
      <Row key="monthly-total" style={{ fontWeight: 'bold', marginTop: '15px' }}>
        <Col span={16}><Typography.Text>Total Monthly P/L:</Typography.Text></Col>
        <Col span={4} style={{ color: totalColor }}>
          <Typography.Text>{`${totalPLMonth >= 0 ? '+' : ''}${totalPLMonth}`}</Typography.Text>
        </Col>
      </Row>
      
    );

    return weeks;
  };

  const handleMonthChange = (value: Dayjs) => {
    setCurrentMonth(value.startOf('month'));
  };

  return (
    <div>
      <Typography.Title level={3}>{currentMonth.format('MMMM YYYY')} Trade Calendar</Typography.Title>
      <Calendar 
        dateCellRender={dateCellRender} 
        onPanelChange={handleMonthChange} 
      />
            <style>
        {`
          .ant-picker-calendar th:nth-child(1),
          .ant-picker-calendar td:nth-child(1) {
            display: none;
          }
            .ant-picker-calendar th:nth-child(7),
          .ant-picker-calendar td:nth-child(7) {
            display: none;
          }

          .ant-picker-calendar th:nth-child(7) {
            content: "Total P/L";
          }

          
        `}
      </style>
      <Typography.Title level={4} style={{ marginTop: '20px' }}>{currentMonth.format('MMMM YYYY')} Summary</Typography.Title>
      {renderMonthlySummary()}
    </div>
  );
};

export default TradesCalendar;








