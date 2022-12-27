import { homedir } from 'node:os';
import path from 'node:path';
import { access, constants, mkdir, unlink } from 'node:fs/promises';

import { oraPromise as ora } from 'ora';
import axios from 'axios';

import random from 'random';
import imageDownloader from 'image-downloader';
import { getWallpaper, setWallpaper } from 'wallpaper';

// Constants:
const WALLPAPER_FOLDER_NAME = 'Wallpapers'
const WALLPAPERS_SUBREDDIT  = 'http://www.reddit.com/r/wallpapers/new.json?sort=new';
const WALLPAPERS_PATH       = path.join(homedir(), 'Pictures', WALLPAPER_FOLDER_NAME);
const VALID_EXTENSIONS      = ['jpg', 'png'];
const ORA_OPTIONS           = {
  text: ' Fetching Wallpapers!',
  successText: ' Wallpapers Fetched!',
  failText: ' Fetching Failed!'
};

// Types || Interfaces
interface Wallpaper {
  title: string;
  url: string;
  imageName: string;
  imageDestination: string;
}

const checkWallpaperFolder = async() => {
  try {
    await access(WALLPAPERS_PATH, constants.F_OK);
  } catch {
    // Wallpaper Folder isn't Found!
    await mkdir(WALLPAPERS_PATH);
  }
}

const getWallpapers = async() => {
  let wallpapers:Wallpaper[] = [];
  const todayDate = new Date().toLocaleDateString('pt-PT').replaceAll('/', '_');

  const {
    data: { data: { children: subredditPosts }}
  } = await ora(axios.get(WALLPAPERS_SUBREDDIT), ORA_OPTIONS);

  for(const { data: post } of subredditPosts) {
    const imageNameExt = post.url.split('/').pop();
    const [imageName, imageExt] = imageNameExt.split('.');
    const newImageName = `${imageName}--${todayDate}.${imageExt}`;

    // Invalid Images don't get Added to the 'images' Array
    if(VALID_EXTENSIONS.indexOf(imageExt) === -1) {
      continue;
    }
    
    wallpapers.push({
      title: post.title,
      url: post.url,
      imageName: newImageName,
      imageDestination: path.join(WALLPAPERS_PATH, newImageName)
    });
  }

  return wallpapers;
}

const downloadRandomWallpaper = async(wallpapers: Wallpaper[]) => {
  const randomWallpaper = random.choice(wallpapers);
  console.log(` - Current Wallpaper: ${randomWallpaper.title}`);
  console.log(` - Wallpaper Link: ${randomWallpaper.url}`);
  
  await imageDownloader.image({
    url: randomWallpaper.url, dest: randomWallpaper.imageDestination
  });

  return randomWallpaper.imageDestination;
}

const switchWallpaper = async(newWallpaper) => {
  // TODO: Check Wallpaper Day.
  // Only Remove if days are equal.
  const oldWallpaper = await getWallpaper();  
  await setWallpaper(newWallpaper);
  await unlink(oldWallpaper);
}

console.log('[Wallpaper Randomizer]');
console.log();

// Check for Wallpapers Folder
checkWallpaperFolder();

try {
  const wallpapers = await getWallpapers();
  const randomWallpaper = await downloadRandomWallpaper(wallpapers);
  switchWallpaper(randomWallpaper);
} catch(error) {
  // Some Error was Found!
  console.error(error);
}