let accessToken = null;
let CLIENT_ID = process.env.REACT_APP_SPOTIFY_CLIENT_ID;
let REDIRECT_URI = "http://localhost:3000/";

const Spotify = {
  getAccesToken() {
    if (accessToken) return accessToken;
    else {
      // Check if token has been obtained
      const url = window.location.href;
      const token = url.match(/access_token=([^&]*)/);
      const expire = url.match(/expires_in=([^&]*)/);
      if (token) {
        accessToken = token;
        window.setTimeout(() => {
          accessToken = null;
        }, expire * 1000);
        window.history.pushState("Access Token", null, "/");
      } else {
        //

        window.location.href = `https://accounts.spotify.com/authorize?client_id=${CLIENT_ID}&response_type=token&scope=playlist-modify-public&redirect_uri=${REDIRECT_URI}`;
      }
    }
  },
};

export { Spotify };
