import React, { useState, useEffect } from 'react';
import { message, Menu } from 'antd';
import { CustomSearch } from 'components';
import { getTopGames } from 'utils';
import { LikeOutlined, FireOutlined } from '@ant-design/icons';
import SubMenu from 'antd/lib/menu/SubMenu';

const SideMenu = ({ setResources, onGameSelect, CustomScrollbars }) => {
  const [topGames, setTopGames] = useState([]);
  const [subMenuOpen, setSubMenuOpen] = useState(false);
  const [selectedGame, setSelectedGame] = useState('Recommendation');
  const customSearchOnSuccess = (data) => {
    setResources(data);
  };

  useEffect(() => {
    const fetchTopGames = async () => {
      try {
        const response = await getTopGames();
        setTopGames(response);
      } catch (err) {
        message.error(err.message);
      }
    };

    fetchTopGames();
    console.log('fetching again...');
  }, []);

  const handleGameSelect = async ({ key }) => {
    await onGameSelect({ key });
    setSelectedGame(key);
  };

  const handleSubMenuClick = () => setSubMenuOpen((curState) => !curState);

  return (
    <CustomScrollbars
      style={{ height: '100%' }}
      autoHide
      autoHideTimeout={500}
      autoHideDuration={200}
    >
      <CustomSearch onSuccess={customSearchOnSuccess} />
      <Menu
        mode="inline"
        onSelect={handleGameSelect}
        style={{ marginTop: '10px' }}
        selectedKeys={[selectedGame]}
        openKeys={subMenuOpen && ['Popular Games']}
      >
        <Menu.Item icon={<LikeOutlined />} key="Recommendation">
          Recommended for you!
        </Menu.Item>
        <SubMenu
          icon={<FireOutlined />}
          key="Popular Games"
          title="Popular Games"
          className="site-top-game-list"
          onTitleClick={handleSubMenuClick}
        >
          {topGames.map((game) => {
            return (
              <Menu.Item
                key={game.id}
                style={{
                  height: '50px',
                  margin: '6px 0px',
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                <img
                  alt="Placeholder"
                  src={game.box_art_url
                    .replace('{height}', '40')
                    .replace('{width}', '40')}
                  style={{ borderRadius: '50%', marginRight: '20px' }}
                />
                <span
                  style={{
                    width: '100%',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {game.name}
                </span>
              </Menu.Item>
            );
          })}
        </SubMenu>
      </Menu>
    </CustomScrollbars>
  );
};

export default React.memo(SideMenu);
