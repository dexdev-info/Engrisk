import { Layout, Button, Avatar, Dropdown, Space, theme, Modal } from 'antd';
import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UserOutlined,
    LogoutOutlined,
    SettingOutlined,
    ExclamationCircleFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { toast } from 'react-toastify';

const { Header } = Layout;
const { confirm } = Modal;

const AppHeader = ({ collapsed, setCollapsed }) => {
    const {
        token: { colorBgContainer },
    } = theme.useToken();
    const navigate = useNavigate();

    // 2. Lấy user và hàm logout từ Context
    const { user, logout } = useAuth();

    // Xử lý đăng xuất với hộp thoại xác nhận
    const handleLogout = () => {
        confirm({
            title: 'Bạn có chắc chắn muốn đăng xuất?',
            icon: <ExclamationCircleFilled />,
            content: 'Phiên làm việc của bạn sẽ kết thúc.',
            okText: 'Đăng xuất',
            okType: 'danger',
            cancelText: 'Hủy',
            onOk: async () => {
                try {
                    await logout();
                    toast.info('Hẹn gặp lại bạn sớm! 👋');
                    navigate('/login');
                } catch (error) {
                    console.error("Logout failed:", error);
                    // Vẫn chuyển về login kể cả khi API lỗi để tránh kẹt user
                    navigate('/login');
                }
            },
        });
    };

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
            onClick: () => navigate('/settings'), // Cần tạo trang này sau
        },
        {
            type: 'divider',
        },
        {
            key: 'logout',
            label: 'Đăng xuất',
            icon: <LogoutOutlined />,
            danger: true,
            onClick: handleLogout, // Gọi hàm xử lý logout
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
                zIndex: 10, // Tăng z-index để không bị nội dung đè lên
                boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
            }}
        >
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

            <Space>
                {/* Dropdown User Menu */}
                <Dropdown menu={{ items: userMenuResult }} placement="bottomRight" arrow trigger={['click']}>
                    <Space className="cursor-pointer hover:bg-gray-50 p-2 rounded-lg transition-colors select-none">
                        {/* Logic hiển thị Avatar: Có ảnh thì hiện ảnh, không thì hiện chữ cái đầu */}
                        {user?.avatar ? (
                            <Avatar src={user.avatar} />
                        ) : (
                            <Avatar style={{ backgroundColor: '#1677ff' }} icon={<UserOutlined />}>
                                {user?.name?.charAt(0)?.toUpperCase()}
                            </Avatar>
                        )}

                        <div className="flex flex-col items-start leading-tight hidden sm:flex">
                            <span className="font-semibold text-gray-800 text-sm">
                                {user?.name || 'User'}
                            </span>
                            <span className="text-xs text-gray-500 capitalize">
                                {user?.role || 'Member'}
                            </span>
                        </div>
                    </Space>
                </Dropdown>
            </Space>
        </Header>
    );
};

export default AppHeader;