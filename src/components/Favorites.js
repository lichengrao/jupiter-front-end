import React, { useState } from 'react';
import { Menu, Button, Drawer, Tooltip, message } from 'antd';
import {
  EyeOutlined,
  YoutubeOutlined,
  VideoCameraOutlined,
  StarFilled,
  DeleteFilled,
} from '@ant-design/icons';
import { deleteFavoriteItem } from '../utils';

const { SubMenu } = Menu;
const MenuKey = {
  Streams: 'streams',
  Videos: 'videos',
  Clips: 'clips',
};

const renderItem = (item, favoriteOnChange) => {
  const unFavOnClick = async () => {
    try {
      await deleteFavoriteItem(item);
      await favoriteOnChange();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <>
      <Menu.Item key={item.id}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <a
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: '500px',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {`${item.broadcaster_name} - ${item.title}`}
          </a>
          <Tooltip title="Remove from favorite list">
            <Button
              shape="round"
              icon={<DeleteFilled style={{ marginRight: '0px' }} />}
              onClick={unFavOnClick}
            />
          </Tooltip>
        </div>
      </Menu.Item>
    </>
  );
};

const Favorites = ({ data, favoriteOnChange }) => {
  const [displayDrawer, setDisplayDrawer] = useState(false);

  const { VIDEO, STREAM, CLIP } = data;

  const onDrawerClose = () => {
    setDisplayDrawer(false);
  };

  const onFavoriteClick = () => {
    setDisplayDrawer(true);
  };

  return (
    <>
      <Button
        type="primary"
        shape="round"
        onClick={onFavoriteClick}
        icon={<StarFilled />}
      >
        My Favorites
      </Button>

      <Drawer
        title="My Favorites"
        placement="right"
        width={720}
        visible={displayDrawer}
        onClose={onDrawerClose}
      >
        <Menu
          mode="inline"
          defaultOpenKeys={[MenuKey.Streams]}
          stype={{ height: '100%', borderRight: 0 }}
          selectable={false}
        >
          <SubMenu key={MenuKey.Streams} icon={<EyeOutlined />} title="Streams">
            {STREAM.map((item) => renderItem(item, favoriteOnChange))}
          </SubMenu>

          <SubMenu
            key={MenuKey.Videos}
            icon={<YoutubeOutlined />}
            title="Videos"
          >
            {VIDEO.map((item) => renderItem(item, favoriteOnChange))}
          </SubMenu>

          <SubMenu
            key={MenuKey.Clips}
            icon={<VideoCameraOutlined />}
            title="Clips"
          >
            {CLIP.map((item) => renderItem(item, favoriteOnChange))}
          </SubMenu>
        </Menu>
      </Drawer>
    </>
  );
};

export default Favorites;
