let accessToken;
let userId;
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  process.env.REACT_APP_SPOTIFY_REDIRECT_URI ||
  `${window.location.origin}/`;

// Spotify

const Spotify = {
  async getPlayLists() {
    const user = await this.getUser();
    const url = `https://api.spotify.com/v1/users/${user.id}/playlists`;

    const response = fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const playlists = await response.json();
    return playlists;
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) return;
    const user = await this.getUser();
    userId = user.id;
    const playlist = await this.createPlayList(name);
    const playlistId = playlist.id;
    return this.addTracksToPlayList(playlistId, trackURIs);
  },

  async getUser() {
    const accessToken = Spotify.getAccessToken();
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };
    const response = await fetch(`${url}/me`, {
      headers,
    });
    const user = await response.json();
    return user;
  },

  async addTracksToPlayList(playlistId, trackURIs) {
    const accessToken = Spotify.getAccessToken();
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };

    const response = await fetch(
      `${url}/users/${userId}/playlists/${playlistId}/tracks`,
      {
        method: "POST",
        headers,
        body: JSON.stringify({ uris: trackURIs }),
      }
    );
    const result = await response.json();
    return result;
  },
  async createPlayList(name) {
    const accessToken = Spotify.getAccessToken();
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };

    const response = await fetch(`${url}/users/${userId}/playlists`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
    });
    const result = await response.json();
    return result;
  },

  async search(term) {
    const accessToken = Spotify.getAccessToken();
    const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    const settings = {
      headers: { Authorization: "Bearer " + accessToken },
    };
    const response = await fetch(url, settings);
    const jsonData = await response.json();
    if (jsonData.tracks) {
      return jsonData.tracks.items.map((track) => {
        return {
          id: track.id,
          name: track.name,
          artist: track.artists[0].name,
          album: track.album.name,
          uri: track.uri,
          previewUrl: track["preview_url"],
        };
      });
    } else {
      return [];
    }
  },
  requestAuthorization() {
    const redirectUri = encodeURIComponent(REDIRECT_URI);
    const accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${redirectUri}`;
    window.location.href = accessUrl;
  },
  getAccessToken() {
    const storedToken = window.sessionStorage.getItem("token");
    
    // Check if token has expired
    const currentDate = Date.now() / 1000;
    const expired = window.sessionStorage.getItem("expireDate") < currentDate;
    if (accessToken) return accessToken;

    if (storedToken !== "undefined" && !expired && storedToken) {
      accessToken = storedToken;
      return accessToken;
    }

    const url = window.location.href;
    const accessTokenMatch = url.match(/access_token=([^&]*)/);
    const expiresInMatch = url.match(/expires_in=([^&]*)/);

    if (accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1];
      const expiresIn = parseInt(expiresInMatch[1]);
      const expireDate = Date.now() / 1000 + expiresIn;
      window.sessionStorage.setItem("token", accessToken);
      window.sessionStorage.setItem("expireDate", expireDate);
      window.history.replaceState({}, document.title, "/");
      return accessToken;
    }

    this.requestAuthorization();
  },

  requestAccessToken() {},
};

export { Spotify };
