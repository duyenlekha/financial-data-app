import './App.css';
import { Layout, Spin } from 'antd';
import SideMenu from './Components/SideMenu';
import Content from './Components/Content';
import { useState } from 'react';

function App() {

  
  const [collapsed, setCollapsed] = useState(false);
  const { Footer, Sider, } = Layout;

  return (

   
    <Layout style={{ height: '100vh',  }}>
      
      <Layout style={{ height: '900px', overflow: 'visible' }} >
        <Sider
          breakpoint="lg"
          collapsible collapsed={collapsed} 
          onCollapse={() => setCollapsed(!collapsed)} 
        >
          <SideMenu/>
        </Sider>
        <div
            style={{
              padding: '0 24px 24px',
              textAlign: 'center',
              background: "#fff",
              borderRadius: "10px",
              minHeight: '360px',
            }}
          ></div>

        <Content/>
      </Layout>
      <Footer style={{
      position: 'fixed',
      bottom: '0',
      left: '50%',
      textAlign: 'center',
      backgroundColor: 'transparent',  
      height: 48,
      color: '#1890ff'
    }}>
      KhaLe ©2024 v001.000.001.000
    </Footer>    </Layout>
   
  );
}



export default App;