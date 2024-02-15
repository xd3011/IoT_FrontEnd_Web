'use client'
import "../globals.css";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UploadOutlined,
  LogoutOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { message } from "antd";
import { Layout, Menu, Button, theme } from 'antd';
import { useRouter } from "next/navigation";
const { Header, Sider, Content, Footer } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  let uid: string;
  if (typeof localStorage !== 'undefined') {
    uid = localStorage.getItem('uid') || '';
    if (!uid) {
      console.error('User id not found');
    }
  } else {
    console.error('localStorage is not available');
  }
  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical text-white"> ABCdasbdjkashdj</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={['1']}
          items={[
            {
              key: '1',
              icon: <UserOutlined />,
              label: 'Home',
              onClick: () => router.push('/home'),
            },
            {
              key: '2',
              icon: <VideoCameraOutlined />,
              label: 'Room',
              onClick: () => router.push('/room'),
            },
            {
              key: '3',
              icon: <UploadOutlined />,
              label: 'Device',
              onClick: () => router.push('/device'),
            },
            {
              key: '4',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: async () => {
                const res = await fetch(`http://localhost:5000/api/auth/logout/${uid}`, {
                  method: 'POST',
                  headers: {
                    "Content-Type": "application/json",
                  },
                });
                if (res.ok) {
                  const data = await res.json();
                  localStorage.removeItem('accessToken');
                  localStorage.removeItem('refreshToken');
                  localStorage.removeItem('uid');
                  message.success(data.message);
                  router.push('/login');
                } else {
                  const data = await res.json();
                  message.error(data.error);
                }
              },
            },
          ]}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between">
            <div>
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
            </div>

            <div className="flex"><Button
              type="text"
              icon={collapsed ? <NotificationsIcon /> : <NotificationsIcon />}
              style={{
                fontSize: '16px',
                width: 64,
                height: 64,
              }}
            />
            </div>
          </div>
        </Header>
        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          {children}
        </Content>
        <Footer style={{ padding: 0, background: colorBgContainer }} >ABCD</Footer>
      </Layout>
    </Layout>
  );
}