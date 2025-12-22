let accessToken;
let userId;
const CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
const REDIRECT_URI =
  process.env.REACT_APP_SPOTIFY_REDIRECT_URI || `${window.location.origin}/`;
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const AUTH_URL = "https://accounts.spotify.com/authorize";

function base64UrlEncode(buffer) {
  return btoa(String.fromCharCode.apply(null, new Uint8Array(buffer)))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

async function sha256(message) {
  const data = new TextEncoder().encode(message);
  const digest = await window.crypto.subtle.digest("SHA-256", data);
  return digest;
}

async function generateCodeChallenge(codeVerifier) {
  const hashed = await sha256(codeVerifier);
  return base64UrlEncode(hashed);
}

function generateCodeVerifier() {
  const array = new Uint32Array(56);
  window.crypto.getRandomValues(array);
  return Array.from(array, (num) => num.toString(36)).join("").slice(0, 56);
}

// Spotify

const Spotify = {
  async getPlayLists() {
    accessToken = await this.getAccessToken();
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
    const accessToken = await Spotify.getAccessToken();
    const url = "https://api.spotify.com/v1";
    const headers = { Authorization: "Bearer " + accessToken };
    const response = await fetch(`${url}/me`, {
      headers,
    });
    const user = await response.json();
    return user;
  },

  async addTracksToPlayList(playlistId, trackURIs) {
    const accessToken = await Spotify.getAccessToken();
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
    const accessToken = await Spotify.getAccessToken();
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
    const accessToken = await Spotify.getAccessToken();
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
  async requestAuthorization() {
    const codeVerifier =
      window.sessionStorage.getItem("codeVerifier") || generateCodeVerifier();
    window.sessionStorage.setItem("codeVerifier", codeVerifier);

    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const redirectUri = encodeURIComponent(REDIRECT_URI);
    const accessUrl = `${AUTH_URL}?client_id=${CLIENT_ID}&response_type=code&scope=playlist-modify-public&redirect_uri=${redirectUri}&code_challenge_method=S256&code_challenge=${codeChallenge}`;
    window.location.href = accessUrl;
  },
  async getAccessToken() {
    if (accessToken) return accessToken;

    const storedToken = window.sessionStorage.getItem("token");
    const expireDate = window.sessionStorage.getItem("expireDate");
    const refreshToken = window.sessionStorage.getItem("refreshToken");

    const currentDate = Date.now() / 1000;
    const expired = expireDate && expireDate < currentDate;

    if (storedToken && !expired) {
      accessToken = storedToken;
      return accessToken;
    }

    if (expired && refreshToken) {
      const refreshed = await this.refreshAccessToken(refreshToken);
      if (refreshed) return refreshed;
    }

    const url = new URL(window.location.href);
    const authorizationCode = url.searchParams.get("code");
    const codeVerifier = window.sessionStorage.getItem("codeVerifier");

    if (authorizationCode && codeVerifier) {
      const tokenResponse = await this.exchangeCodeForToken(
        authorizationCode,
        codeVerifier
      );
      if (tokenResponse) return tokenResponse;
    }

    await this.requestAuthorization();
  },

  async exchangeCodeForToken(code, codeVerifier) {
    const body = new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: REDIRECT_URI,
      client_id: CLIENT_ID,
      code_verifier: codeVerifier,
    });

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    accessToken = data.access_token;
    const expireDate = Date.now() / 1000 + data.expires_in;
    window.sessionStorage.setItem("token", accessToken);
    window.sessionStorage.setItem("expireDate", expireDate);
    if (data.refresh_token) {
      window.sessionStorage.setItem("refreshToken", data.refresh_token);
    }
    window.history.replaceState({}, document.title, "/");
    return accessToken;
  },

  async refreshAccessToken(refreshToken) {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
      client_id: CLIENT_ID,
    });

    const response = await fetch(TOKEN_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body.toString(),
    });

    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    accessToken = data.access_token;
    const expireDate = Date.now() / 1000 + data.expires_in;
    window.sessionStorage.setItem("token", accessToken);
    window.sessionStorage.setItem("expireDate", expireDate);
    window.history.replaceState({}, document.title, "/");
    return accessToken;
  },

  requestAccessToken() {},
};

export { Spotify };
