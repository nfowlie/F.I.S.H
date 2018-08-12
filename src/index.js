const electron = require('electron');
const path = require('path');
const url = require('url');
const BrowserWindow = electron.remote.BrowserWindow;
const ipc = electron.ipcRenderer;
const itemStart = '<span><input type="checkbox" class="regular-checkbox">';
const itemEnd = '</input></span>';

let win;

var container = document.getElementById("container");
var settingsContainer = document.getElementById("settings-container");
var textBox = document.getElementById("search-box");
var dropDownBtn = document.getElementsByClassName("dropbtn")[0];

const fishBtn = document.getElementById("fish");
fishBtn.addEventListener("click", function (event) {
    container.style.display = "block";
    container.classList.add("fish");
    currentFrequency = "New Tank";
    settingsContainer.classList.remove("visible");
});

const settingsButton = document.getElementById("settings");
settingsButton.addEventListener("click", function (event) {
    exitAdd();
    settingsContainer.classList.toggle("visible");
    setting = !setting;
    getTanks();
});

var exitAdd = function () {
    container.style.display = "none";
    dropDownBtn.textContent = "Frequency";
    currentFrequency = "";
    textBox.textContent = "";
    textBox.value = "";
};

document.getElementById("exit").addEventListener("click", function () {
    exitAdd();
});

var setting = false;

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

flatpickr("#date-picker", {
    altInput: true,
    altFormat: "F j, Y",
    dateFormat: "Y-m-d",
});

var currentFrequency;

var dropdown = document.getElementsByClassName("dropdown")[0];
dropdown.addEventListener("click", function () {
    dropdown.classList.toggle("clicked");
});

var dropdowns = document.querySelectorAll(".dropdown-content > a");

dropdowns.forEach(a => {
    a.dataset.frequency = a.textContent;
    a.addEventListener("click", function () {
        dropDownBtn.textContent = this.dataset.frequency;
        currentFrequency = this.dataset.frequency;
    });
});

db.bulkDocs([
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
    }).then(function () {
        getTanks();
    });
};

var currentTank;

var deleteTask = function (thisTask, tankOrTask) {
    if (tankOrTask === "tank") {
        db.allDocs({
            include_docs: true,
            attachments: true
        }).then(function (result) {
            result.rows.forEach(function (r) {
                if (r.doc.tank === thisTask) {
                    r.doc._deleted = true;
                    db.put(r.doc);
                }
            });
            getTanks();
        });
    }
    else if (tankOrTask === "task") {
        db.get(thisTask).then(function (doc) {
            doc._deleted = true;
            return db.put(doc);
        }).then(function () {
            getTanks();
        });
    }
};

var getTanks = function (type) {
    var tankList = {};

    db.allDocs({
        include_docs: true,
        attachments: true
    }).then(function (result) {
        result.rows.forEach(r => {
            if (!tankList.hasOwnProperty(r.doc.tank)) {
                tankList[r.doc.tank] = [];
            }
            tankList[r.doc.tank].push(r.doc);
        });

        settingsContainer.innerHTML = "";

        var fishContainer = document.getElementsByClassName('fish')[0];
        fishContainer.innerHTML = "";

        Object.keys(tankList).forEach(t => {
            var tankContainerD = document.createElement('div');
            tankContainerD.classList.add('tank');

            var tankHeaderD = document.createElement('div');
            tankHeaderD.classList.add('tank-header');

            var tankHeaderDText = document.createElement('div');
            tankHeaderDText.innerHTML += '<div><span class="delete" onclick="deleteTask(\'' + t + '\',\'tank\')"><i class="fas fa-times"></i></span>' + t + '</div>';
            tankHeaderD.appendChild(tankHeaderDText);

            var itemsContainerD = document.createElement('div');
            itemsContainerD.classList.add('items');

            tankContainerD.appendChild(tankHeaderD);
            tankContainerD.appendChild(itemsContainerD);

            tankList[t].forEach(n => {
                if (n.schedule.frequency != "New Tank") {
                    itemsContainerD.innerHTML += '<div><span class="delete" onclick="deleteTask(\'' + n._id + '\',\'task\')"><i class="fas fa-times"></i></span>' + n.task + '</div>';
                }
            });

            settingsContainer.appendChild(tankContainerD);

            var tankContainer = document.createElement('div');
            tankContainer.classList.add('tank');

            var tankHeader = document.createElement('div');
            tankHeader.classList.add('tank-header');

            var tankHeaderText = document.createElement('div');
            tankHeaderText.textContent = t;

            var tankHeaderButton = document.createElement('div');
            tankHeaderButton.classList.add('tank-header-button');
            tankHeaderButton.classList.add("fas", "fa-plus-square");
            tankHeaderButton.dataset.tank = t;
            tankHeaderButton.addEventListener('click', function () {
                currentTank = this.dataset.tank;
                container.style.display = "block";
                container.classList.remove("fish");
            });

            tankHeader.appendChild(tankHeaderText);
            tankHeader.appendChild(tankHeaderButton);

            var itemsContainer = document.createElement('div');
            itemsContainer.classList.add('items');

            tankContainer.appendChild(tankHeader);
            tankContainer.appendChild(itemsContainer);

            tankList[t].forEach(n => {
                if (n.schedule.frequency === "Daily") {
                    itemsContainer.innerHTML += itemStart + n.task + itemEnd;
                }
                if (n.schedule.frequency === "Weekly") {
                    var start = luxon.DateTime.fromISO(n.schedule.first);
                    var end = luxon.DateTime.local();
                    var diffInDays = end.diff(start, 'days');
                    if (diffInDays.toObject().days % 7 < 1 && diffInDays.toObject().days > 0) {
                        itemsContainer.innerHTML += itemStart + n.task + itemEnd;
                    }
                }
                if (n.schedule.frequency === "Monthly") {
                    var start = luxon.DateTime.fromISO(n.schedule.first);
                    var end = luxon.DateTime.local();
                    var diffInDays = end.diff(start, 'days');
                    if (diffInDays.toObject().days % 28 < 1 && diffInDays.toObject().days > 0) {
                        itemsContainer.innerHTML += itemStart + n.task + itemEnd;
                    }
                }
            });
            fishContainer.appendChild(tankContainer);
        });

        var tanks = document.querySelectorAll(".tank");
        if (fishContainer.clientHeight < fishContainer.scrollHeight) {
            tanks.forEach(t => {
                t.classList.add("scroll");
            });
        }
        else {
            tanks.forEach(t => {
                t.classList.remove("scroll");
            });
        }
    }).catch(function (err) {
        console.log(err);
    });
};

var getData = setInterval(getDataInterval, 3600000);

function getDataInterval() {
    getTanks();
}

document.body.addEventListener("touchstart", function () {
    clearInterval(getDataInterval);
});