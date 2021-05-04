import React, { useEffect, useState } from 'react';
import { Button, Card, List, message, Spin, Tabs, Tooltip } from 'antd';
import { LoadingOutlined, StarFilled, StarOutlined } from '@ant-design/icons';
import { addFavoriteItem, deleteFavoriteItem } from '../utils';

const { TabPane } = Tabs;
const { Meta } = Card;

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
        height: '60px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
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

const RenderCardGrid = (data, loggedIn, favs, favOnChange) => {
  const [imgsLoaded, setImgsLoaded] = useState(false);

  useEffect(() => {
    const loadItem = (item) => {
      return new Promise((resolve) => {
        const loadImg = new Image();
        loadImg.src = processUrl(item.thumbnail_url);
        loadImg.onload = () =>
          setTimeout(() => resolve(item.thumbnail_url), 500);
        loadImg.onerror = () =>
          setTimeout(() => resolve(item.thumbnail_url), 2000);
      });
    };

    Promise.all(data.map((item) => loadItem(item)))
      .then(() => setImgsLoaded(true))
      .catch((err) => console.log('Failed to load images', err));
  }, [data]);

  return imgsLoaded ? (
    <List
      grid={{ gutter: 16, xs: 1, sm: 2, md: 2, lg: 2, xl: 3, xxl: 4 }}
      dataSource={data}
      renderItem={(item) => (
        <List.Item style={{ marginRight: '20px', padding: '20px 0px' }}>
          <Card
            bordered={false}
            cover={
              <a href={item.url} target="_blank" rel="noopener noreferrer">
                <div className="stream">
                  <img
                    className="stream__thumbnail"
                    alt="Placeholder"
                    src={processUrl(item.thumbnail_url)}
                    style={{ width: '100%' }}
                  />
                </div>
              </a>
            }
          >
            <Meta title={renderCardTitle(item, loggedIn, favs, favOnChange)} />
          </Card>
        </List.Item>
      )}
    />
  ) : (
    <Spin
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      indicator={<LoadingOutlined style={{ fontSize: 24 }} spin />}
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
        style={{ overflow: 'hidden' }}
        forceRender={true}
      >
        {RenderCardGrid(STREAM, loggedIn, favStreams, favoriteOnChange)}
      </TabPane>
      <TabPane
        tab="Videos"
        key={tabKeys.Videos}
        style={{ overflow: 'hidden' }}
        forceRender={true}
      >
        {RenderCardGrid(VIDEO, loggedIn, favVideos, favoriteOnChange)}
      </TabPane>
      <TabPane
        tab="Clips"
        key={tabKeys.Clips}
        style={{ overflow: 'hidden' }}
        forceRender={true}
      >
        {RenderCardGrid(CLIP, loggedIn, favClips, favoriteOnChange)}
      </TabPane>
    </Tabs>
  );
};

export default Home;
