const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const itemStart = '<span><input type="checkbox" class="regular-checkbox">';
const itemEnd = '</input></span>';

let win;

const fishBtn = document.getElementById("fish");
fishBtn.addEventListener("click", function (event) {

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

var db = new PouchDB('fish');
// db.destroy();
console.log(db);

db.get('tanks').catch(function (err) {
    if (err.name === 'not_found') {
        return {
            _id: 'tanks',
            tank: {}
        };
    } else { // hm, some other error
        throw err;
    }
}).then(function (configDoc) {
    // sweet, here is our configDoc

    console.log(configDoc);
    db.put(
        configDoc
    ).then(function () {
        db.get('tanks').then(function (doc) {
            return db.put({
                _id: 'tanks',
                _rev: doc._rev,
                tank: { '29 Gallon': { item: ['Trim Plants', 'Algae Wafers', 'Frozen Food', 'Fill The Tank', 'Rinse The Sponge'] }, '10 Gallon': { item: [] }, 'Edge': { item: [] }, 'Chi': { item: [] } }
            });
        });
    });
}).catch(function (err) {
    // handle any errors
});

db.get('tanks').then(function (docs) {
    console.log(docs);
    var fishContainer = document.getElementsByClassName('fish')[0];
    fishContainer.innerHTML = "";
    Object.keys(docs.tank).forEach(t => {
        console.log(t);

        var tankContainer = document.createElement('div');
        tankContainer.classList.add('tank');

        var tankHeader = document.createElement('div');
        tankHeader.classList.add('tank-header');

        var tankHeaderText = document.createElement('div');
        tankHeaderText.textContent = t;

        var tankHeaderButton = document.createElement('div');
        tankHeaderButton.classList.add('tank-header-button');
        tankHeaderButton.addEventListener('click', function () {
            // let winChild = new BrowserWindow({ parent: win });
            // winChild.show();

            win = new BrowserWindow({ width: 500, height: 100, frame: false });
            const viewPath = path.join("file://", __dirname, "views/fish.html");
            win.loadURL(url.format({
                pathname: path.join(__dirname, 'views/fish.html'),
                protocol: 'file:',
                slashes: true
            }));
        });

        tankHeader.appendChild(tankHeaderText);
        tankHeader.appendChild(tankHeaderButton);

        var itemsContainer = document.createElement('div');
        itemsContainer.classList.add('items');

        tankContainer.appendChild(tankHeader);
        tankContainer.appendChild(itemsContainer);

        docs.tank[t].item.forEach(n => {
            console.log(n);
            itemsContainer.innerHTML += itemStart + n + itemEnd;
        });

        fishContainer.appendChild(tankContainer);
    });
});




// db.get('mittens').then(function (doc) {
//     return db.remove(doc);
//   });




    // document.getElementsByClassName('items')[0].innerHTML = itemStart + doc.title + itemEnd;
