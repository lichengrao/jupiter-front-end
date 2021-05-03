import React from 'react';
import { Button, Card, List, message, Tabs, Tooltip } from 'antd';
import { StarFilled, StarOutlined } from '@ant-design/icons';
import { addFavoriteItem, deleteFavoriteItem } from '../utils';

const { TabPane } = Tabs;
const tabKeys = {
  Streams: 'stream',
  Videos: 'videos',
  Clips: 'clips',
};

const processUrl = (url) =>
  url
    .replace('%{height}', '252')
    .replace('%{width}', '480')
    .replace('{height}', '252')
    .replace('{width}', '480');

const renderCardTitle = (item, loggedIn, favs, favOnChange) => {
  const title = `${item.broadcaster_name} - ${item.title}`;

  const isFav = favs.find((fav) => fav.id === item.id);

  const favOnClick = async () => {
    if (isFav) {
      try {
        await deleteFavoriteItem(item);
        await favOnChange();
      } catch (err) {
        message.error(err.message);
      }
      return;
    }

    try {
      await addFavoriteItem(item);
      await favOnChange();
    } catch (err) {
      message.error(err.message);
    }
  };

  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: 400,
        }}
      >
        <Tooltip title={title}>
          <a href={item.url} target="_blank" rel="noopener noreferrer">
            {title}
          </a>
        </Tooltip>
      </div>
      {loggedIn && (
        <Tooltip
          title={isFav ? 'Remove from favorite list' : 'Add to favorite list'}
        >
          <Button
            shape="circle"
            icon={isFav ? <StarFilled /> : <StarOutlined />}
            onClick={favOnClick}
          />
        </Tooltip>
      )}
    </div>
  );
};

const renderCardGrid = (data, loggedIn, favs, favOnChange) => {
  return (
    <List
      grid={{ xs: 1, sm: 1, md: 1, lg: 1, xl: 2 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginRight: '20px' }}>
          <Card
            style={{ paddingBottom: '40px' }}
            title={renderCardTitle(item, loggedIn, favs, favOnChange)}
            bordered={false}
            cover={
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <img
                  alt="Placeholder"
                  src={processUrl(item.thumbnail_url)}
                  style={{ width: '100%' }}
                />
              </a>
            }
          />
        </List.Item>
      )}
    />
  );
};

const Home = ({ resources, loggedIn, favoriteItems, favoriteOnChange }) => {
  const { VIDEO, STREAM, CLIP } = resources;
  const {
    VIDEO: favVideos,
    STREAM: favStreams,
    CLIP: favClips,
  } = favoriteItems;

  return (
    <Tabs defaultActiveKey={tabKeys.Streams}>
      <TabPane
        tab="Streams"
        key={tabKeys.Streams}
        style={{ overflow: 'auto' }}
        forceRender={true}
      >
        {renderCardGrid(STREAM, loggedIn, favStreams, favoriteOnChange)}
      </TabPane>
      <TabPane
        tab="Videos"
        key={tabKeys.Videos}
        style={{ overflow: 'auto' }}
        forceRender={true}
      >
        {renderCardGrid(VIDEO, loggedIn, favVideos, favoriteOnChange)}
      </TabPane>
      <TabPane
        tab="Clips"
        key={tabKeys.Clips}
        style={{ overflow: 'auto' }}
        forceRender={true}
      >
        {renderCardGrid(CLIP, loggedIn, favClips, favoriteOnChange)}
      </TabPane>
    </Tabs>
  );
};

export default Home;
