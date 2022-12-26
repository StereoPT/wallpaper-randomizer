import { homedir } from 'node:os';
import path from 'node:path';
import { access, constants, mkdir, unlink } from 'node:fs/promises';

import { oraPromise as ora } from 'ora';
import axios from 'axios';

import arrayShuffle from 'array-shuffle';
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
  } = await ora(axios.get(WALLPAPERS_SUBREDDIT), ORA_OPTIONS);

  for(const { data: post } of subredditPosts) {
    const imageNameExt = post.url.split('/').pop();
    const [imageName, imageExt] = imageNameExt.split('.');
    const newImageName = `${imageName}--${todayDate}.${imageExt}`;

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

  const oldWallpaper = await getWallpaper();
  
  await setWallpaper(randomWallpaper.imageDestination);
  
  await unlink(oldWallpaper);
} catch(error) {
  // Some Error was Found!
  console.error(error);
}