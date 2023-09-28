import path from 'node:path';
import notifier from 'node-notifier';

export const notifyWallpaperChange = (randomWallpaper) => {
  const iconPath = path.join(process.cwd(), 'src', 'icon.png');
  
  // TODO: Icon doesn't Work
  notifier.notify({
    title: 'Wallpaper Randomizer',
    message:
    `${randomWallpaper.title}
    From: ${randomWallpaper.subreddit}`,
    contentImage: iconPath,
    icon: iconPath,
    timeout: 2
  });
}