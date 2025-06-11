import React from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
import { 
  DashboardOutlined, 
  AppstoreOutlined, 
  HistoryOutlined, 
  BellOutlined,
  UserOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import './StudentLayout.css';

const { Header, Sider, Content } = Layout;

const StudentLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  console.log('StudentLayout rendered');
  console.log('Current location:', location.pathname);
  console.log('Is authenticated:', isAuthenticated);
  console.log('Current user:', currentUser);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
    },
    {
      key: 'settings',
      label: 'Cài đặt',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      onClick: () => {
        // Handle logout here
        navigate('/login');
      }
    },
  ];

  const menuItems = [
    {
      key: '/student/dashboard',
      icon: <DashboardOutlined />,
      label: <Link to="/student/dashboard">Trang chủ</Link>,
    },
    {
      key: '/student/equipment',
      icon: <AppstoreOutlined />,
      label: <Link to="/student/equipment">Danh sách thiết bị</Link>,
    },
    {
      key: '/student/history',
      icon: <HistoryOutlined />,
      label: <Link to="/student/history">Lịch sử mượn</Link>,
    },
  ];

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }} className="student-layout">
      <Sider width={250} theme="light" className="layout-sider" style={{ cursor: 'pointer' }}>
        <div className="logo-container" style={{ cursor: 'pointer' }}>
          <h1 className="text-xl font-bold">Quản lý thiết bị</h1>
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="layout-menu"
          style={{ cursor: 'pointer' }}
        />
      </Sider>
      <Layout>
        <Header className="layout-header" style={{ cursor: 'default' }}>
          <div className="text-lg font-semibold">
            {menuItems.find(item => item.key === location.pathname)?.label}
          </div>
          <div className="header-actions" style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <Badge count={5} className="notification-badge" style={{ cursor: 'pointer' }}>
              <BellOutlined className="text-xl" style={{ cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar icon={<UserOutlined />} className="user-avatar" style={{ cursor: 'pointer' }} />
            </Dropdown>
          </div>
        </Header>
        <Content className="layout-content">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;



