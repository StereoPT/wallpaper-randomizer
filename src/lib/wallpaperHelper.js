import { getWallpaper, setWallpaper } from 'wallpaper';
import imageDownloader from 'image-downloader';
import { unlink } from 'node:fs/promises';
import { oraPromise as ora } from 'ora';
import path from 'node:path';
import random from 'random';
import axios from 'axios';
import { capitalize } from './utils.js';

import {
  WALLPAPERS_SUBREDDIT,
  WALLPAPERS_PATH,
  ORA_OPTIONS,
  VALID_EXTENSIONS
} from './constants.js';

export const getWallpapers = async() => {
  let wallpapers = [];
  const todayDate = new Date().toLocaleDateString('pt-PT').replaceAll('/', '_');

  const subreddit = random.choice(WALLPAPERS_SUBREDDIT);
  const {
    data: { data: { children: subredditPosts }}
  } = await ora(axios.get(`http://www.reddit.com/r/${subreddit}/new.json?sort=new`), ORA_OPTIONS);

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
      imageDestination: path.join(WALLPAPERS_PATH, newImageName),
      date: todayDate,
      subreddit: subreddit
    });
  }

  return wallpapers;
}

export const downloadRandomWallpaper = async(wallpapers) => {
  const randomWallpaper = random.choice(wallpapers);
  console.log(` - Current Wallpaper: ${randomWallpaper.title}`);
  console.log(` - Wallpaper Link: ${randomWallpaper.url}`);
  console.log(` - From: ${capitalize(randomWallpaper.subreddit)}`);
  
  await imageDownloader.image({
    url: randomWallpaper.url, dest: randomWallpaper.imageDestination
  });

  return randomWallpaper;
}

export const switchWallpaper = async(newWallpaper) => {
  const oldWallpaper = await getWallpaper();  
  const oldWallpaperDate = oldWallpaper.split('--').pop().split('.')[0];
  
  await setWallpaper(newWallpaper.imageDestination);

  if(oldWallpaperDate == newWallpaper.date) {
    await unlink(oldWallpaper);
  }
}