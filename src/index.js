const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;

let win;

const fishBtn = document.getElementById("fish");
fishBtn.addEventListener("click", function(event){

    // let winChild = new BrowserWindow({parent: win });
    // winChild.show();
    
    // win = new BrowserWindow({width: 1000, height: 800});
    // const viewPath = path.join("file://", __dirname, "views/fish.html");
    // win.loadURL(url.format({
    //     pathname: path.join(__dirname, 'views/fish.html'),
    //     protocol: 'file:',
    //     slashes: true
    // }));
});