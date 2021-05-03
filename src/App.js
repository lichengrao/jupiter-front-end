import React, { useEffect, useState } from 'react';
import './App.less';
import { Button, Col, Layout, Menu, message, Row } from 'antd';
import { CustomSearch, Favorites, Home, Login, Register } from './components';
import {
  checkValidSession,
  getFavoriteItem,
  getRecommendations,
  getTopGames,
  logout,
  searchGameById,
} from './utils';
import { LikeOutlined, FireOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';

const { Header, Content, Sider } = Layout;

const App = () => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [topGames, setTopGames] = useState([]);
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

  const onGameSelect = async ({ key }) => {
    if (key === 'Recommendation') {
      const response = await getRecommendations();
      setResources(response);
      return;
    }

    const response = await searchGameById(key);
    setResources(response);
  };

  const customSearchOnSuccess = (data) => {
    setResources(data);
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

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const response = await getTopGames();
        setTopGames(response);
      } catch (err) {
        message.err(err.message);
      }
    };

    onValidSession();
    fetchTopGames();
  }, []);

  useEffect(() => {
    onGameSelect({ key: 'Recommendation' });
  }, [loggedIn]);

  return (
    <Layout style={{ height: '100vh', overflowY: 'hidden' }}>
      <Header>
        <Row justify="space-between">
          <Col>
            {loggedIn && (
              <Favorites
                data={favoriteItems}
                favoriteOnChange={favoriteOnChange}
              />
            )}
          </Col>
          <Col>
            {loggedIn ? (
              <Button shape="round" onClick={signoutOnClick}>
                Logout
              </Button>
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
          width={300}
          breakpoint="lg"
          collapsedWidth="0"
          onBreakpoint={(broken) => {
            console.log(broken);
          }}
          onCollapse={(collapsed, type) => {
            console.log(collapsed, type);
          }}
          className="site-layout-background"
        >
          <CustomSearch onSuccess={customSearchOnSuccess} />
          <Menu
            mode="inline"
            onSelect={onGameSelect}
            style={{ marginTop: '10px' }}
            defaultSelectedKeys={['Recommendation']}
          >
            <Menu.Item icon={<LikeOutlined />} key="Recommendation">
              Recommended for you!
            </Menu.Item>
            <SubMenu
              icon={<FireOutlined />}
              key="Popular Games"
              title="Popular Games"
              className="site-top-game-list"
            >
              {topGames.map((game) => {
                return (
                  <Menu.Item key={game.id} style={{ height: '50px' }}>
                    <img
                      alt="Placeholder"
                      src={game.box_art_url
                        .replace('{height}', '40')
                        .replace('{width}', '40')}
                      style={{ borderRadius: '50%', marginRight: '20px' }}
                    />
                    <span>{game.name}</span>
                  </Menu.Item>
                );
              })}
            </SubMenu>
          </Menu>
        </Sider>
        <Layout style={{ padding: '24px' }}>
          <Content
            className="site-layout-background"
            style={{
              padding: 24,
              margin: 0,
              height: 1000,
              overflow: 'auto',
            }}
          >
            <Home
              resources={resources}
              loggedIn={loggedIn}
              favoriteItems={favoriteItems}
              favoriteOnChange={favoriteOnChange}
            />
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default App;
