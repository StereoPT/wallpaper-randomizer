import path from 'node:path';
import notifier from 'node-notifier';

export const notifyWallpaperChange = () => {
  const iconPath = path.join(process.cwd(), 'src', 'icon.png');
  
  // TODO: Icon doesn't Work
  notifier.notify({
    title: 'Wallpaper Randomizer',
    message: 'Wallpaper was Changed!',
    contentImage: iconPath,
    icon: iconPath,
    timeout: 2
  });
}