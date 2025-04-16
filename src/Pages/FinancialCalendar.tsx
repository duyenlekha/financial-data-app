import React, { useState, useEffect } from 'react';
import { Calendar, Tooltip, Typography, Row, Col } from 'antd';
import axios from 'axios';
import dayjs, { Dayjs } from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import utc from 'dayjs/plugin/utc';

// Extend Dayjs with plugins
dayjs.extend(isBetween);
dayjs.extend(utc);

const FinancialCalendar: React.FC = () => {
  const [financialData, setFinancialData] = useState<any[]>([]);

  useEffect(() => {
    axios.get('http://localhost:5003/api/financial-data/get?')
      .then(response => {
        // Convert dates to UTC
        const updatedData = response.data.map((item: any) => ({
          ...item,
          Date: dayjs.utc(item.Date).format(),
        }));
        setFinancialData(updatedData);
      })
      .catch(error => {
        console.error('Error fetching financial data:', error);
      });
  }, []);

  const getDateTrades = (date: Dayjs) => {
    return financialData.filter(item =>
      dayjs.utc(item.Date).isSame(date, 'day')
    );
  };

  const calculateWeeklySummary = (weekStart: Dayjs) => {
    const weekEnd = weekStart.add(6, 'days');
    const weeklyTrades = financialData.filter(item =>
      dayjs.utc(item.Date).isBetween(weekStart, weekEnd, 'day', '[]')
    );

    const totalPL = weeklyTrades.reduce((acc, trade) => acc + trade.PL, 0);
    const tradeCount = weeklyTrades.length;

    return { totalPL, tradeCount };
  };

  const dateCellRender = (date: Dayjs) => {
    const trades = getDateTrades(dayjs.utc(date));

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

  const renderWeeklySummary = () => {
    const weeks = [];
    let startOfWeek = dayjs.utc('2024-12-28').startOf('week');

    for (let i = 0; i < 4; i++) {
      const { totalPL, tradeCount } = calculateWeeklySummary(startOfWeek);
      const colorStyle = totalPL > 0 ? 'green' : totalPL < 0 ? 'red' : 'inherit';
      weeks.push(
        <Row key={i} style={{ marginBottom: '10px' }}>
          <Col span={4}><Typography.Text>{startOfWeek.format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{startOfWeek.add(6, 'days').format('MM/DD/YYYY')}</Typography.Text></Col>
          <Col span={4}><Typography.Text>{`${tradeCount} trade${tradeCount > 1 ? 's' : ''}`}</Typography.Text></Col>
          <Col span={4} style={{ color: colorStyle }}>
            <Typography.Text>{`${totalPL >= 0 ? '+' : ''}${totalPL}`}</Typography.Text>
          </Col>
        </Row>
      );
      startOfWeek = startOfWeek.add(7, 'days');
    }

    return weeks;
  };

  return (
    <div>
      <Typography.Title level={3}>Financial Calendar</Typography.Title>
      <Calendar dateCellRender={dateCellRender} />
      <Typography.Title level={4} style={{ marginTop: '20px' }}>Weekly Summary</Typography.Title>
      {renderWeeklySummary()}
    </div>
  );
};

export default FinancialCalendar;