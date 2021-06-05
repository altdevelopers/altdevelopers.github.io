const GRID_SIZE = 9;
const REMOVE = 50;

let solution = createArray(9, 9);

let textIsVisible = false;
window.addEventListener('load', function() {
    initialize();
});

document.getElementById('submit').addEventListener('click', function() {
    let elements = document.getElementsByTagName('input');
    let k = 0;
    for(let i = 0; i < 9; i++) {
        for(let j = 0; j < 9; j++) {
            let value = parseInt(elements[k].value);
            if(value !== solution[i][j]) {
                textIsVisible = true;
                $('#text').text('That\'s not the correct solution!');
                return;
            }
            k++;
        }
    }
    textIsVisible = true;
    $('#text').text('Correct!');
});

document.getElementById('reset').addEventListener('click', function() {
    initialize();
});

function initialize() {
    textIsVisible = false;
    $('#text').text('');
    let elements = document.getElementsByTagName('input');
    for(let i = 0; i < elements.length; i++) {
        elements[i].classList.add('focus');
        elements[i].removeAttribute('readonly');
        elements[i].classList.remove('bold');
        elements[i].addEventListener('click', function() {
            $('#text').text('');
        });
    }
    let sudoku = generate();
    solveSudoku(sudoku, 0);
    showSudoku(elements, sudoku);
}

function generate() {
    //Fill with zeros
    let sudoku = createArray(9, 9);
    for(let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            sudoku[i][j] = 0;
        }
    }

    //Add ten random numbers
    for(let i = 0; i < 10; i++) {
        sudoku = addNumber(sudoku);
    }

    /*
     * Add random numbers in the first row in addition to random numbers
     * in addition to random numbers on random positions
     */
    sudoku[0][1] = legalNumbers(sudoku, 0, 1);
    sudoku[0][4] = legalNumbers(sudoku, 0, 4);
    sudoku[0][7] = legalNumbers(sudoku, 0, 7);


    //Solve sudoku
    solveSudoku(sudoku, 0);
    for(let i = 0; i < 9; i++) {
        for (let j = 0; j < 9; j++) {
            sudoku[i][j] = solution[i][j];
        }
    }

    /*
     * Remove elements so that sudoku still has unique solution
     */
    let i = 0;
    while(i < REMOVE) {
        let row = Math.floor(Math.random() * 9);
        let col = Math.floor(Math.random() * 9);
        if(sudoku[row][col] !== 0) {
            let cache = sudoku[row][col];
            sudoku[row][col] = 0;
            if(solveSudoku(sudoku, 0) !== 1) {
                /*
                 * Go one step back if sudoku doesn't have unique solution
                 * anymore
                 */
                sudoku[row][col] = cache;
            }
            else {
                i++;
            }
        }
    }
    return sudoku;
}

function createArray(rows, cols) {
    const array = new Array(rows);
    for (let i = 0; i < cols; i++) {
        array[i] = new Array(cols);
    }
    return array;
}

function addNumber(sudoku) {
    /*
     * Find random position to add number
     */
    let row = Math.floor(Math.random() * 9);
    let col = Math.floor(Math.random() * 9);

    /*
     * Add random, but legal number
     */
    sudoku[row][col] = legalNumbers(sudoku, row, col);
    return sudoku;
}

function solveSudoku(sudoku, count) {
    for(let i = 0; i < GRID_SIZE; i++) {
        for (let j = 0; j < GRID_SIZE; j++) {
            /*
             * Only empty fields will be changd
             */
            if(sudoku[i][j] === 0) {
                /*
                 * Try all numbers between 1 and 9
                 */
                for(let n = 1; n <= GRID_SIZE && count < 2; n++) {
                    /*
                     * Is number n safe?
                     */
                    if(checkRow(sudoku, i, n) && checkColumn(sudoku, j, n) && checkBox(sudoku, i, j, n)) {
                        sudoku[i][j] = n;
                        let cache = solveSudoku(sudoku, count);
                        /*
                         * new solution found
                         */
                        if(cache > count) {
                            count = cache;
                            /*
                             * Save new solution
                             */
                            for(let k = 0; k < GRID_SIZE; k++) {
                                for(let l = 0; l < GRID_SIZE; l++) {
                                    if(sudoku[k][l] !== 0) {
                                        solution[k][l] = sudoku[k][l];
                                    }
                                }
                            }
                            sudoku[i][j] = 0;
                        }
                        /*
                         * Not a solution, go one step back
                         */
                        else {
                            sudoku[i][j] = 0;
                        }

                    }
                }
                /*
                 * No other solution found
                 */
                return count;
            }
        }
    }
    /*
     * found another solution
     */
    return count + 1;
}

function showSudoku(elements, sudoku) {
    let k = 0;
    for(let i = 0; i < GRID_SIZE; i++) {
        for(let j = 0; j < GRID_SIZE; j++) {
            if(sudoku[i][j] > 0) {
                elements[k].value = sudoku[i][j];
                elements[k].setAttribute('readonly', 'true');
                elements[k].classList.remove('focus');
                elements[k].classList.add('bold');
            }
            else {
                elements[k].value = '';
            }
            k++;
        }
    }
}


/*
 * Helper functions
 */

function checkRow(sudoku, row, n) {
    for(let i = 0; i < GRID_SIZE; i++) {
        if(sudoku[row][i] === n) {
            return false;
        }
    }
    return true;
}

function checkColumn(sudoku, col, n) {
    for(let i = 0; i < GRID_SIZE; i++) {
        if(sudoku[i][col] === n) {
            return false;
        }
    }
    return true;
}

function checkBox(sudoku, row, col, n) {
    row = row - row % 3;
    col = col - col % 3;
    for(let i = row; i < row + 3; i++) {
        for(let j = col; j < col + 3; j++) {
            if(sudoku[i][j] === n) {
                return false;
            }
        }
    }
    return true;
}

function legalNumbers(sudoku, row, col) {
    let array = [];
    for(let i = 1; i <= 9; i++) {
        if(checkRow(sudoku, row, i) && checkColumn(sudoku, col, i) && checkBox(sudoku, row, col, i)) {
            array.push(i);
            break;
        }
    }
    return array[Math.floor(Math.random() * array.length)];
}

function isNumber(elem, e) {
    if(elem.value.length !== 0) {
        return false;
    }
    let id = e.key;
    let string = '123456789';
    for(let i = 0; i < string.length; i++) {
        if(string.charAt(i) === id) {
            return true;
        }
    }
    return false;
}