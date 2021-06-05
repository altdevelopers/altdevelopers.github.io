"use strict";

class Sudoku {
    constructor() {
        this.board = this.blank_board_array();
    }

    blank_board_array() {
        return [
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0]
        ];
    }

    set_board(board_string) {
        if ( ! board_string.match(/^\d{81}$/m) ) {
            this.board = this.blank_board_array();
            return;
        }

        for ( let row = 0; row <= 8; row++ ) {
            for ( let column = 0; column <= 8; column++ ) {
                this.board[row][column] = board_string.charAt(row*9+column);
            }
        }

    }

    get_board_array() {
        return this.board;
    }

    make_move(row, col, value) {
        this.board[row][col] = value;
    }

    is_legal_move(row, col, value) {
        if ( ! value.match(/^[1-9]$/m) ) {
            return false;
        }

        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[row][i] ) {
                return false;
            }
        }

        for ( let i = 0; i <= 8; i++ ) {
            if ( value == this.board[i][col] ) {
                return false;
            }
        }

        let row_offset = Math.floor(row/3)*3;
        let col_offset = Math.floor(col/3)*3;
        for ( let i = 0 + row_offset; i <= 2 + row_offset; i++ ) {
            for ( let j = 0 + col_offset; j <= 2 + col_offset; j++ ) {
                if ( value == this.board[i][j] ) {
                    return false;
                }
            }
        }

        return true;
    }
};

let game1 = new Sudoku();
let import_string;
let import_button = document.getElementById('import');
let sudoku_squares = createArray(9,9);

for ( let row = 0; row <= 8; row++ ) {
    for ( let col = 0; col <= 8; col++ ) {
        sudoku_squares[row][col] =  document.getElementsByClassName('sudoku')[0].getElementsByTagName('tbody')[0].getElementsByTagName('tr')[row].getElementsByTagName('td')[col].getElementsByTagName('input')[0];
    }
}

import_button.addEventListener("mouseup", function() {
    import_string = document.getElementsByName("import_string")[0].value;
    game1.set_board(import_string);
    print_sudoku_to_webpage(game1);
});

for ( let row = 0; row <= 8; row++ ) {
    for ( let col = 0; col <= 8; col++ ) {
        sudoku_squares[row][col].addEventListener('input', function(e) {
            e.target.classList.remove("invalid");

            if ( ! game1.is_legal_move(row, col, e.target.value) && e.target.value != "" ) {
                e.target.value = "";
                highlight_temporarily(e.target, 2000);
            } else {
                game1.make_move(row, col, e.target.value);
            }
        });
    }
}

function print_sudoku_to_webpage(sudoku_object) {
    let board = sudoku_object.get_board_array();
    clear_webpage_board();
    for ( let row = 0; row <= 8; row++ ) {
        for ( let col = 0; col <= 8; col++ ) {
            if ( board[row][col] != 0 ) {
                let input = sudoku_squares[row][col];
                input.value = board[row][col];
                input.classList.add('imported_square');
            }
        }
    }
}

function clear_webpage_board() {
    for ( let row = 0; row <= 8; row++ ) {
        for ( let col = 0; col <= 8; col++ ) {
            sudoku_squares[row][col].value = "";
            sudoku_squares[row][col].classList.remove('imported_square');
        }
    }
}

function createArray(length) {
    var arr = new Array(length || 0),
        i = length;

    if (arguments.length > 1) {
        var args = Array.prototype.slice.call(arguments, 1);
        while(i--) arr[length-1 - i] = createArray.apply(this, args);
    }

    return arr;
}

function highlight_temporarily(obj, timeout_in_ms){
    obj.classList.add('invalid');
    setTimeout(function(){
        obj.classList.remove('invalid');
    }, timeout_in_ms);
}