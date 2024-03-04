'use client'
import "../globals.css";
import NotificationsIcon from '@mui/icons-material/Notifications';
import React, { useEffect, useState, } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  LogoutOutlined,
  UserOutlined,
  HomeOutlined,

} from '@ant-design/icons';
import { Modal, message } from "antd";
import { Layout, Menu, Button, theme, Avatar, Dropdown } from 'antd';
import { useRouter, usePathname } from "next/navigation";
const { Header, Sider, Content, Footer } = Layout;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [showExpiredPopup, setShowExpiredPopup] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const router = useRouter();
  let uid: string;
  let tokenTime: number;

  if (typeof localStorage !== 'undefined') {
    uid = localStorage.getItem('uid') || '';
    tokenTime = parseInt(localStorage.getItem('tokenTime') || '0', 10);
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

  useEffect(() => {
    const handleTokenCheck = () => {
      const currentTime = new Date();
      if (tokenTime < currentTime.getTime()) {
        setShowExpiredPopup(true);
      }
    };
    handleTokenCheck();
    const timer = setInterval(handleTokenCheck, 30 * 60 * 1000);
    return () => clearInterval(timer);
  }, [tokenTime, router]);


  const setSelectedDefault = () => {
    const pathname = usePathname().split('/');
    switch (pathname[1]) {
      case 'home-user':
        return ['1'];
      case 'home':
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
    let indexToken = localStorage.getItem('indexToken');
    const res = await fetch(`http://localhost:5000/api/auth/logout/${uid}`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ indexToken: indexToken }),
    });
    if (res.ok) {
      const data = await res.json();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('tokenTime');
      localStorage.removeItem('indexToken');
      localStorage.removeItem('uid');
      localStorage.removeItem('admin');
      message.success(data.message);
      router.push('/login');
    } else {
      const data = await res.json();
      message.error(data.error);
    }
  }

  return (
    <div>
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
                onClick: () => router.push('/home-user'),
              },
              {
                key: '2',
                icon: <HomeOutlined />,
                label: 'Home',
                onClick: () => router.push('/home'),
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
      <Modal
        title="Phiên Đăng Nhập Đã Hết Hạn"
        visible={showExpiredPopup}
        closable={false}
        footer={null}
        onCancel={() => handleLogout()}
      >
        <div style={{ textAlign: 'center' }}>
          <p style={{ marginBottom: '1rem' }}>Phiên đăng nhập của bạn đã hết hạn.</p>
          <p>Vui lòng đăng nhập lại để tiếp tục sử dụng dịch vụ.</p>
          <Button type="primary" onClick={() => handleLogout()} className="bg-blue-500 mt-2">
            OK
          </Button>
        </div>
      </Modal>

    </div>
  );
}