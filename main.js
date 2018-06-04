'use strict';

const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const url = require('url');
const shell = require('electron').shell;
const ipc = require('electron').ipcMain;

// require('electron-reload')(__dirname);

var win;

function createWindow() {
    // Create new window
    win = new BrowserWindow({width: 800, height: 480, frame: false});
    // Load HTML into window
    win.loadURL(url.format({
        pathname: path.join(__dirname, 'src/index.html'),
        protocol: 'file:',
        slashes: true
    }));

    // win.maximize();

    // win.webContents.openDevTools();

    win.on('closed', () => {
        win = null;
    });

    var menu = Menu.buildFromTemplate([
        {
            label: 'Menu',
            submenu: [
                { type: 'separator' },
                {
                    label: 'Exit',
                    click() {
                        app.quit();
                    }
                },
            ]
        },
        {
            label: 'Info',
            click(){
                win.webContents.openDevTools();
            }
        }
    ]);

    Menu.setApplicationMenu(menu);
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (win === null) {
        createWindow();
    }
});