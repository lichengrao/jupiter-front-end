import React, { useEffect, useState } from 'react';
import logo from 'logo.svg';
import 'App.less';
import { Button, Col, Layout, message, Row } from 'antd';
import { Favorites, Home, Login, Register } from 'components';
import {
  checkValidSession,
  getFavoriteItem,
  getRecommendations,
  logout,
  searchGameById,
} from 'utils';
import Scrollbars from 'react-custom-scrollbars';
import { SideMenu } from 'components';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [resources, setResources] = useState({
    VIDEO: [],
    STREAM: [],
    CLIP: [],
  });
  const [favoriteItems, setFavoriteItems] = useState({
    VIDEO: [],
    STREAM: [],
    CLIP: [],
  });

  const favoriteOnChange = async () => {
    try {
      const response = await getFavoriteItem();
      setFavoriteItems(response);
    } catch (err) {
      message.error(err.message);
    }
  };

  const signinOnSuccess = async () => {
    try {
      const response = await getFavoriteItem();
      setLoggedIn(true);
      setFavoriteItems(response);
    } catch (err) {
      message.error(err.message);
    }
  };

  const signoutOnClick = async () => {
    try {
      await logout();
      setLoggedIn(false);
      message.success(`Successfully signed out`);
    } catch (err) {
      message.error(err.message);
    }
  };

  const onGameSelect = async ({ key }) => {
    if (key === 'Recommendation') {
      const response = await getRecommendations();
      setResources(response);
      return;
    }

    const response = await searchGameById(key);
    setResources(response);
  };

  // Check to see if there is a valid session in cookie, if yes, log the user in
  useEffect(() => {
    const onValidSession = async () => {
      try {
        const loginResponse = await checkValidSession();
        if (loginResponse) {
          const favoriteResponse = await getFavoriteItem();
          setFavoriteItems(favoriteResponse);
          setLoggedIn(true);
          message.success(`Welcome back ${loginResponse.user_id}`);
        } else {
          setLoggedIn(false);
        }
      } catch (err) {
        message.error(err.message);
      }
    };
    onValidSession();
  }, []);

  useEffect(() => {
    onGameSelect({ key: 'Recommendation' });
  }, [loggedIn]);

  const renderThumb = ({ style, ...props }) => {
    const thumbStyle = {
      borderRadius: 6,
      backgroundColor: 'rgba(255, 255, 255, 0.2)',
    };
    return <div style={{ ...style, ...thumbStyle }} {...props} />;
  };

  const CustomScrollbars = (props) => (
    <Scrollbars
      renderThumbHorizontal={renderThumb}
      renderThumbVertical={renderThumb}
      {...props}
    />
  );

  return (
    <Layout style={{ height: '100vh', userSelect: 'none' }}>
      <Header
        style={{
          background: '#18181b',
          zIndex: '1000',
          borderBottom: '2px solid black',
        }}
      >
        <Row justify="space-between">
          <Col>
            <img src={logo} alt="logo" height="60px" />
          </Col>
          <Col>
            {loggedIn ? (
              <>
                <Button
                  onClick={signoutOnClick}
                  style={{ marginRight: '20px' }}
                >
                  Logout
                </Button>
                <Favorites
                  data={favoriteItems}
                  favoriteOnChange={favoriteOnChange}
                />
              </>
            ) : (
              <>
                <Login onSuccess={signinOnSuccess} />
                <Register />
              </>
            )}
          </Col>
        </Row>
      </Header>
      <Layout>
        <Sider
          style={{ background: '#1f1f23' }}
          width={300}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
        >
          <SideMenu
            setResources={setResources}
            onGameSelect={onGameSelect}
            CustomScrollbars={CustomScrollbars}
          />
          {/* </CustomScrollbars> */}
        </Sider>
        <Layout style={{ padding: '15px', background: '#0e0e10' }}>
          <Content
            style={{
              padding: 24,
              margin: 0,
              height: 1000,
            }}
          >
            <CustomScrollbars
              style={{ height: '100%' }}
              autoHide
              autoHideTimeout={500}
              autoHideDuration={200}
            >
              <Home
                resources={resources}
                loggedIn={loggedIn}
                favoriteItems={favoriteItems}
                favoriteOnChange={favoriteOnChange}
              />
            </CustomScrollbars>
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
