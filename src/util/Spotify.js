let accessToken;
let accessUrl;
let CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
let REDIRECT_URI = "http://localhost:3000/";
let userId;
// Spotify

const Spotify = {
  getPlayLists() {
    const token = accessToken;
    const user = this.getUser();

    const playlists = fetch(
      `https://api.spotify.com/v1/users/${user.id}/playlists`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    ).then((response) => response.json());
  },

  async savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) return;

    if (!accessToken) Spotify.getAccessToken();
    const user = await this.getUser();
    userId = user.id;
    const playlist = await this.createPlayList(name);
    const playlistId = playlist.id;
    return await this.addTracksToPlayList(playlistId, trackURIs);
  },

  getUser() {
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };
    return fetch(`${url}/me`, {
      headers,
    }).then((res) => res.json());
  },

  addTracksToPlayList(playlistId, trackURIs) {
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };

    return fetch(`${url}/users/${userId}/playlists/${playlistId}/tracks`, {
      method: "POST",
      headers,
      body: JSON.stringify({ uris: trackURIs }),
    }).then((res) => res.json());
  },
  createPlayList(name) {
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };

    return fetch(`${url}/users/${userId}/playlists`, {
      method: "POST",
      headers,
      body: JSON.stringify({ name }),
    }).then((res) => res.json());
  },

  search(term) {
    const accessToken = Spotify.getAccessToken();
    const url = `https://api.spotify.com/v1/search?type=track&q=${term}`;
    const settings = {
      headers: { Authorization: "Bearer " + accessToken },
    };
    return fetch(url, settings)
      .then((response) => response.json())
      .then((jsonData) => {
        if (!jsonData.tracks) {
          return [];
        } else {
          return jsonData.tracks.items.map((track) => {
            return {
              id: track.id,
              name: track.name,
              artists: track.artists,
              album: track.album.name,
              uri: track.uri,
              previewUrl: track["preview_url"],
            };
          });
        }
      });
  },
  getAccessToken() {
    if (accessToken) return accessToken;
    else {
      // Check if token has been obtained
      const url = window.location.href;
      const accessTokenMatch = url.match(/access_token=([^&]*)/);
      const expiresInMatch = url.match(/expires_in=([^&]*)/);
      if (accessTokenMatch && expiresInMatch) {
        console.log(accessTokenMatch);
        accessToken = accessTokenMatch[1];
        const expiresIn = expiresInMatch[1];
        window.setTimeout(() => {
          accessToken = null;
        }, expiresIn * 1000);
        window.history.pushState("Access Token", null, "/");

        return accessToken;
      } else {
        accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;

        window.location.href = accessUrl;
      }
    }
  },
};

export { Spotify };
