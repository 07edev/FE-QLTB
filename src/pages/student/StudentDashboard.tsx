import React, { useEffect, useState } from 'react';
import { Card, Row, Col, List, Tag, Typography, Statistic, Button, Spin, message, Badge } from 'antd';
import { 
  ClockCircleOutlined, 
  CheckCircleOutlined, 
  ExclamationCircleOutlined,
  HistoryOutlined,
  RightOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectCurrentUser, selectIsAuthenticated } from '../../store/slices/authSlice';
import axios from 'axios';
import dayjs from 'dayjs';
import './StudentDashboard.css';

const { Title, Text } = Typography;

interface Notification {
  _id: string;
  type: 'request_submitted' | 'request_approved' | 'request_rejected' | 'return_reminder' | 'system';
  title: string;
  message: string;
  read: boolean;
  requestId?: string;
  createdAt: string;
}

interface UpcomingReturn {
  id: string;
  equipmentName: string;
  returnDate: string;
  isOverdue: boolean;
}

interface BorrowingSummary {
  pending: number;
  active: number;
  overdue: number;
  total: number;
}

const StudentDashboard: React.FC = () => {
  const currentUser = useSelector(selectCurrentUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const navigate = useNavigate();
  
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [upcomingReturns, setUpcomingReturns] = useState<UpcomingReturn[]>([]);
  const [borrowingSummary, setBorrowingSummary] = useState<BorrowingSummary>({
    pending: 0,
    active: 0,
    overdue: 0,
    total: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [notificationsRes, returnsRes, summaryRes] = await Promise.all([
          axios.get('/api/notifications'),
          axios.get('/api/upcoming-returns'),
          axios.get('/api/borrowing-summary')
        ]);

        if (notificationsRes.data.success) {
          setNotifications(notificationsRes.data.data);
        }

        if (returnsRes.data.success) {
          setUpcomingReturns(returnsRes.data.upcomingReturns);
        }

        if (summaryRes.data.success) {
          setBorrowingSummary(summaryRes.data.summary);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        message.error('Có lỗi xảy ra khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
    
    // Refresh data every minute
    const interval = setInterval(fetchDashboardData, 60000);
    return () => clearInterval(interval);
  }, [isAuthenticated, navigate]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'request_approved':
        return <CheckCircleOutlined className="text-green-500" />;
      case 'request_rejected':
        return <ExclamationCircleOutlined className="text-red-500" />;
      case 'return_reminder':
        return <ClockCircleOutlined className="text-yellow-500" />;
      default:
        return <InfoCircleOutlined className="text-blue-500" />;
    }
  };

  if (!isAuthenticated || !currentUser) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Spin size="large" tip="Đang tải..." />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-64px)]">
        <Spin size="large" tip="Đang tải dữ liệu..." />
      </div>
    );
  }

  console.log('Rendering dashboard content');
  return (
    <div className="p-6">
      <Title level={2}>Xin chào, {currentUser.fullName}!</Title>
      
      <Row gutter={[16, 16]} className="mt-6">
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Thông báo mới</Title>}
            extra={<Link to="/student/notifications">Xem tất cả</Link>}
            className="dashboard-card h-full"
          >
            <List
              itemLayout="horizontal"
              dataSource={notifications}
              renderItem={(item) => (
                <List.Item 
                  className={`cursor-pointer hover:bg-gray-50 transition-colors rounded p-2 ${!item.read ? 'bg-blue-50' : ''}`}
                >
                  <List.Item.Meta
                    avatar={getNotificationIcon(item.type)}
                    title={
                      <div className="flex items-center gap-2">
                        <Text strong>{item.title}</Text>
                        {!item.read && <Badge status="processing" />}
                      </div>
                    }
                    description={
                      <div className="space-y-1">
                        <Text>{item.message}</Text>
                        <div>
                          <Text type="secondary" className="text-sm">
                            {dayjs(item.createdAt).format('DD/MM/YYYY HH:mm')}
                          </Text>
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Tổng quan mượn trả</Title>}
            className="dashboard-card"
          >
            <Row gutter={[16, 16]}>
              <Col span={12}>
                <Statistic
                  title="Đang chờ duyệt"
                  value={borrowingSummary.pending}
                  prefix={<ClockCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Đang mượn"
                  value={borrowingSummary.active}
                  prefix={<CheckCircleOutlined />}
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Quá hạn"
                  value={borrowingSummary.overdue}
                  prefix={<ExclamationCircleOutlined />}
                  className="text-red-500"
                />
              </Col>
              <Col span={12}>
                <Statistic
                  title="Tổng số lần mượn"
                  value={borrowingSummary.total}
                  prefix={<HistoryOutlined />}
                />
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={24}>
          <Card 
            title={<Title level={5} style={{ margin: 0 }}>Sắp đến hạn trả</Title>}
            className="dashboard-card"
          >
            <List
              dataSource={upcomingReturns}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      item.isOverdue ? 
                        <ExclamationCircleOutlined className="text-red-500 text-2xl" /> :
                        <ClockCircleOutlined className="text-yellow-500 text-2xl" />
                    }
                    title={item.equipmentName}
                    description={`Hạn trả: ${dayjs(item.returnDate).format('DD/MM/YYYY')}`}
                  />
                  <Link to="/student/my-requests">
                    <Button type="link" icon={<RightOutlined />}>
                      Chi tiết
                    </Button>
                  </Link>
                </List.Item>
              )}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StudentDashboard; 