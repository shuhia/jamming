let accessToken;
let accessUrl;
let CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
let REDIRECT_URI = "http://localhost:3000/";

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
  getUser() {
    return fetch("https://api.spotify.com/v1/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    }).then((res) => res.json());
  },

  savePlaylist(name, trackURIs) {
    if (!name || !trackURIs.length) return;

    const accessToken = Spotify.getAccessToken();
    const headers = { Authorization: "Bearer " + accessToken };

    let userId;

    return fetch("https://api.spotify.com/v1/me", { headers })
      .then((response) => response.json())
      .then((jsonResponse) => {
        userId = jsonResponse.id;
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
          method: "POST",
          headers,
          body: JSON.stringify({ name }),
        })
          .then((response) => response.json())
          .then((jsonResponse) => {
            const playlistId = jsonResponse.id;
            return fetch(
              `https://api.spotify.com/v1/users/${userId}/playlists/${playlistId}/tracks`,
              {
                method: "POST",
                headers,
                body: JSON.stringify({ uris: trackURIs }),
              }
            );
          });
      });
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
        const expresIn = expiresInMatch[1];
        window.setTimeout(() => {
          accessToken = null;
        }, expresIn * 1000);
        window.history.pushState("Access Token", null, "/");
        return accessToken;
      } else {
        accessUrl = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;

        window.location = accessUrl;
      }
    }
  },
};

export { Spotify };
