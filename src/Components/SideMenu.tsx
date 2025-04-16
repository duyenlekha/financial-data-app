import {Menu} from 'antd';
import {
  CalendarOutlined,

} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';



function SideMenu() {
  const navigate = useNavigate();
  


  const handleMenuClick = (key: string) => {
    if (key === 'signout') {
    } else {
      navigate(key);
    }
  };


  
    return (
        <div>
        <Menu
        style={{ width: '100%', height: '100%' }}
        mode="inline"
        theme="dark"
        onClick={({ key }) => handleMenuClick(key)}
      >
          {/* <Menu.Item key="/" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Stock Table
          </Menu.Item>
       
          <Menu.Item key="/StockDataForm" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Stock Data Form
          </Menu.Item>

          <Menu.Item key="/FinancialCalendar" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Financial Calendar
          </Menu.Item> */}
          <Menu.Item key="/FindTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Find Table
          </Menu.Item>
          <Menu.Item key="/TradesForm" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Trades Form
          </Menu.Item>

          <Menu.Item key="/TradesTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Trades Table
          </Menu.Item>
          <Menu.Item key="/TradesCalendar" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Trades Calendar
          </Menu.Item>
        
        
         
        </Menu>
    </div>
    )
}
export default SideMenu;