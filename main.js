const games = [
    '070860005000570900005000000780400160060010070043007089000000300007085000600039050',
    '000031020002400009186000000000045008004608200500910000000000482400003100070290000',
    '002090540040500063008004000030040900600020008004010030000100300180009050023080100',
    '702800940300000100086100000097300800000000000008004270000005390001000007065003408',
    '900040005000800900507009264000002000102050809000300000893700506005006000600080001',
    '700420060064300800010059004040000100300000009007000020400890010005002980090065002',
];

const board = document.querySelector('#board');
const panel = document.querySelector('#panel');
const controls = document.querySelector('#controls');
const after = document.querySelector('#after');

const len = 9;
const starter = [0, 1, 2];
const values = [...Array(len).keys()].map((x) => {return x + 1});
let isSelected = false;
let game = [];

createControls = () => {
    let refresh = document.createElement("button");
    refresh.addEventListener("click", () => {
        if (confirm("Are you sure you want to start a new game?")) {initializeGame()};
    });
    refresh.innerHTML = '<i class="fa fa-refresh fa-2x" aria-hidden="true"></i>';
    controls.appendChild(refresh);

    let title = document.createElement("h2");
    title.innerHTML = "Sudoku";
    controls.appendChild(title);

    let check = document.createElement("button");
    check.addEventListener("click", checkGame, false);
    check.innerHTML = '<i class="fa fa-check fa-2x" aria-hidden="true"></i>';
    controls.appendChild(check);

    let theme = document.createElement("button");
    theme.addEventListener("click", toggleTheme, false);
    document.body.classList.add('theme-light');
    theme.id = "theme-toggle";
    theme.innerHTML = '<i class="fa fa-moon-o fa-2x" aria-hidden="true"></i>';
    after.appendChild(theme);

    let about = document.createElement("button");
    about.addEventListener("click", () => {
        window.open('https://www.pavelruzicka.com/', '_blank');
    }, false);
    about.innerHTML = '<i class="fa fa-user fa-2x" aria-hidden="true"></i>';
    after.appendChild(about);
}

createPanel = () => {
    values.forEach(value => {
        let number = document.createElement("div");
        number.innerHTML = value;

        number.addEventListener("click", () => {
            if (isSelected) {updateGame(value)}
        });

        panel.appendChild(number);
    }); 
}

createBoard = () => {
    game.forEach((num, index) => {
        let box = document.createElement("div");
        box.innerHTML = num > 0 ? num : '';
        box.id = index;
        index += 1;
        box.classList = [];

        if (num == 0) {
            box.classList.add('selectable');

            box.addEventListener("click", () => {
                document.querySelectorAll('#board > div.selectable').forEach(toRemoveFrom => {
                    toRemoveFrom.classList.remove('selected');
                });

                box.classList.add('selected');
                isSelected = box.classList.contains('selected') ? true : false;
            });
        }

        board.appendChild(box);
    });
}

initializeGame = () => {

    game = games[Math.floor(Math.random() * games.length)].split('').map(x => {
        return parseInt(x);
    });

    [panel, board, controls, after].forEach(e => {
        while(e.hasChildNodes()) {
            e.removeChild(e.lastChild);
        }
    });

    createControls();
    createPanel();
    createBoard();
}

updateGame = value => {
    let inQuestion = document.querySelector('#board > div.selected');
    inQuestion.innerHTML = value;
    game[inQuestion.id] = value;
}

checkGame = () => {
    checkSort = (a, b) => {
        return a - b;
    }

    firstCheck = () => { // squares
        let truthyIfCorrect = [];

        starter.forEach(i => {
            starter.forEach(j => {
                let base = len * (i + (j / 3)) + len * i * 2;
                let toCheck = [];

                starter.forEach(k => {
                    starter.forEach(l => {
                        toCheck.push(game[base + k * len + l]);
                    });
                });

                truthyIfCorrect.push(toCheck.sort(checkSort).toString() == values.toString());
            });
        });

        return !truthyIfCorrect.includes(false);
    }

    secondCheck = () => { // columns
        let truthyIfCorrect = [];

        values.forEach(i => {
            let toCheck = [];
            values.forEach(j => {
                toCheck.push(game[(j - 1) * len + i - 1]);
            });

            truthyIfCorrect.push(toCheck.sort(checkSort).toString() == values.toString());
        });

        return !truthyIfCorrect.includes(false);
    }

    thirdCheck = () => { // rows
        fullCheck = game;
        let truthyIfCorrect = [];

        values.forEach(() => {
            truthyIfCorrect.push(fullCheck.splice(0, len).sort(checkSort).toString() == values.toString());
        });

        return !truthyIfCorrect.includes(false);
    }

    if (game.includes(0)) {alert("Your sudoku is not complete!")} else {
        if (firstCheck() && secondCheck() && thirdCheck()) {
            alert("Congratulations! You have solved the sudoku!");
        } else {
            alert("You might want to check for errors in your sudoku.");
        }
    }
}

toggleTheme = () => {
    if (document.body.classList.contains('theme-light')) {
        document.body.classList.remove('theme-light');
        document.body.classList.add('theme-dark');
        document.querySelector('#theme-toggle').innerHTML = '<i class="fa fa-lightbulb-o fa-2x" aria-hidden="true"></i>';
    } else {
        document.body.classList.remove('theme-dark');
        document.body.classList.add('theme-light');
        document.querySelector('#theme-toggle').innerHTML = '<i class="fa fa-moon-o fa-2x" aria-hidden="true"></i>';
    }   
}

document.addEventListener("keypress", pressed => {
    if (isSelected && values.includes(parseInt(pressed.key))) {
        updateGame(parseInt(pressed.key));
    }
});

initializeGame();