var boardSize; //number of squares in the board
var squareWidthPct; //pct width of square relative to board container
var rowLength; //number of squares per row
var currentMarker; //current player's marker
var player1Marker; //player 1's marker
var player2Marker; //player 2's marker
var player1; //player 1's name
var player2; //player 2's name
var currentPlayer; //current player's name
var firstPlayerClass = 'firstPlayer'; //class of player turn div during player1's turn
var secondPlayerClass = 'secondPlayer'; //class of player turn div during player2's turn
var winClass = 'winner'; //class of player turn div when player wins
var drawClass = 'draw';
var currentClass; //current class of player turn div
var squaresArray; //array all squares
var squaresArrayOpen; //array of available squares
var squareForAI = null; //square to be marked by AI
var AIActive; //whether there is an AI player
var gameOver; //whether the game is over
var stopClick; //whether clicks are prevented
var p1Tally; //number of player 1 wins
var p2Tally; //number of player 2 wins
var AITally; //number of ai wins
var drawTally; //number of draws

$(document).ready(function () { //create default game on first page load
    p1Tally = 0; //set stats variables to 0
    p2Tally = 0;
    AITally = 0;
    drawTally = 0;
    setDefaults(); //set variables to default
    setPlayerTurnTextAndClass(currentPlayer, currentClass); //update player turn div
    generateBoard(boardSize); //generate default board
    $('.boardSquare').click(squareClicked); //add click handler to boardsquares
    $('.newGameButton').click(newGame); //add click handler to newgame button
});
function setDefaults() { //set variables to default values
    squaresArray = []; //set to empty array
    squaresArrayOpen = []; //set to empty array
    boardSize = 9; //3x3 default
    squareWidthPct = 31; //default square width
    rowLength = Math.sqrt(boardSize); //calculate row length
    player1 = 'Player 1'; //default player 1 name
    player2 = 'Player 2'; //default player 2 name
    player1Marker = 'x'; //default player 1 marker
    player2Marker = 'o'; //default player 2 marker
    currentMarker = player1Marker; //set current marker to player 1 marker
    currentPlayer = player1; //set current player to player 1
    currentClass = firstPlayerClass; //set current class to first player class
    removePlayerTurnClass(drawClass);
    removePlayerTurnClass(winClass);
    setPlayerTurnTextAndClass(currentPlayer, currentClass); //update the player turn div
    AIActive = false; //no AI by default
    stopClick = false; //clicks allowed by default
    gameOver = false; //game not over by default

}
function newGame() { //start a new game
    $('.boardSquare').remove(); //remove all the old board squares
    setDefaults(); //set defaults
    var boardSizeInput = $('.boardSizeInput').val(); //store input values in local variables
    var p1Input = $('.p1Input').val();
    var p2Input = $('.p2Input').val();
    var p1Mark = $('.p1Mark').val();
    var p2Mark = $('.p2Mark').val();
    if (boardSizeInput != '') { //if the user entered a board size set the board size accordingly
        boardSize = boardSizeInput * boardSizeInput;
    }
    if ($('.aiCheckbox').prop('checked')) { //if the user checked AI, AI is active
        AIActive = true;
    }
    if (p1Input != '') { //if the user entered a name for player 1, update player1
        player1 = p1Input;
    }
    if (p2Input != '') { //if the user entered a name for player 2, update player2
        player2 = p2Input;
    }
    if (p1Mark != '') { //if the user entered a mark for player 1, update player1Marker
        player1Marker = p1Mark;
    }
    if (p2Mark != '') { //if the user entered a mark for player 2, update player2Marker
        player2Marker = p2Mark;
    }
    currentPlayer = player1; //set current player to player1
    currentClass = firstPlayerClass; //set current class to first player class
    setPlayerTurnTextAndClass(player1, currentClass); //update player turn div
    rowLength = Math.sqrt(boardSize); //calculate row length
    squareWidthPct = 100 / rowLength - 2; //calculate square width
    generateBoard(boardSize); //generate board with new values
    currentMarker = player1Marker; //set current marker to player 1 marker
    var boardSquareFontSize = 96/rowLength - 1.5 + 'vh'; //calculate font size
    $('.boardSquare').css({'font-size': boardSquareFontSize, 'line-height': boardSquareFontSize}); //set font size and line height
    for (var i = 0; i < squaresArray.length; i++) { //loop through the array of squares and reset their marked property to false
        squaresArray[i].setMarked(false);
    }
    $('.boardSquare').click(squareClicked); //add click handler to board squares
}
var Square = function () { //square object
    this.marked = false; //default unmarked
    this.addClass = function (className) { //add a class to a square's div element
        this.element.addClass(className);
    };
    this.removeClass = function (className) { //remove a class from a square's div element
        this.element.removeClass(className);
    };
    this.checkTopLeftMatch = function () { //check if square above and to the left is a match, return it if so, false if not
        var top = this.getTop();
        var topLeft = this.getTopLeft();
        if (topLeft == false) return false;
        return (topLeft.getMarked() == true && this.getMarked() == true && this.getText() == topLeft.getText());
    };
    this.checkTopMatch = function () { //check if square above is a match, return true if so, false if not
        var top = this.getTop();
        if (top == false) return false;
        return (top.getMarked() == true && this.getMarked() == true && this.getText() == top.getText());
    };
    this.checkTopRightMatch = function () { //check if square above and to the right is a match, return true if so, false if not
        var top = this.getTop();
        var topRight = this.getTopRight();
        if (topRight == false) return false;
        return (topRight.getMarked() == true && this.getMarked() == true && this.getText() == topRight.getText());
    };
    this.checkLeftMatch = function () { //check if square to left is a match, return it if so, false if not
        var top = this.getTop();
        var left = this.getLeft();
        if (left == false) return false;
        return (left.getMarked() == true && this.getMarked() == true && this.getText() == left.getText());
    };
    this.checkRightMatch = function () { //check if square to right is a match, return true if so, false if not
        var top = this.getTop();
        var right = this.getRight();
        if (right == false) return false;
        return (right.getMarked() == true && this.getMarked() == true && this.getText() == right.getText());
    };
    this.checkBottomLeftMatch = function () { //check if square below and to left is a match, return true if so, false if not
        var top = this.getTop();
        var bottomLeft = this.getBottomLeft();
        if (bottomLeft == false) return false;
        return (bottomLeft.getMarked() == true && this.getMarked() == true && this.getText() == bottomLeft.getText());
    };
    this.checkBottomMatch = function () { //check if square below is a match, return true if so, false if not
        var top = this.getTop();
        var bottom = this.getBottom();
        if (bottom == false) return false;
        return (bottom.getMarked() == true && this.getMarked() == true && this.getText() == bottom.getText());
    };
    this.checkBottomRightMatch = function () { //check if square below and to right is a match, return it if so, false if not
        var top = this.getTop();
        var bottomRight = this.getBottomRight();
        if (bottomRight == false) return false;
        return (bottomRight.getMarked() == true && this.getMarked() == true && this.getText() == bottomRight.getText());
    };
    this.createDomElement = function (idNum, widthPct) {  //create the div that displays the text
        this.element = $('<div>').addClass('boardSquare');
        this.element.attr('id', idNum);
        this.element.css({'height': widthPct + '%', 'width': widthPct + '%'});
        this.element.addClass('unmarked');
        $('.boardContainer').append(this.element);
    };
    this.getTopLeft = function () { //returns the square above and to the left or false if none
        if (this.getNumber() >= rowLength + 2 && this.getNumber() % rowLength != 1) {
            var topLeftID = this.getNumber() - (rowLength + 1);
            var result = squaresArray.filter(function (square) {
                return square.getNumber() == topLeftID;
            });
            return result[0];
        } else return false;
    };
    this.getTop = function () { //returns the square above or false if none
        if (this.getNumber() > rowLength && this.getNumber() <= boardSize) {
            var topID = this.getNumber() - rowLength;

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == topID;
            });
            return result[0];
        } else return false;
    };
    this.getTopRight = function () { //returns the square above and to the right or false if none
        if (this.getNumber() >= rowLength + 1 && this.getNumber() % rowLength != 0 && this.getNumber() != boardSize) {
            var topRightID = this.getNumber() - (rowLength - 1);

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == topRightID;
            });
            return result[0];
        } else return false;
    };
    this.getLeft = function () { //returns the square to the left or false if none
        if (this.getNumber() % rowLength != 1) {
            var leftID = this.getNumber() - 1;

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == leftID;
            });
            return result[0];
        } else return false;
    };
    this.getRight = function () { //returns the square to the right or false if none
        if (this.getNumber() % rowLength != 0) {
            var rightID = this.getNumber() + 1;

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == rightID;
            });
            return result[0];
        } else return false;
    };
    this.getBottomLeft = function () { //returns the square below and to the left or false if none
        if (this.getNumber() > 1 && this.getNumber() < (boardSize - rowLength) + 1 && this.getNumber() % rowLength != 1) {
            var bottomLeftID = this.getNumber() + (rowLength - 1);

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == bottomLeftID;
            });
            return result[0];
        } else return false;
    };
    this.getBottom = function () { //returns the square below or false if none
        if (this.getNumber() <= boardSize - rowLength) {
            var bottomID = this.getNumber() + rowLength;

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == bottomID;
            });
            return result[0];
        } else return false;
    };
    this.getBottomRight = function () { //returns the square below and to the right or false if none
        if (this.getNumber() < boardSize - rowLength && this.getNumber() % rowLength != 0) {
            var bottomRightID = this.getNumber() + (rowLength + 1);

            var result = squaresArray.filter(function (square) {
                return square.getNumber() == bottomRightID;
            });
            return result[0];
        } else return false;
    };
    this.getNumber = function () { //returns the square's number property
        return this.number;
    };
    this.setNumber = function (num) { //sets the square's number property
        this.number = num;
    };
    this.getText = function () { //returns the square's text property
        return this.text;
    };
    this.setText = function (str) { //sets the square's text property
        this.text = str;
    };
    this.getMarked = function () { //returns the square's marked property
        return this.marked;
    };
    this.setMarked = function (bool) { //sets the square's marked property, remove's class unmarked if true
        this.marked = bool;
        if (bool) this.getElement().toggleClass('unmarked');
    };
    this.getElement = function () { //returns the square's element property
        return this.element;
    };
};

