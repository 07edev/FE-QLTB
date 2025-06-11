import React from 'react';
import { Alert, Typography } from 'antd';
import { ToolOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface MaintenanceAlertProps {
  message: string;
  className?: string;
  showIcon?: boolean;
}

const MaintenanceAlert: React.FC<MaintenanceAlertProps> = ({ 
  message, 
  className = "mb-4",
  showIcon = true 
}) => {
  return (
    <Alert
      message={
        <div className="flex items-center" style={{ cursor: 'default' }}>
          {showIcon && <ToolOutlined className="mr-2" style={{ cursor: 'default' }} />}
          <Text strong>Hệ thống đang bảo trì</Text>
        </div>
      }
      description={message}
      type="warning"
      showIcon={showIcon}
      icon={showIcon ? <ToolOutlined style={{ cursor: 'default' }} /> : undefined}
      className={className}
      banner
      style={{ cursor: 'default' }}
    />
  );
};

export default MaintenanceAlert;