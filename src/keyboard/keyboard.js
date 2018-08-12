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

        shift = (shift === true) ? false : true;
        return false;
    }

    // Delete
    if (key.classList.contains('delete')) {
        var html = write.value;

        write.value = html.substr(0, html.length - 1);

        return false;
    }

    // Number Characters
    if (key.classList.contains('number')) {
        var rowArr = document.getElementsByClassName("row");
        rowArr = [].slice.call(rowArr);
        rowArr.forEach(function (keySymbol) {
            keySymbol.classList.toggle("symbol-off");
            keySymbol.classList.toggle("symbol-on");
        });
        return false;
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

        shift = false;
    }

    // Add the character
    if (!key.classList.contains('return')) {
        write.value = write.value + character;
    }
    // searchFocused();

    if (key.classList.contains('return')) {
        if (currentFrequency === "New Tank") {
            document.getElementById("container").style.display = "none";
            addToTank({ tank: write.value, task: '', first: luxon.DateTime.local(), frequency: currentFrequency });
        }
        else if(currentFrequency === undefined || currentFrequency === "Cancel") {
            document.getElementById("container").style.display = "none";
        }
        else{
            document.getElementById("container").style.display = "none";
            var dp = document.getElementById("date-picker");
            addToTank({ tank: currentTank, task: write.value, first: luxon.DateTime.fromISO(dp.value).toISO(), frequency: currentFrequency });
        }
        exitAdd();
    }
}

var li = document.getElementsByTagName("LI");
for (var l = 0; l < li.length; l++) {
    li[l].addEventListener("click", function () { keyboardPress(this); }, false);
}