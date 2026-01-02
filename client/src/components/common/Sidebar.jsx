import { Layout, Menu } from 'antd';
import {
  DashboardOutlined,
  ReadOutlined,
  BookOutlined,
  TrophyOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { useLocation, useNavigate } from 'react-router-dom';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    {
      key: '/dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: '/courses',
      icon: <ReadOutlined />,
      label: 'Khóa học',
    },
    {
      key: '/vocabulary',
      icon: <BookOutlined />,
      label: 'Từ vựng',
    },
    {
      key: '/achievements',
      icon: <TrophyOutlined />,
      label: 'Thành tích',
    },
    {
      key: '/profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
  ];

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      width={240}
      theme="light"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
        boxShadow: '2px 0 8px #f0f1f2',
        zIndex: 2,
      }}
    >
      {/* Logo Area */}
      <div className="flex items-center justify-center h-16 border-b border-gray-100 mb-2">
        {collapsed ? (
          <div className="text-2xl font-bold text-blue-600">E</div>
        ) : (
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            Engrisk 🚀
          </div>
        )}
      </div>

      <Menu
        theme="light"
        mode="inline"
        selectedKeys={[location.pathname]} // Highlight menu item đang active
        items={menuItems}
        onClick={({ key }) => navigate(key)}
        style={{ borderRight: 0 }}
      />
    </Sider>
  );
};

export default Sidebar;
