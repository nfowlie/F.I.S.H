var write = document.getElementById('search-box'),
    shift = false;

function keyboardPress(e) {
    var key = e,
        character = key.textContent; // If it's a lowercase letter, nothing happens to this variable
    // Shift keys
    if (key.classList.contains('shift')) {
        var arr = document.getElementsByClassName("letter");
        arr = [].slice.call(arr);
        arr.forEach(function (keyLetter) {
            keyLetter.classList.toggle("uppercase");
        });

        var arrSym = document.getElementsByClassName("symbol");
        arrSym = [].slice.call(arrSym);
        arrSym.forEach(function (keySymbol) {
            keySymbol.children[0].classList.toggle("on");
            keySymbol.children[0].classList.toggle("off");
            keySymbol.children[1].classList.toggle("on");
            keySymbol.children[1].classList.toggle("off");
        });

        shift = (shift === true) ? false : true;
        return false;
    }

    // Delete
    if (key.classList.contains('delete')) {
        var html = write.value;

        write.value = html.substr(0, html.length - 1);

        // clearTimeout(delayTimer);
        // delayTimer = setTimeout(function () {
        //     search(document.getElementById("search").firstElementChild);
        // }, 0);
        return false;
    }

    // Number Characters
    if (key.classList.contains('number')) {
        var rowArr = document.getElementsByClassName("symbol");
        rowArr = [].slice.call(rowArr);
        rowArr.forEach(function (keySymbol) {
            keySymbol.classList.toggle("symbol-off");
            keySymbol.classList.toggle("symbol-on");
        });
        return false;
    }

    if (key.classList.contains('symbol')) {
        character = key.querySelector(".off").textContent;
    }

    // Special characters
    if (key.classList.contains('space')) character = ' ';

    // Uppercase letter
    if (key.classList.contains('uppercase')) character = character.toUpperCase();

    // Remove shift once a key is clicked.
    if (shift === true) {
        var shiftArr = document.getElementsByClassName("letter");
        shiftArr = [].slice.call(shiftArr);
        shiftArr.forEach(function (keyLetter) {
            keyLetter.classList.toggle("uppercase");
        });

        var arrSyms = document.getElementsByClassName("symbol");
        arrSyms = [].slice.call(arrSyms);
        arrSyms.forEach(function (keySymbol) {
            keySymbol.children[0].classList.toggle("on");
            keySymbol.children[0].classList.toggle("off");
            keySymbol.children[1].classList.toggle("on");
            keySymbol.children[1].classList.toggle("off");
        });

        shift = false;
    }

    // Add the character
    if (key.textContent != 'return') {
        write.value = write.value + character;
    }
    // searchFocused();

    if (key.textContent === 'return') {
        document.getElementById("container").style.display = "none";
        var dp = document.getElementById("date-picker");
        addToTank({tank: currentTank, task: write.value, first: dp.value, frequency: currentFrequency});
    }

    // clearTimeout(delayTimer);
    // delayTimer = setTimeout(function () {
    //     search(document.getElementById("search").firstElementChild);
    // }, 0);
}

// var delayTimer;

var li = document.getElementsByTagName("LI");
for (var l = 0; l < li.length; l++) {
    li[l].addEventListener("click", function () { keyboardPress(this); }, false);
}