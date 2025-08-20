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
          
          <Menu.Item key="/FindTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Find Table
          </Menu.Item>
          <Menu.Item key="/TradesCalendar" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Trades Calendar
          </Menu.Item>
          <Menu.Item key="/TradesTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Trades Table
          </Menu.Item>

          <Menu.Item key="/NoteTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Note
          </Menu.Item>

          
          
          <Menu.Item key="/SecTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Sec 
          </Menu.Item>
          <Menu.Item key="/RulesTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Rules 
          </Menu.Item>
          <Menu.Item key="/CriteriaTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Criteria 
          </Menu.Item>
          <Menu.Item key="/LearningItemTable" icon={<CalendarOutlined style={{ color: 'lightskyblue' }} />}>
            Learning Item Table
          </Menu.Item>
        
        
         
        </Menu>
    </div>
    )
}
export default SideMenu;