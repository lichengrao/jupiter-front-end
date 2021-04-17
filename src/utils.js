// If you don't want to host your server code and client code together, you can pay AWS to host your server with HTTPS then config the api url endpoints like below
// const SERVER_ORIGIN = '<Your server's url>';

const SERVER_ORIGIN = '';

const loginUrl = `${SERVER_ORIGIN}/login`;

export const login = async (credential) => {
  const response = await fetch(loginUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    body: JSON.stringify(credential),
  });

  if (response.status !== 200) {
    throw Error('Failed to log in');
  }

  return response.json();
};

export const checkValidSession = async () => {
  const response = await fetch(loginUrl, {
    credentials: 'include',
  });

  if (response.status === 200) {
    return response.json();
  } else {
    return false;
  }
};

const registerUrl = `${SERVER_ORIGIN}/register`;

export const register = async (data) => {
  const response = await fetch(registerUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    body: JSON.stringify(data),
  });

  if (response.status !== 200) {
    throw Error('Failed to register');
  }
};

const logoutUrl = `${SERVER_ORIGIN}/logout`;

export const logout = async () => {
  const response = await fetch(logoutUrl, {
    method: 'POST',
    credentials: 'include',
  });

  if (response.status !== 200) {
    throw Error('Failed to log out');
  }
};

const topGamesUrl = `${SERVER_ORIGIN}/game`;

export const getTopGames = async () => {
  const response = await fetch(topGamesUrl);

  if (response.status !== 200) {
    throw Error('Failed to get top games');
  }

  return response.json();
};

const getGameDetailsUrl = `${SERVER_ORIGIN}/game?game_name=`;

const getGameDetails = async (gameName) => {
  const response = await fetch(`${getGameDetailsUrl}${gameName}`);

  if (response.status !== 200) {
    throw Error('Failed to find the game');
  }

  return response.json();
};

const searchGameByIdUrl = `${SERVER_ORIGIN}/search?game_id=`;

export const searchGameById = async (gameId) => {
  const response = await fetch(`${searchGameByIdUrl}${gameId}`);

  if (response.status !== 200) {
    throw Error('Failed to find the game');
  }

  return response.json();
};

export const searchGameByName = async (gameName) => {
  const data = await getGameDetails(gameName);

  if (data && data.id) {
    return searchGameById(data.id);
  }

  throw Error('Failed to find the game');
};

const favoriteItemUrl = `${SERVER_ORIGIN}/favorite`;

export const addFavoriteItem = async (favItem) => {
  const response = await fetch(favoriteItemUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    body: JSON.stringify({ favorite: favItem }),
  });

  if (response.status !== 200) {
    throw Error('Failed to add favorite item');
  }
};

export const deleteFavoriteItem = async (favItem) => {
  const response = await fetch(favoriteItemUrl, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json;charset=UTF-8',
    },
    credentials: 'include',
    body: JSON.stringify({ favorite: favItem }),
  });

  if (response.status !== 200) {
    throw Error('Failed to delete favorite item');
  }
};

export const getFavoriteItem = async () => {
  const response = await fetch(favoriteItemUrl, {
    credentials: 'include',
  });

  if (response.status !== 200) {
    throw Error('Failed to get favorite item');
  }

  return response.json();
};

const getRecommendedItemsUrl = `${SERVER_ORIGIN}/recommendation`;

export const getRecommendations = async () => {
  const response = await fetch(getRecommendedItemsUrl, {
    credentials: 'include',
  });

  if (response.status !== 200) {
    throw Error('Fail to get recommended item');
  }

  return response.json();
};