function generateBoard(size) {
    for (var i = 1; i <= size; i++) { //create number of squares
        var square = new Square();
        square.createDomElement(i, squareWidthPct);
        square.setNumber(i);
        squaresArray.push(square);
        squaresArrayOpen.push(square);
        $('#p1Score').text(p1Tally);
        $('#p2Score').text(p2Tally);
        $('#aiScore').text(AITally);
        $('#drawsScore').text(drawTally);
    }
}
function setPlayerTurnTextAndClass(text, className) {
    $('.playerTurn').addClass(className).text(text);
}
function removePlayerTurnClass(className) {
    $('.playerTurn').removeClass(className);
}
function checkForWinVertical(square) {
    var streak = 1;
    var streakAlive = true;
    var currentSquare = square;
    var winningSquaresArray = [];
    if (square.getTop() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkBottomMatch();
            currentSquare = currentSquare.getBottom();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }

                return true;
            }
            streak++;
        }
        return false;
    } else if (square.getBottom() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkTopMatch();
            currentSquare = currentSquare.getTop();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.checkTopMatch()) {
        return checkForWinVertical(square.getTop());
    } else return false;
}
function checkForWinHorizontal(square) {
    var streak = 1;
    var streakAlive = true;
    var currentSquare = square;
    var winningSquaresArray = [];
    if (square.getLeft() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkRightMatch();
            currentSquare = currentSquare.getRight();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.getRight() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkLeftMatch();
            currentSquare = currentSquare.getLeft();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.checkLeftMatch()) {
        return checkForWinHorizontal(square.getLeft());
    } else return false;
}
function checkForWinDiagonalLeftToRight(square) {
    var streak = 1;
    var streakAlive = true;
    var currentSquare = square;
    var winningSquaresArray = [];
    if (square.getTopLeft() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkBottomRightMatch();
            currentSquare = currentSquare.getBottomRight();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.getBottomRight() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkTopLeftMatch();
            currentSquare = currentSquare.getTopLeft();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.checkTopLeftMatch()) {
        return checkForWinDiagonalLeftToRight(square.getTopLeft());
    } else return false;
}
function checkForWinDiagonalRightToLeft(square) {
    var streak = 1;
    var streakAlive = true;
    var currentSquare = square;
    var winningSquaresArray = [];
    if (square.getTopRight() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkBottomLeftMatch();
            currentSquare = currentSquare.getBottomLeft();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.getBottomLeft() == false) {
        while (streakAlive) {
            winningSquaresArray.push(currentSquare);
            streakAlive = currentSquare.checkTopRightMatch();
            currentSquare = currentSquare.getTopRight();
            if (streak == rowLength) {
                for (var i = 0; i < winningSquaresArray.length; i++) {
                    winningSquaresArray[i].addClass('winningSquares');
                }
                return true;
            }
            streak++;
        }
        return false;
    } else if (square.checkTopRightMatch()) {
        return checkForWinDiagonalRightToLeft(square.getTopRight());
    } else return false;
}
function checkForWin(square) {
    return (checkForWinDiagonalLeftToRight(square)) || (checkForWinDiagonalRightToLeft(square)) || (checkForWinHorizontal(square)) || (checkForWinVertical(square));

}
function computerPlayerMarkSquare() {

    if (squaresArrayOpen.length > 0) {
        console.log('open squares: ', squaresArrayOpen);
        // var AI = [];
        // for (i=0; i < squaresArrayOpen.length; i++) {
        //     if (squaresArrayOpen[i].getBottom() != false) {
        //         AI.push(squaresArrayOpen[i+3].getNumber());
        //         console.log(AI);
        //     }
        // }
        // if (clickedSquare.getBottom() != false && clickedSquare.getTop() == false && squaresArray[clickedID - 1 + Math.sqrt(boardSize)].getMarked == false) {
        //     console.log('bottom is available and unmarked');
        // } else {
        //     console.log('bottom is not avail');
        // }
        var randomOpenSquare = Math.floor(Math.random() * squaresArrayOpen.length); // get random # between 0 and current length of squaresArrayOpen
        squareForAI = squaresArrayOpen[randomOpenSquare]; // square to be picked by AI
        var divToMark = squareForAI.getElement();
        $(divToMark).text(currentMarker);
        squareForAI.setMarked(true);
        var squareToRemoveIndex = squaresArrayOpen.indexOf(squareForAI); // get position of square picked in squaresArrayOpen
        squaresArrayOpen.splice(squareToRemoveIndex, 1); // remove square value from squaresArrayOpen;
        if (checkForWin(squareForAI)) {
            removePlayerTurnClass(currentClass);
            setPlayerTurnTextAndClass(currentPlayer + ' wins!', winClass);
            AITally++;
            $('#aiScore').text(AITally);
            gameOver = true;
            stopClick = true;
        }
    }

}
function squareClicked() {
    if (stopClick) {
        if (!gameOver) setPlayerTurnTextAndClass(player2 + ' Thinking');
        return;
    }
    var clickedID = $(this).attr('id');
    var clickedSquare = squaresArray[clickedID - 1];
    if (clickedSquare.getMarked()) return;
    $(this).text(currentMarker);
    clickedSquare.setText(currentMarker);
    clickedSquare.setMarked(true);
    if (checkForWin(clickedSquare)) {
        removePlayerTurnClass(currentClass);
        setPlayerTurnTextAndClass(currentPlayer + ' wins!', winClass);
        if (currentPlayer == player1) {
            p1Tally++;
            $('#p1Score').text(p1Tally);
        } else {
            p2Tally++;
            $('#p2Score').text(p2Tally);
        }
        gameOver = true;
        stopClick = true;
        return;
    }
    var squareToRemoveIndex = squaresArrayOpen.indexOf(clickedSquare); // get position of square picked in squaresArrayOpen
    squaresArrayOpen.splice(squareToRemoveIndex, 1); // remove square value from squaresArrayOpen;
    currentMarker == player1Marker ? currentMarker = player2Marker : currentMarker = player1Marker;
    currentPlayer == player1 ? currentPlayer = player2 : currentPlayer = player1;
    removePlayerTurnClass(currentClass);
    currentClass == firstPlayerClass ? currentClass = secondPlayerClass : currentClass = firstPlayerClass;
    setPlayerTurnTextAndClass(currentPlayer, currentClass);
    if (AIActive && currentMarker == player2Marker) {
        stopClick = true;
        setTimeout(function () {

            computerPlayerMarkSquare();
            if (!gameOver) {
                stopClick = false;
                currentMarker = player1Marker;
                currentPlayer = player1;
                removePlayerTurnClass(currentClass);
                currentClass = firstPlayerClass;
                setPlayerTurnTextAndClass(currentPlayer, currentClass);
            }
        }, 1000);

    }
    if (squaresArrayOpen.length == 0) {
        drawTally++;
        $('#drawsScore').text(drawTally);
        setPlayerTurnTextAndClass('Cat\'s Game!', drawClass);
        gameOver = true;
        stopClick = true;
    }
}

