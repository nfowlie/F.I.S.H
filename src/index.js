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

// var db = new PouchDB('http://127.0.0.1:5984/fish');
var db = new PouchDB('fish');
// db.destroy();

// Config Code
db.get('config').catch(function (err) {
    if (err.name === 'not_found') {
        return {
            _id: 'config',
            background: 'blue',
            forground: 'white',
            sparkly: 'false'
        };
    } else {
        throw err;
    }
}).then(function (configDoc) {
}).catch(function (err) {

});

// db.put({
//     _id: luxon.DateTime.local().toJSON(),
//     tank: '29 Gallon',
//     task: 'Refill tank',
//     schedule: {
//         first: luxon.DateTime.local().toLocaleString(),
//         frequency: ''
//     }
// }).then(function (doc) {
//     console.log(doc);
// });

flatpickr("#date-picker", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
});

var currentFrequency;

var dropdowns = document.querySelectorAll(".dropdown-content > a");

dropdowns.forEach(a => {
    a.dataset.frequency = a.textContent;
    a.addEventListener("click", function () {
        document.getElementsByClassName("dropbtn")[0].textContent = this.dataset.frequency;
        currentFrequency = this.dataset.frequency;
    });
});

db.bulkDocs([
    {
        _id: luxon.DateTime.local().toJSON(),
        tank: '29 Gallon',
        task: 'Refill tank',
        schedule: {
            first: luxon.DateTime.local().toLocaleString(),
            frequency: 'Weekly'
        }
    },
    {
        _id: luxon.DateTime.local().toJSON(),
        tank: '10 Gallon',
        task: 'Refill tank',
        schedule: {
            first: luxon.DateTime.local().toLocaleString(),
            frequency: 'Weekly'
        }
    },
    {
        _id: luxon.DateTime.local().toJSON(),
        tank: 'Chi',
        task: 'Refill tank',
        schedule: {
            first: luxon.DateTime.local().toLocaleString(),
            frequency: 'Weekly'
        }
    }
]).then(function () {
    getTanks();
});

var addToTank = function (newItem) {
    db.put({
        _id: luxon.DateTime.local().toJSON(),
        tank: newItem.tank,
        task: newItem.task,
        schedule: {
            first: newItem.first,
            frequency: newItem.frequency
        }
    });
    getTanks();
};

var currentTank;

var getTanks = function () {
    var fishContainer = document.getElementsByClassName('fish')[0];
    fishContainer.innerHTML = "";
    var tankList = {};

    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        console.log(result);
        result.rows.forEach(r => {
            console.log(r);

            if (!tankList.hasOwnProperty(r.doc.tank)) {
                tankList[r.doc.tank] = [];
            }
            tankList[r.doc.tank].push(r.doc);
        });

        Object.keys(tankList).forEach(t => {
            var tankContainer = document.createElement('div');
            tankContainer.classList.add('tank');

            var tankHeader = document.createElement('div');
            tankHeader.classList.add('tank-header');

            var tankHeaderText = document.createElement('div');
            tankHeaderText.textContent = t;

            var tankHeaderButton = document.createElement('div');
            tankHeaderButton.classList.add('tank-header-button');
            tankHeaderButton.dataset.tank = t;
            tankHeaderButton.addEventListener('click', function () {
                currentTank = this.dataset.tank;
                document.getElementById("container").style.display = "block";
            });

            tankHeader.appendChild(tankHeaderText);
            tankHeader.appendChild(tankHeaderButton);

            var itemsContainer = document.createElement('div');
            itemsContainer.classList.add('items');

            tankContainer.appendChild(tankHeader);
            tankContainer.appendChild(itemsContainer);

            tankList[t].forEach(n => {
                itemsContainer.innerHTML += itemStart + n.task + itemEnd;
            });

            fishContainer.appendChild(tankContainer);
        });
    }).catch(function (err) {
        console.log(err);
    });


    // db.get('').then(function (docs) {
    //     // console.log(docs);
    //     var fishContainer = document.getElementsByClassName('fish')[0];
    //     fishContainer.innerHTML = "";
    //     Object.keys(docs.tank).forEach(t => {
    //         // console.log(t);

    //         var tankContainer = document.createElement('div');
    //         tankContainer.classList.add('tank');

    //         var tankHeader = document.createElement('div');
    //         tankHeader.classList.add('tank-header');

    //         var tankHeaderText = document.createElement('div');
    //         tankHeaderText.textContent = t;

    //         var tankHeaderButton = document.createElement('div');
    //         tankHeaderButton.classList.add('tank-header-button');
    //         tankHeaderButton.dataset.tank = t;
    //         tankHeaderButton.addEventListener('click', function () {
    //             // let winChild = new BrowserWindow({ parent: win });
    //             // winChild.show();

    //             // win = new BrowserWindow({ width: 800, height: 480, frame: false, transparent: true });
    //             // // win = new BrowserWindow({ width: 800, height: 200, frame: false, transparent: true });
    //             // const viewPath = path.join("file://", __dirname, "views/fish.html");
    //             // win.loadURL(url.format({
    //             //     pathname: path.join(__dirname, 'views/fish.html'),
    //             //     protocol: 'file:',
    //             //     slashes: true
    //             // }));
    //             // win.webContents.openDevTools();
    //             currentTank = this.dataset.tank;
    //             document.getElementById("container").style.display = "block";
    //         });

    //         tankHeader.appendChild(tankHeaderText);
    //         tankHeader.appendChild(tankHeaderButton);

    //         var itemsContainer = document.createElement('div');
    //         itemsContainer.classList.add('items');

    //         tankContainer.appendChild(tankHeader);
    //         tankContainer.appendChild(itemsContainer);

    //         docs.tank[t].item.forEach(n => {
    //             // console.log(n);
    //             itemsContainer.innerHTML += itemStart + n + itemEnd;
    //         });

    //         fishContainer.appendChild(tankContainer);
    //     });
    // });
};
// document.getElementsByClassName('items')[0].innerHTML = itemStart + doc.title + itemEnd;
