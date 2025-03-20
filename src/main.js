const { app, BrowserWindow, ipcMain } = require('electron/main')
require('electron-reload')(__dirname); // Used for realtime changes
const path = require('node:path');
const { exec } = require('child_process');

const desktopPath = path.join(process.env.USERPROFILE, 'Desktop').replace(/\\/g, '/');

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require('electron-squirrel-startup')) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // and load the index.html of the app.
  mainWindow.loadFile(path.join(__dirname, 'index.html'));

  // Open the DevTools.
  // mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(() => {
  createWindow();

  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

//FUNCTIONS --------------------------------------------------------------------
function run(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(`Error executing command: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`stderr: ${stderr}`);
        return;
      }
      resolve(stdout); // resolve with stdout
    });
  });
}

// IPC --------------------------------------------------------------------------
ipcMain.on('download-all', async (event, links) => {
  for (let i = 0; i < links.length; i++) {
    const command = `yt-dlp -f bestvideo+bestaudio --recode-video mp4 -o "${desktopPath}/%(title)s.%(ext)s" https://www.youtube.com/watch?v=${links[i]}`;
    const output = await run(command);
    console.log(output);
    }
});
