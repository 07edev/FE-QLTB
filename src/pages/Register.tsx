import { Form, Input, Button, Typography, Divider, message, Select } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../store/slices/authSlice';
import axiosClient from '../api/axiosClient';
import Logo from '../assets/logo.svg';
import '../styles/auth.css';
import { UserOutlined, MailOutlined, LockOutlined, IdcardOutlined, PhoneOutlined, TeamOutlined, BookOutlined } from '@ant-design/icons';
import { AxiosError } from 'axios';

const { Title, Text } = Typography;
const { Option } = Select;

interface RegisterForm {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  studentId: string;
  phone: string;
  faculty: string;
  class: string;
}

interface RegisterResponse {
  success: boolean;
  message: string;
  data?: {
    user: {
      _id: string;
      fullName: string;
      email: string;
      role: 'admin' | 'student';
      studentId?: string;
      phone?: string;
      faculty?: string;
      class?: string;
      isActive: boolean;
      createdAt: string;
      updatedAt: string;
    };
    token: string;
  };
}

const Register = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const onFinish = async (values: RegisterForm) => {
    try {
      // Validate password match
      if (values.password !== values.confirmPassword) {
        message.error('Mật khẩu xác nhận không khớp');
        return;
      }

      // Format dữ liệu đăng ký
      const registerData = {
        fullName: values.fullName.trim(),
        email: values.email.toLowerCase().trim(),
        password: values.password,
        studentId: values.studentId?.trim(),
        phone: values.phone?.trim(),
        faculty: values.faculty?.trim(),
        class: values.class?.trim()
      };

      console.log('Sending register data:', registerData);

      const response = await axiosClient.post<RegisterResponse>('/api/auth/register', registerData);
      
      console.log('Register response:', response.data);
      
      if (response.data?.success && response.data.data?.user && response.data.data?.token) {
        message.success('Đăng ký thành công!');
        dispatch(setCredentials({
          user: response.data.data.user,
          token: response.data.data.token
        }));
        navigate('/student/dashboard', { replace: true });
      }

    } catch (error: any) {
      console.error('Register error:', error);
      message.error(error.response?.data?.message || 'Đăng ký thất bại');
    }
  };

  return (
    <div
      className="auth-page"
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f472b6 0%, #3B82F6 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Hiệu ứng background động */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #f472b6 0%, #3B82F6 100%)',
          filter: 'blur(120px)',
          opacity: 0.25,
          left: -200,
          top: -150,
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'absolute',
          width: 400,
          height: 400,
          borderRadius: '50%',
          background: 'radial-gradient(circle, #3B82F6 0%, #f472b6 100%)',
          filter: 'blur(100px)',
          opacity: 0.18,
          right: -120,
          bottom: -100,
          zIndex: 0,
        }}
      />

      <div
        className="auth-container"
        style={{
          width: 440,
          maxWidth: '98vw',
          background: 'rgba(255,255,255,0.85)',
          borderRadius: 32,
          boxShadow: '0 8px 40px 0 rgba(59,130,246,0.18), 0 2px 8px 0 rgba(236,72,153,0.10)',
          padding: 40,
          border: '2px solid',
          borderImage: 'linear-gradient(90deg, #f472b6 0%, #3B82F6 100%) 1',
          backdropFilter: 'blur(12px)',
          position: 'relative',
          zIndex: 1,
        }}
      >
        <div className="auth-header" style={{ textAlign: 'center', marginBottom: 28 }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <img
              src={Logo}
              alt="Logo"
              className="auth-logo"
              style={{
                width: 72,
                filter: 'drop-shadow(0 0 16px #f472b6) drop-shadow(0 0 8px #3B82F6)',
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.7)',
                padding: 8,
              }}
            />
          </div>
          <Title
            level={2}
            style={{
              background: 'linear-gradient(90deg, #f472b6 0%, #3B82F6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 800,
              marginBottom: 0,
              letterSpacing: 1,
              fontSize: 32,
              textShadow: '0 2px 8px rgba(59,130,246,0.10)',
            }}
          >
            Đăng ký tài khoản
          </Title>
          <Text
            type="secondary"
            style={{
              background: 'linear-gradient(90deg, #3B82F6 0%, #f472b6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
              fontSize: 17,
              letterSpacing: 0.5,
            }}
          >
            Đăng ký tài khoản để mượn thiết bị
          </Text>
        </div>

        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="fullName"
            label="Họ và tên"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input
              prefix={<UserOutlined style={{ color: '#f472b6' }} />}
              placeholder="Nhập họ và tên"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#f472b6',
                background: '#FDF2F8',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input
              prefix={<MailOutlined style={{ color: '#3B82F6' }} />}
              placeholder="Nhập email"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#3B82F6',
                background: '#F0F9FF',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="password"
            label="Mật khẩu"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#3B82F6' }} />}
              placeholder="Nhập mật khẩu"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#3B82F6',
                background: '#F0F9FF',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Xác nhận mật khẩu"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu xác nhận không khớp'));
                },
              }),
            ]}
          >
            <Input.Password
              prefix={<LockOutlined style={{ color: '#f472b6' }} />}
              placeholder="Xác nhận mật khẩu"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#f472b6',
                background: '#FDF2F8',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="studentId"
            label="Mã sinh viên"
            rules={[
              { required: true, message: 'Vui lòng nhập mã sinh viên' },
              { pattern: /^\d+$/, message: 'Mã sinh viên chỉ được chứa số' },
              { min: 3, message: 'Mã sinh viên phải có ít nhất 3 ký tự' }
            ]}
          >
            <Input
              prefix={<IdcardOutlined style={{ color: '#3B82F6' }} />}
              placeholder="Nhập mã sinh viên"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#3B82F6',
                background: '#F0F9FF',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Số điện thoại"
            rules={[
              { pattern: /^[0-9]{10,11}$/, message: 'Số điện thoại không hợp lệ' }
            ]}
          >
            <Input
              prefix={<PhoneOutlined style={{ color: '#f472b6' }} />}
              placeholder="Nhập số điện thoại"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#f472b6',
                background: '#FDF2F8',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="faculty"
            label="Khoa"
            rules={[
              { required: true, message: 'Vui lòng nhập tên khoa' },
              { min: 2, message: 'Tên khoa phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input
              prefix={<TeamOutlined style={{ color: '#3B82F6' }} />}
              placeholder="Nhập tên khoa"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#3B82F6',
                background: '#F0F9FF',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item
            name="class"
            label="Lớp"
            rules={[
              { required: true, message: 'Vui lòng nhập tên lớp' },
              { min: 2, message: 'Tên lớp phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input
              prefix={<BookOutlined style={{ color: '#f472b6' }} />}
              placeholder="Nhập tên lớp"
              size="large"
              style={{
                borderRadius: 12,
                borderColor: '#f472b6',
                background: '#FDF2F8',
                fontWeight: 500,
              }}
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              block
              size="large"
              style={{
                background: 'linear-gradient(90deg, #f472b6 0%, #3B82F6 100%)',
                border: 'none',
                borderRadius: 16,
                fontWeight: 700,
                fontSize: 18,
                boxShadow: '0 2px 16px 0 rgba(59,130,246,0.18), 0 1px 4px 0 rgba(236,72,153,0.10)',
                transition: 'transform 0.15s, box-shadow 0.15s',
              }}
              className="register-btn"
              onMouseOver={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.04)';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 24px 0 #3B82F6, 0 2px 8px 0 #f472b6';
              }}
              onMouseOut={e => {
                (e.currentTarget as HTMLButtonElement).style.transform = '';
                (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 2px 16px 0 rgba(59,130,246,0.18), 0 1px 4px 0 rgba(236,72,153,0.10)';
              }}
            >
              Đăng ký
            </Button>
          </Form.Item>

          <Divider
            style={{
              color: '#f472b6',
              background: 'linear-gradient(90deg, #f472b6 0%, #3B82F6 100%)',
              height: 2,
              border: 'none',
              margin: '24px 0 12px 0',
              borderRadius: 2,
            }}
          >
            <span
              style={{
                background: 'linear-gradient(90deg, #f472b6 0%, #3B82F6 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                fontWeight: 600,
                fontSize: 15,
              }}
            >
              Hoặc
            </span>
          </Divider>

          <div className="auth-links" style={{ textAlign: 'center', color: '#64748b', fontSize: 15, fontWeight: 500 }}>
            Đã có tài khoản?{' '}
            <Link to="/login" style={{
              color: '#3B82F6',
              fontWeight: 700,
              textShadow: '0 1px 4px #f472b6',
              transition: 'color 0.2s',
            }}>Đăng nhập</Link>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default Register;