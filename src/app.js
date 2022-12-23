import { homedir } from 'node:os';
import path from 'node:path';
import { access, constants, mkdir } from 'node:fs/promises';

import { oraPromise as ora } from 'ora';
import axios from 'axios';

import arrayShuffle from 'array-shuffle';
import imageDownloader from 'image-downloader';
import { setWallpaper } from 'wallpaper';

// Constants:
const WALLPAPER_FOLDER_NAME = 'Wallpapers'
const WALLPAPERS_SUBREDDIT  = 'http://www.reddit.com/r/wallpapers/new.json?sort=new';
const WALLPAPERS_PATH       = path.join(homedir(), 'Pictures', WALLPAPER_FOLDER_NAME);
const VALID_EXTENSIONS      = ['jpg', 'png'];

console.log('[Wallpaper Randomizer]');
console.log();

// Check for Wallpapers Folder
try {
  await access(WALLPAPERS_PATH, constants.F_OK);
} catch {
  // Wallpaper Folder isn't Found!
  await mkdir(WALLPAPERS_PATH);
}

try {
  let images = [];
  const todayDate = new Date().toLocaleDateString('pt-PT').replaceAll('/', '_');

  const {
    data: { data: { children: subredditPosts }}
  } = await ora(axios.get(WALLPAPERS_SUBREDDIT), { text: ' Fetching Wallpapers!', successText: ' Wallpapers Fetched!', failText: ' Fetching Failed!'});

  for(const { data: post } of subredditPosts) {
    const imageName = post.url.split('/').pop();
    const imageExt = imageName.split('.').pop();
    const newImageName = `${todayDate}.${imageExt}`;

    // Invalid Images don't get Added to the 'images' Array
    if(VALID_EXTENSIONS.indexOf(imageExt) === -1) {
      continue;
    }
    
    images.push({
      title: post.title,
      url: post.url,
      imageName: newImageName,
      imageDestination: path.join(WALLPAPERS_PATH, newImageName)
    });
  }

  const [ randomWallpaper ] = arrayShuffle(images);
  console.log(` - Current Wallpaper: ${randomWallpaper.title}`);
  console.log(` - Wallpaper Link: ${randomWallpaper.url}`);
  
  await imageDownloader.image({
    url: randomWallpaper.url, dest: randomWallpaper.imageDestination
  });

  setWallpaper(randomWallpaper.imageDestination);
} catch(error) {
  console.error(error);
}