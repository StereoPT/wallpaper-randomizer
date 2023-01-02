import {
  getWallpapers,
  downloadRandomWallpaper,
  switchWallpaper
} from './lib/wallpaperHelper.js';
import { checkWallpaperFolder } from './lib/fileHelper.js';
import { notifyWallpaperChange } from './lib/notifierHelper.js';

console.log('[Wallpaper Randomizer]');
console.log();

// Check for Wallpapers Folder
checkWallpaperFolder();

try {
  const wallpapers = await getWallpapers();
  const randomWallpaper = await downloadRandomWallpaper(wallpapers);
  switchWallpaper(randomWallpaper);
  notifyWallpaperChange();
} catch(error) {
  // Some Error was Found!
  console.error(error);
}

console.log();
