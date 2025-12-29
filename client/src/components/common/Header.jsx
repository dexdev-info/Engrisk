import { Layout, Button, Avatar, Dropdown, Space, theme } from 'antd';
import { MenuFoldOutlined, MenuUnfoldOutlined, UserOutlined, LogoutOutlined, SettingOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header } = Layout;

const AppHeader = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    // Menu dropdown cho user
    const userMenuResult = [
        {
            key: 'profile',
            label: 'Hồ sơ cá nhân',
            icon: <UserOutlined />,
            onClick: () => navigate('/profile'),
        },
        {
            key: 'settings',
            label: 'Cài đặt',
            icon: <SettingOutlined />,
            onClick: () => navigate('/settings'),
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: () => {
                console.log('Logout clicked');
                navigate('/login');
            },
        },
    ];

    return (
        <Header
            style={{
                padding: '0 16px',
                background: colorBgContainer,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'sticky',
                top: 0,
                zIndex: 1,
                boxShadow: '0 2px 8px #f0f1f2'
            }}
        >
            {/* Nút Toggle Sidebar */}
            <Button
                type="text"
                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={() => setCollapsed(!collapsed)}
                style={{
                    fontSize: '16px',
                    width: 64,
                    height: 64,
                }}
            />

            {/* User Info & Actions */}
            <Space>
                <Dropdown menu={{ items: userMenuResult }} placement="bottomRight" arrow>
                    <Space className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors">
                        <Avatar icon={<UserOutlined />} src="https://api.dicebear.com/7.x/miniavs/svg?seed=1" />
                        <span className="font-medium hidden sm:block">Dex Dev</span>
                    </Space>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default AppHeader;