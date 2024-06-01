maxRows = 7
leftKeys = document.getElementById('letterCount').querySelectorAll('.key');
num = 5
row = 1
word = ""
AllWords = []
randomWord = ""
input = document.getElementById('myInput');
keyboardKeys = document.getElementById('keyboard').querySelectorAll('.key')
keyboardKeys.forEach(key => {
    key.addEventListener('mousedown', function () {
        document.getElementById('myInput').value += key.textContent
        raahhh()
    })
})

async function getWordList() {
    try {
        const response = await fetch('words.txt');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const text = await response.text();
        return text.split('\r\n').map(word => word.split("/")[0].toUpperCase());
    } catch (error) {
        console.error('There was a problem fetching the file:', error);
        return []; // Handle error or return an empty array
    }
}
(async () => {
    AllWords = await getWordList();
    createBlankGuesses(5);
})();


/*fetch('words.txt')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(text => {
        // Do something with the text content of the file
        text.split('\r\n').forEach(word => {
            splitWord = word.split("/");
            AllWords.push(splitWord[0].toUpperCase())
        });
        document.addEventListener('DOMContentLoaded', createBlankGuesses(5))
    })
    .catch(error => {
        console.error('There was a problem fetching the file:', error);
    }); 
*/
function createBlankGuesses(numOfletters) {
    
    container = document.getElementById('pokusy');
    numOfRows = maxRows; // Change this to the number of times you want to repeat the element

    childDivs = container.querySelectorAll('div');
    fiveLetterWords = AllWords.filter(word => word.length === numOfletters);
    randomIndex = Math.floor(Math.random() * fiveLetterWords.length);
    randomWord = fiveLetterWords[randomIndex];


    childDivs.forEach(childDiv => childDiv.remove());
    document.getElementById('myInput').value = "";

    for (let i = 0; i < numOfRows; i++) {
        const element = document.createElement('div');
        element.classList.add("textRow");
        for (j = 0; j < numOfletters; j++) {
            const child = document.createElement('div');
            child.classList.add('key')
            element.appendChild(child)
        }
        container.appendChild(element);
    }
    leftKeys.forEach(key => key.addEventListener("mousedown", sendNum))


    keys.forEach(key => {
        key.addEventListener('mousedown', changeColor);
        key.addEventListener('mouseup', resetColor);
    });
}

document.addEventListener('DOMContentLoaded', function () {
    input = document.getElementById('myInput');
    // Set focus to the input element
    input.focus();

    // Immediately refocus the input field when it loses focus
    input.addEventListener('blur', function () {
        input.focus();
    });
    input.addEventListener('input', function () {
        raahhh()
    })
    input.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
            enterWord()
        }
    })
});
function raahhh() {
    let curInput = input.value.trim()
    while (curInput.length > num) {
        input.value = curInput = curInput.substring(0, curInput.length - 1)
    }
    word = curInput.toUpperCase();
    updateDisplay();
}

function enterWord() {
    if (word.length == num) {
        if (true) {
            holder = word
         unplacedLetters = randomWord
            let boxes = document.getElementById('pokusy').querySelector(`.textRow:nth-child(${row})`)
            for (let i = 0; i < num; i++) {
                if (word[i] == randomWord[i]) {
                    nthKey = boxes.querySelector(`.key:nth-child(${i + 1})`)
                    nthKey.classList.add("green")
                    keyboardKeys.forEach(key => { if (key.textContent == word[i]) { key.classList.add('green') } })
                    unplacedLetters = unplacedLetters.substring(0, i) + '_' + unplacedLetters.substring(i + 1)
                    holder = holder.substring(0, i) + '_' + holder.substring(i + 1)
                }
            }

            for (let i = 0; i < num; i++) {
                if (unplacedLetters.includes(holder[i]) && holder[i] != '_') {
                    nthKey = boxes.querySelector(`.key:nth-child(${i + 1})`)
                    nthKey.classList.add("yellow")
                    keyboardKeys.forEach(key => { if (key.textContent == word[i]) { key.classList.add('yellow') } })
                    unplacedLetters = unplacedLetters.replace(holder[i], '_', 1)
                    holder = holder.substring(0, i) + '_' + holder.substring(i + 1)
                }
            }
            for (let i = 0; i < num; i++) {
                if (holder[i] != '_') {
                    nthKey = boxes.querySelector(`.key:nth-child(${i + 1})`)
                    nthKey.classList.add("gray")
                    keyboardKeys.forEach(key => { if (key.textContent == word[i]) { key.classList.add('gray') } })
                    holder = holder.substring(0, i) + '_' + holder.substring(i + 1)
                }
            }
            checkForWin(boxes)
            row++
            document.getElementById('myInput').value = ''
            word = ""
        }
    }
}

function checkForWin(boxs) {
    if (Array.from(boxs.querySelectorAll('.key')).every(key => key.classList.contains('green'))) {
        alert('you have won')
    }
    else if (row == maxRows) {
        alert('you have lost. Secret word was:' + randomWord)
    }
}

function sendNum(event) {
    const key = event.target
    if (!key.classList.contains('pressed')) {
        if (parseInt(key.textContent)) {
            num = parseInt(key.textContent)
        }
        else {
            num = Math.floor(Math.random() * (9 - 3 + 1)) + 3
        }
    }
    keys = document.getElementById('keyboard').querySelectorAll('.key');
    keys.forEach(key => key.classList.remove('pressed', 'yellow', 'gray', 'green'));
    row=1
    createBlankGuesses(num)
}

function changeColor(event) {
    const key = event.target;
    if (!key.classList.contains('pressed')) {
        key.classList.add('green');
    }
}

function resetColor(event) {
    const key = event.target;
    key.classList.remove('pressed');
    key.classList.remove('yellow');
    key.classList.remove('gray');
    key.classList.remove('green');
}

function updateDisplay() {
    nthRow = document.getElementById('pokusy').querySelector(`.textRow:nth-child(${row})`)
    for (let i = 0; i < num; i++) {
        wrd = word[i]

        nthLetter = nthRow.querySelector(`.key:nth-child(${i + 1})`)
        nthLetter.textContent = wrd

    }
}