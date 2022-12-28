import { access, constants, mkdir } from 'node:fs/promises';
import { WALLPAPERS_PATH } from './constants.js';

export const checkWallpaperFolder = async() => {
  try {
    await access(WALLPAPERS_PATH, constants.F_OK);
  } catch {
    // Wallpaper Folder isn't Found!
    await mkdir(WALLPAPERS_PATH);
  }
}