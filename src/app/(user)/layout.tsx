'use client'
import "../globals.css";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useState, } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,

} from '@ant-design/icons';
import { message } from "antd";
import { Layout, Menu, Button, theme, Avatar, Dropdown } from 'antd';
import { useRouter, usePathname } from "next/navigation";
const { Header, Sider, Content, Footer } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [collapsed, setCollapsed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  let uid: string;
  if (typeof localStorage !== 'undefined') {
    uid = localStorage.getItem('uid') || '';
    if (!uid) {
      console.error('User id not found');
      router.push('/login');
      return null;
    }
  } else {
    console.error('localStorage is not available');
    router.push('/login');
    return null;
  }

  const setSelectedDefault = () => {
    const pathname = usePathname().split('/');
    switch (pathname[1]) {
      case 'home':
        return ['1'];
      case 'room':
        return ['2'];
      default:
        return ['0'];
    }
  }

  const handleMenuVisibleChange = (visible: boolean) => {
    setMenuVisible(visible);
  };

  const handleAvatarClick = () => {
    setMenuVisible(true);
  };

  const handleBlur = () => {
    setMenuVisible(false);
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    if (key === 'profile') {
      router.push('/profile')
    } else if (key === 'logout') {
      handleLogout();
    } else if (key === 'changepassword') {
      router.push('/changepassword')
    }
    setMenuVisible(false);
  };

  const handleLogout = async () => {
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
  }

  return (
    <Layout className="min-h-screen">
      <Sider trigger={null} collapsible collapsed={collapsed} style={{ position: 'fixed', height: '100vh' }}>
        <div className="demo-logo-vertical text-white text-3xl flex justify-center mt-6 mb-6">Logo</div>
        <Menu
          theme="dark"
          mode="inline"
          defaultSelectedKeys={setSelectedDefault()}
          items={[
            {
              key: '1',
              icon: <MenuFoldOutlined />,
              label: 'Home User',
              onClick: () => router.push('/home'),
            },
            {
              key: '2',
              icon: <HomeOutlined />,
              label: 'Home',
              onClick: () => router.push('/room'),
            },
            {
              key: '3',
              icon: <LogoutOutlined />,
              label: 'Logout',
              onClick: () => handleLogout()
            },
          ]}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200 }}>
        <Header style={{ padding: 0, background: colorBgContainer }}>
          <div className="flex justify-between">
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

            <div className="flex"><Button
              type="text"
              size="large"
              icon={collapsed ? <NotificationsIcon /> : <NotificationsIcon />}
              style={{
                margin: '12px 0'
              }}
            />
              <Dropdown
                visible={menuVisible}
                onVisibleChange={handleMenuVisibleChange}
                overlay={
                  <Menu onClick={handleMenuClick}>
                    <Menu.Item key="profile">Profile</Menu.Item>
                    <Menu.Item key="changepassword">Change Password</Menu.Item>
                    <Menu.Item key="logout">Logout</Menu.Item>
                  </Menu>
                }
              >
                <div onBlur={handleBlur}>
                  <Button
                    type="text"
                    size="large"
                    style={{
                      padding: '4px',
                      margin: '12px 4px 12px 0'
                    }}
                  >
                    <Avatar
                      size={32}
                      icon={<UserOutlined />}
                      onClick={handleAvatarClick}
                    />
                  </Button>
                </div>
              </Dropdown>
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
        <Footer style={{ textAlign: 'center' }}>
          Design ©{new Date().getFullYear()} Created by XD
        </Footer>
      </Layout>
    </Layout>
  );
}