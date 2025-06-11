import React from 'react';
import { Layout, Menu, Badge, Avatar, Dropdown } from 'antd';
import {
  DashboardOutlined,
  AppstoreOutlined,
  UserOutlined,
  SettingOutlined,
  BellOutlined,
  HistoryOutlined,
  LogoutOutlined
} from '@ant-design/icons';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import './AdminLayout.css';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);

  console.log('AdminLayout rendered');
  console.log('Current location:', location.pathname);
  console.log('Is authenticated:', isAuthenticated);
  console.log('Current user:', currentUser);

  const userMenuItems = [
    {
      key: 'profile',
      label: 'Thông tin cá nhân',
      icon: <UserOutlined />,
    },
    {
      key: 'settings',
      label: 'Cài đặt hệ thống',
      icon: <SettingOutlined />,
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: 'Đăng xuất',
      icon: <LogoutOutlined />,
      onClick: () => {
        // Handle logout here
        navigate('/login');
      }
    },
  ];

  const menuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Tổng quan</Link>,
    },
    {
      key: '/admin/equipment',
      icon: <AppstoreOutlined />,
      label: <Link to="/admin/equipment">Quản lý thiết bị</Link>,
    },
    {
      key: '/admin/requests',
      icon: <HistoryOutlined />,
      label: <Link to="/admin/requests">Yêu cầu mượn</Link>,
    },
    {
      key: '/admin/users',
      icon: <UserOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  if (!isAuthenticated || !currentUser) {
    return null;
  }

  return (
    <Layout style={{ minHeight: '100vh' }} className="admin-layout">
      <Sider width={250} theme="light" className="layout-sider" style={{ cursor: 'pointer' }}>
        <div className="logo-container" style={{ cursor: 'pointer' }}>
          <h1 className="text-xl font-bold">Quản lý thiết bị</h1>
          <div className="text-sm text-gray-500">Admin Panel</div>
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
            <Badge count={3} className="notification-badge" style={{ cursor: 'pointer' }}>
              <BellOutlined className="text-xl" style={{ cursor: 'pointer' }} />
            </Badge>
            <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
              <div className="user-info" style={{ cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                <Avatar icon={<UserOutlined />} className="user-avatar" style={{ cursor: 'pointer' }} />
                <span className="ml-2 hidden md:inline">{currentUser.fullName}</span>
              </div>
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

export default AdminLayout;


