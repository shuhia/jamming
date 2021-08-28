import { Spotify } from "./Spotify";

test("search method works", async () => {
  const track = await Spotify.search("test");
  expect(track.length).toBeGreaterThan(0);
  console.log(track);
});

test("Get accesstoken", async () => {
  const accessToken = await Spotify.getAccessToken();
  expect(accessToken).toBeDefined();
  console.log(accessToken);
});
