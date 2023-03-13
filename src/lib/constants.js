import { homedir } from 'node:os';
import path from 'node:path';

// Constants:
export const WALLPAPER_FOLDER_NAME = 'Wallpapers'
export const WALLPAPERS_SUBREDDIT  = [
  'http://www.reddit.com/r/wallpapers/new.json?sort=new',
  'http://www.reddit.com/r/midjourney/new.json?sort=new'
];
export const WALLPAPERS_PATH       = path.join(homedir(), 'Pictures', WALLPAPER_FOLDER_NAME);
export const VALID_EXTENSIONS      = ['jpg', 'png'];
export const ORA_OPTIONS           = {
  text: ' Fetching Wallpapers!',
  successText: ' Wallpapers Fetched!',
  failText: ' Fetching Failed!'
};