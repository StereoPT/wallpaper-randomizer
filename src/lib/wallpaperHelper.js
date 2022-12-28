import { getWallpaper, setWallpaper } from 'wallpaper';
import imageDownloader from 'image-downloader';
import { unlink } from 'node:fs/promises';
import { oraPromise as ora } from 'ora';
import path from 'node:path';
import random from 'random';
import axios from 'axios';

import {
  WALLPAPERS_SUBREDDIT,
  WALLPAPERS_PATH,
  ORA_OPTIONS,
  VALID_EXTENSIONS
} from './constants.js';

export const getWallpapers = async() => {
  let wallpapers = [];
  const todayDate = new Date().toLocaleDateString('pt-PT').replaceAll('/', '_');

  const {
    data: { data: { children: subredditPosts }}
  } = await ora(axios.get(WALLPAPERS_SUBREDDIT), ORA_OPTIONS);

  for(const { data: post } of subredditPosts) {
    const imageNameExt = post.url.split('/').pop();
    const [imageName, imageExt] = imageNameExt.split('.');
    const newImageName = `${imageName}--${todayDate}.${imageExt}`;

    // Invalid Images don't get Added to the 'wallpapers' Array
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

export const downloadRandomWallpaper = async(wallpapers) => {
  const randomWallpaper = random.choice(wallpapers);
  console.log(` - Current Wallpaper: ${randomWallpaper.title}`);
  console.log(` - Wallpaper Link: ${randomWallpaper.url}`);
  
  await imageDownloader.image({
    url: randomWallpaper.url, dest: randomWallpaper.imageDestination
  });

  return randomWallpaper.imageDestination;
}

export const switchWallpaper = async(newWallpaper) => {
  // TODO: Check Wallpaper Day.
  // Only Remove if days are equal.
  const oldWallpaper = await getWallpaper();  
  await setWallpaper(newWallpaper);
  await unlink(oldWallpaper);
}