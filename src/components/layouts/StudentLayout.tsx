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
    <Layout
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #e0e7ff 0%, #f0abfc 100%)',
      }}
      className="student-layout"
    >
      <Sider
        width={250}
        theme="light"
        className="layout-sider"
        style={{
          cursor: 'pointer',
          background: 'linear-gradient(135deg, #6366f1 0%, #f472b6 100%)',
          boxShadow: '2px 0 16px 0 rgba(59,130,246,0.08)',
          borderRight: 'none',
          zIndex: 2,
        }}
      >
        <div
          className="logo-container"
          style={{
            cursor: 'pointer',
            padding: '32px 0 16px 0',
            textAlign: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: 28,
            letterSpacing: 1,
            textShadow: '0 2px 8px #a5b4fc',
            background: 'linear-gradient(90deg, #f472b6 0%, #6366f1 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          Quản lý thiết bị
        </div>
        <Menu
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          className="layout-menu"
          style={{
            cursor: 'pointer',
            background: 'transparent',
            color: '#fff',
            fontWeight: 600,
            fontSize: 17,
          }}
          theme="dark"
        />
      </Sider>
      <Layout>
        <Header
          className="layout-header"
          style={{
            cursor: 'default',
            background: 'linear-gradient(90deg, #f472b6 0%, #6366f1 100%)',
            boxShadow: '0 2px 16px 0 rgba(59,130,246,0.10)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            minHeight: 64,
            zIndex: 1,
          }}
        >
          <div
            className="text-lg font-semibold"
            style={{
              color: '#fff',
              fontWeight: 700,
              fontSize: 22,
              letterSpacing: 0.5,
              textShadow: '0 1px 4px #f472b6',
            }}
          >
            {menuItems.find(item => item.key === location.pathname)?.label}
          </div>
          <div className="header-actions" style={{
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            background: 'linear-gradient(90deg, #f472b6 0%, #6366f1 100%)',
            borderRadius: 16,
            boxShadow: '0 2px 16px 0 rgba(236,72,153,0.10)',
            padding: '6px 18px',
          }}>
            <Badge
              count={5}
              className="notification-badge"
              style={{
                background: 'linear-gradient(90deg, #f472b6 0%, #6366f1 100%)',
                color: '#fff',
                boxShadow: '0 2px 8px #f472b6',
                border: '2px solid #fff',
                fontWeight: 700,
                fontSize: 15,
              }}
              offset={[-2, 2]}
            >
              <BellOutlined
                className="text-xl"
                style={{
                  fontSize: 26,
                  color: '#fff',
                  cursor: 'pointer',
                  filter: 'drop-shadow(0 2px 8px #6366f1)',
                  transition: 'color 0.2s, transform 0.2s',
                  padding: 4,
                  borderRadius: '50%',
                  background: 'rgba(255,255,255,0.10)',
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.color = '#f472b6';
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.15)';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.color = '#fff';
                  (e.currentTarget as HTMLElement).style.transform = '';
                }}
              />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <Avatar
                icon={<UserOutlined />}
                className="user-avatar"
                style={{
                  cursor: 'pointer',
                  background: 'linear-gradient(135deg, #6366f1 0%, #f472b6 100%)',
                  color: '#fff',
                  boxShadow: '0 2px 8px #6366f1',
                  border: '2px solid #fff',
                  fontSize: 22,
                  transition: 'transform 0.18s, box-shadow 0.18s',
                }}
                onMouseOver={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'scale(1.08)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px #f472b6';
                }}
                onMouseOut={e => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 8px #6366f1';
                }}
              />
            </Dropdown>
          </div>
        </Header>
        <Content
          className="layout-content"
          style={{
            background: 'rgba(255,255,255,0.95)',
            minHeight: 'calc(100vh - 64px)',
            padding: 32,
            borderRadius: 24,
            margin: 24,
            boxShadow: '0 4px 32px 0 rgba(59,130,246,0.08)',
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default StudentLayout;



