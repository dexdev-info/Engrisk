import { useState } from 'react';
import { Layout, theme } from 'antd';
import { Outlet } from 'react-router-dom';
import Sidebar from '../common/Sidebar';
import AppHeader from '../common/Header';

const { Content } = Layout;

const MainLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();

    return (
        <Layout className="min-h-screen">
            <Sidebar collapsed={collapsed} />
            <Layout
                style={{
                    marginLeft: collapsed ? 80 : 240,
                    transition: 'all 0.2s',
                    minHeight: '100vh'
                }}
            >
                <AppHeader collapsed={collapsed} setCollapsed={setCollapsed} />

                <Content
                    style={{
                        margin: '24px 16px',
                        padding: 24,
                        minHeight: 280,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                    }}
                >
                    {/* Outlet là nơi nội dung các trang con (Dashboard, Courses...) hiển thị */}
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default MainLayout;