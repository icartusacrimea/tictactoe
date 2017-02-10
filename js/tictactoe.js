/*jshint loopfunc: true */
$(document).ready(function() {
  var game_mode;
  var available_squares = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
  //E = empty
  var game_model = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
  var compendium_of_squares = {
    one: {
      name: "one",
      marked: false,
      symbol: undefined
    },
    two: {
      name: "two",
      marked: false,
      symbol: undefined
    },
    three: {
      name: "three",
      marked: false,
      symbol: undefined
    },
    four: {
      name: "four",
      marked: false,
      symbol: undefined
    },
    five: {
      name: "five",
      marked: false,
      symbol: undefined
    },
    six: {
      name: "six",
      marked: false,
      symbol: undefined
    },
    seven: {
      name: "seven",
      marked: false,
      symbol: undefined
    },
    eight: {
      name: "eight",
      marked: false,
      symbol: undefined
    },
    nine: {
      name: "nine",
      marked: false,
      symbol: undefined
    }
  };

  var player1 = {
    symbol: undefined,
    your_turn: undefined,
    score: 0
  };
  var player2 = {
    symbol: undefined,
    your_turn: undefined,
    score: 0
  };
  var computer = {
    symbol: undefined,
    your_turn: undefined,
    score: 0
  };

  var winner = {
    X: false,
    O: false,
    win_array: undefined
  };

  var tie = false;

  var game_finished = false;

  $('#gameboard, #XorO, .score-reset').hide();
  $('.round-button, .round-button-circle').hide();
  $('#choose_players').show();

  $('#humans').click(function() {
    game_mode = 'humans';
    $('#choose_players').hide();
    $('#XorO').show();
  });

  $('#computer').click(function() {
    game_mode = 'computer';
    $('#choose_players').hide();
    $('#XorO').show();
    $('.player2').text("");
    $('.player2').text("Computer Score: ");
  });

  $(".X").click(function() {
    $('.round-button, .round-button-circle, .score-reset').show();
    $('#choose_players, #XorO').hide();
    $('#gameboard').show();
    if (game_mode === 'humans') {
      player1.symbol = "X";
      player1.your_turn = true;
      player2.symbol = "O";
      player2.your_turn = false;
    } else {
      player1.symbol = "X";
      player1.your_turn = true;
      computer.symbol = "O";
      computer.your_turn = false;
    }
  });

  $(".O").click(function() {
    $('.round-button, .round-button-circle, .score-reset').show();
    $('#choose_players, #XorO').hide();
    $('#gameboard').show();
    if (game_mode === 'humans') {
      player1.symbol = "O";
      player1.your_turn = false;
      player2.symbol = "X";
      player2.your_turn = true;
    } else {
      player1.symbol = "O";
      player1.your_turn = false;
      computer.symbol = "X";
      computer.your_turn = true;
      computer_move();
    }
  });

  $(".one, .two, .three, .four, .five, .six, .seven, .eight, .nine").click(function() {
    //get individual square ID
    var square_class = this.className;

    if (compendium_of_squares[square_class].marked === true) {
      return;
    }
    available_squares.splice(available_squares.indexOf(square_class), 1);

    var idx = document.getElementById(square_class);

    if (player1.your_turn === true) {

      draw(player1, square_class);

      game_model[idx.dataset.idx] = player1.symbol;

      if (check_if_endgame()) {
        if (tie) {
          setTimeout(function() {
            alert("It's a tie!");
          }, 114);
          setTimeout(function() {
            reset_game();
          }, 114);
          tie = false;
          return;
        } else {
          player1.score++;
          $('.player1-score').text(player1.score);
          setTimeout(function() {
            alert("Congratulations, Player 1: you won!");
          }, 114);
          $("." + winner.win_array[0] + ", ." + winner.win_array[1] + ", ." + winner.win_array[2]).css("background", "#963d44");
          setTimeout(function() {
            reset_game();
          }, 114);
          return;
        }
      }

      player1.your_turn = false;

      if (game_mode === 'humans') {
        player2.your_turn = true;
      } else {
        computer.your_turn = true;
        computer_move();
      }

    } else {

      draw(player2, square_class);
      game_model[idx.dataset.idx] = player2.symbol;

      if (check_if_endgame()) {
        if (tie) {
          setTimeout(function() {
            alert("It's a tie!");
          }, 114);
          setTimeout(function() {
            reset_game();
          }, 114);
          tie = false;
          return;
        } else {
          player2.score++;
          $('.player2-score').text(player2.score);
          setTimeout(function() {
            alert("Congratulations, Player 2: you won!");
          }, 114);
          $("." + winner.win_array[0] + ", ." + winner.win_array[1] + ", ." + winner.win_array[2]).css("background", "#963d44");
          setTimeout(function() {
            reset_game();
          }, 114);
          return;
        }
      }

      player2.your_turn = false;
      player1.your_turn = true;

    }
  });

  function draw(player, square_class) {
    $("." + square_class).text(player.symbol);
    compendium_of_squares[square_class].marked = true;
    compendium_of_squares[square_class].symbol = player.symbol;
  }

  function check_if_endgame() {
    var x_count = 0;
    var o_count = 0;
    var x_arr = [];
    var o_arr = [];
    wins_array = [
      ["one", "two", "three"],
      ["four", "five", "six"],
      ["seven", "eight", "nine"],
      ["one", "four", "seven"],
      ["two", "five", "eight"],
      ["three", "six", "nine"],
      ["one", "five", "nine"],
      ["three", "five", "seven"]
    ];

    for (var prop in compendium_of_squares) {
      if (compendium_of_squares[prop].symbol === "X") {
        x_count++;
        x_arr.push(compendium_of_squares[prop].name);
      }
      if (compendium_of_squares[prop].symbol === "O") {
        o_count++;
        o_arr.push(compendium_of_squares[prop].name);
      }
    }

    if (x_count < 3 && o_count < 3) {
      return false;
    }

    check_winner(wins_array, x_arr, o_arr);

    if ((x_count === 5 || o_count === 5) && (winner.X === false && winner.O === false)) {
      tie = true;
      game_finished = true;
    }

    return game_finished;

  }

  function check_winner(wins_array, arr1, arr2) {
    for (var i = 0; i < wins_array.length; i++) {
      var check_x = wins_array[i].every(function(val) {
        return arr1.indexOf(val) >= 0;
      });
      var check_o = wins_array[i].every(function(val) {
        return arr2.indexOf(val) >= 0;
      });
      if (check_x === true) {
        winner.X = true;
        game_finished = true;
        winner.win_array = wins_array[i];
      }
      if (check_o === true) {
        winner.O = true;
        game_finished = true;
        winner.win_array = wins_array[i];
      }
    }
    return game_finished;
  }

  //reset button resets everything
  $('#reset').click(function() {
    game_mode = undefined;

    player1 = {
      symbol: undefined,
      your_turn: undefined,
      score: 0
    };
    player2 = {
      symbol: undefined,
      your_turn: undefined,
      score: 0
    };
    computer = {
      symbol: undefined,
      your_turn: undefined,
      score: 0
    };

    $('.player2').text("");
    $('.player2').text("Player 2 Score: ");
    $('.player1-score').text("0");
    $('.player2-score').text("0");
    $('#gameboard, #reset, .score-reset').hide();
    $('#choose_players').show();

    reset_game();

  });

  function reset_game() {
    available_squares = ["one", "two", "three", "four", "five", "six", "seven", "eight", "nine"];
    game_model = ["E", "E", "E", "E", "E", "E", "E", "E", "E"];
    compendium_of_squares = {
      one: {
        name: "one",
        marked: false,
        symbol: undefined
      },
      two: {
        name: "two",
        marked: false,
        symbol: undefined
      },
      three: {
        name: "three",
        marked: false,
        symbol: undefined
      },
      four: {
        name: "four",
        marked: false,
        symbol: undefined
      },
      five: {
        name: "five",
        marked: false,
        symbol: undefined
      },
      six: {
        name: "six",
        marked: false,
        symbol: undefined
      },
      seven: {
        name: "seven",
        marked: false,
        symbol: undefined
      },
      eight: {
        name: "eight",
        marked: false,
        symbol: undefined
      },
      nine: {
        name: "nine",
        marked: false,
        symbol: undefined
      }
    };

    winner = {
      X: false,
      O: false,
      win_array: undefined
    };

    tie = false;

    game_finished = false;

    $(".one, .two, .three, .four, .five, .six, .seven, .eight, .nine").text("");
    $(".one, .two, .three, .four, .five, .six, .seven, .eight, .nine").css("background", "none");

    if (computer.symbol === "X") {
      computer.your_turn = true;
      computer_move();
    }
  }

  function computer_move() {
    var square_class;
    if (computer.your_turn === true) {

      //Tic-tac-toe strategy from https://en.wikipedia.org/wiki/Tic-tac-toe
      //Computer chooses the first available move from a prioritized list, 
      //as used in Newell and Simon's 1972 tic-tac-toe program
      //1: win (get third square in row);
      //2: block opponent's win; 3: take center square if available
      //4: if opponent takes corner, take opposite corner;
      //5: take any corner; 5: take empty side space space

      computer_strategy();
      
      if (compendium_of_squares[square_class].marked === true) {
        return;
      }
      draw(computer, square_class);

      available_squares.splice(available_squares.indexOf(square_class), 1);
      var idx = document.getElementById(square_class);
      game_model[idx.dataset.idx] = computer.symbol;
      //console.log(square_class);

      computer.your_turn = false;
      player1.your_turn = true;

      if (check_if_endgame()) {
        if (tie) {
          setTimeout(function() {
            alert("It's a tie!");
          }, 114);
          setTimeout(function() {
            reset_game();
          }, 114);
          tie = false;
          return;
        } else {
          if ((computer.symbol === "X" && winner.X === true) || (computer.symbol === "O" && winner.O === true)) {
            computer.score++;
            $('.player2-score').text(computer.score);
            setTimeout(function() {
              alert("Congratulations, Computer: you won!");
            }, 114);
            $("." + winner.win_array[0] + ", ." + winner.win_array[1] + ", ." + winner.win_array[2]).css("background", "#963d44");
            setTimeout(function() {
              reset_game();
              //computer_move();
            }, 114);
            return;
          }
        }
      }
    }

    function computer_strategy() {
      if (computer.symbol === "X") {
      	//priority 1: a chance to win
        if (game_model[0] === "E" && ((game_model[1] === "X" && game_model[2] === "X") || (game_model[3] === "X" && game_model[6] === "X") || (game_model[4] === "X" && game_model[8] === "X"))) {
          square_class = "one";
          return square_class;
        } else if (game_model[1] === "E" && ((game_model[4] === "X" && game_model[7] === "X") || (game_model[0] === "X" && game_model[2] === "X"))) {
          square_class = "two";
          return square_class;
        } else if (game_model[2] === "E" && ((game_model[0] === "X" && game_model[1] === "X") || (game_model[5] === "X" && game_model[8] === "X") || (game_model[4] === "X" && game_model[6] === "X"))) {
          square_class = "three";
          return square_class;
        } else if (game_model[3] === "E" && ((game_model[0] === "X" && game_model[6] === "X") || (game_model[4] === "X" && game_model[5] === "X"))) {
          square_class = "four";
          return square_class;
        } else if (game_model[4] === "E" && ((game_model[1] === "X" && game_model[7] === "X") || (game_model[0] === "X" && game_model[8] === "X") || (game_model[2] === "X" && game_model[6] === "X") || (game_model[3] === "X" && game_model[5] === "X"))) {
          square_class = "five";
          return square_class;
        } else if (game_model[5] === "E" && ((game_model[3] === "X" && game_model[4] === "X") || (game_model[2] === "X" && game_model[8] === "X"))) {
          square_class = "six";
          return square_class;
        } else if (game_model[6] === "E" && ((game_model[7] === "X" && game_model[8] === "X") || (game_model[0] === "X" && game_model[3] === "X") || (game_model[2] === "X" && game_model[4] === "X"))) {
          square_class = "seven";
          return square_class;
        } else if (game_model[7] === "E" && ((game_model[1] === "X" && game_model[4] === "X") || (game_model[6] === "X" && game_model[8] === "X"))) {
          square_class = "eight";
          return square_class;
        } else if (game_model[8] === "E" && ((game_model[6] === "X" && game_model[7] === "X") || (game_model[2] === "X" && game_model[5] === "X") || (game_model[0] === "X" && game_model[4] === "X"))) {
          square_class = "nine";
          return square_class;
        //priority 2: a chance to block human's win
        } else if (game_model[0] === "E" && ((game_model[1] === "O" && game_model[2] === "O") || (game_model[3] === "O" && game_model[6] === "O") || (game_model[4] === "O" && game_model[8] === "O"))) {
          square_class = "one";
          return square_class;
        } else if (game_model[1] === "E" && ((game_model[4] === "O" && game_model[7] === "O") || (game_model[0] === "O" && game_model[2] === "O"))) {
          square_class = "two";
          return square_class;
        } else if (game_model[2] === "E" && ((game_model[0] === "O" && game_model[1] === "O") || (game_model[5] === "O" && game_model[8] === "O") || (game_model[4] === "O" && game_model[6] === "O"))) {
          square_class = "three";
          return square_class;
        } else if (game_model[3] === "E" && ((game_model[0] === "O" && game_model[6] === "O") || (game_model[4] === "O" && game_model[5] === "O"))) {
          square_class = "four";
          return square_class;
        } else if (game_model[4] === "E" && ((game_model[1] === "O" && game_model[7] === "O") || (game_model[0] === "O" && game_model[8] === "O") || (game_model[6] === "X" && game_model[2] === "X") || (game_model[3] === "O" && game_model[5] === "O"))) {
          square_class = "five";
          return square_class;
        } else if (game_model[5] === "E" && ((game_model[3] === "O" && game_model[4] === "O") || (game_model[2] === "O" && game_model[8] === "O"))) {
          square_class = "six";
          return square_class;
        } else if (game_model[6] === "E" && ((game_model[7] === "O" && game_model[8] === "O") || (game_model[0] === "O" && game_model[3] === "O") || (game_model[2] === "O" && game_model[4] === "O"))) {
          square_class = "seven";
          return square_class;
        } else if (game_model[7] === "E" && ((game_model[1] === "O" && game_model[4] === "O") || (game_model[6] === "O" && game_model[8] === "O"))) {
          square_class = "eight";
          return square_class;
        } else if (game_model[8] === "E" && ((game_model[6] === "O" && game_model[7] === "O") || (game_model[2] === "O" && game_model[5] === "O") || (game_model[0] === "O" && game_model[4] === "O"))) {
          square_class = "nine";
          return square_class;
          //priority 3: prevent forking
        } else if ((game_model[0] === "O" && game_model[8] === "O") || (game_model[6] === "O" && game_model[2] === "O")) {
            if (compendium_of_squares["two"].marked === false) {
              square_class = "two";
            } else if (compendium_of_squares["four"].marked === false) {
              square_class = "four";
            } else if (compendium_of_squares["six"].marked === false) {
              square_class = "six";
            } else if (compendium_of_squares["eight"].marked === false) {
              square_class = "eight"
            } else {
              square_class = "five";
            }
          return square_class;
        //priority 4: take center square
        } else if (game_model[4] === "E") {
          square_class = "five";
          return square_class;
          // priority 5: take opposite corner
        } else if (game_model[0] === "E" && (game_model[2] === "O" || game_model[6] === "O")) {
          square_class = "one";
          return square_class;
        } else if (game_model[2] === "E" && (game_model[0] === "O" || game_model[8] === "O")) {
          square_class = "three";
          return square_class;
        } else if (game_model[6] === "E" && (game_model[0] === "O" || game_model[8] === "O")) {
          square_class = "seven";
          return square_class;
        } else if (game_model[8] === "E" && (game_model[2] === "O" || game_model[6] === "O")) {
          square_class = "nine";
          return square_class;
          //priority 6: take available corner
        } else if (game_model[0] === "E") {
          square_class = "one";
          return square_class;
        } else if (game_model[2] === "E") {
          square_class = "three";
          return square_class;
        } else if (game_model[6] === "E") {
          square_class = "seven";
          return square_class;
        } else if (game_model[8] === "E") {
          square_class = "nine";
          //priority  7: take side space
        } else if (game_model[1] === "E") {
          square_class = "two";
          return square_class;
        } else if (game_model[5] === "E") {
          square_class = "six";
          return square_class;
        } else if (game_model[7] === "E") {
          square_class = "eight";
          return square_class;
        } else if (game_model[3] === "E") {
          square_class = "four";
          return square_class;
        }
      }
      if (computer.symbol === "O") {
        if (game_model[0] === "E" && ((game_model[1] === "O" && game_model[2] === "O") || (game_model[3] === "O" && game_model[6] === "O") || (game_model[4] === "O" && game_model[8] === "O"))) {
          square_class = "one";
          return square_class;
        } else if (game_model[1] === "E" && ((game_model[4] === "O" && game_model[7] === "O") || (game_model[0] === "O" && game_model[2] === "O"))) {
          square_class = "two";
          return square_class;
        } else if (game_model[2] === "E" && ((game_model[0] === "O" && game_model[1] === "O") || (game_model[5] === "O" && game_model[8] === "O") || (game_model[4] === "O" && game_model[6] === "O"))) {
          square_class = "three";
          return square_class;
        } else if (game_model[3] === "E" && ((game_model[0] === "O" && game_model[6] === "O") || (game_model[4] === "O" && game_model[5] === "O"))) {
          square_class = "four";
          return square_class;
        } else if (game_model[4] === "E" && ((game_model[1] === "O" && game_model[7] === "O") || (game_model[0] === "O" && game_model[8] === "O") || (game_model[2] === "X" && game_model[6] === "X") || (game_model[3] === "O" && game_model[5] === "O"))) {
          square_class = "five";
          return square_class;
        } else if (game_model[5] === "E" && ((game_model[3] === "O" && game_model[4] === "O") || (game_model[2] === "O" && game_model[8] === "O"))) {
          square_class = "six";
          return square_class;
        } else if (game_model[6] === "E" && ((game_model[7] === "O" && game_model[8] === "O") || (game_model[0] === "O" && game_model[3] === "O") || (game_model[2] === "O" && game_model[4] === "O"))) {
          square_class = "seven";
          return square_class;
        } else if (game_model[7] === "E" && ((game_model[1] === "O" && game_model[4] === "O") || (game_model[6] === "O" && game_model[8] === "O"))) {
          square_class = "eight";
          return square_class;
        } else if (game_model[8] === "E" && ((game_model[6] === "O" && game_model[7] === "O") || (game_model[2] === "O" && game_model[5] === "O") || (game_model[0] === "O" && game_model[4] === "O"))) {
          square_class = "nine";
          return square_class;
        //priority 2: a chance to block human's win
        } else if (game_model[0] === "E" && ((game_model[1] === "X" && game_model[2] === "X") || (game_model[3] === "X" && game_model[6] === "X") || (game_model[4] === "X" && game_model[8] === "X"))) {
          square_class = "one";
          return square_class;
        } else if (game_model[1] === "E" && ((game_model[4] === "X" && game_model[7] === "X") || (game_model[0] === "X" && game_model[2] === "X"))) {
          square_class = "two";
          return square_class;
        } else if (game_model[2] === "E" && ((game_model[0] === "X" && game_model[1] === "X") || (game_model[5] === "X" && game_model[8] === "X") || (game_model[4] === "X" && game_model[6] === "X"))) {
          square_class = "three";
          return square_class;
        } else if (game_model[3] === "E" && ((game_model[0] === "X" && game_model[6] === "X") || (game_model[4] === "X" && game_model[5] === "X"))) {
          square_class = "four";
          return square_class;
        } else if (game_model[4] === "E" && ((game_model[1] === "X" && game_model[7] === "X") || (game_model[0] === "X" && game_model[8] === "X") || (game_model[6] === "X" && game_model[2] === "X") || (game_model[3] === "X" && game_model[5] === "X"))) {
          square_class = "five";
          return square_class;
        } else if (game_model[5] === "E" && ((game_model[3] === "X" && game_model[4] === "X") || (game_model[2] === "X" && game_model[8] === "X"))) {
          square_class = "six";
          return square_class;
        } else if (game_model[6] === "E" && ((game_model[7] === "X" && game_model[8] === "X") || (game_model[0] === "X" && game_model[3] === "X") || (game_model[2] === "X" && game_model[4] === "X"))) {
          square_class = "seven";
          return square_class;
        } else if (game_model[7] === "E" && ((game_model[1] === "X" && game_model[4] === "X") || (game_model[6] === "X" && game_model[8] === "X"))) {
          square_class = "eight";
          return square_class;
        } else if (game_model[8] === "E" && ((game_model[6] === "X" && game_model[7] === "X") || (game_model[2] === "X" && game_model[5] === "X") || (game_model[0] === "X" && game_model[4] === "X"))) {
          square_class = "nine";
          return square_class;
        //priority 3: prevent forking
        } else if ((game_model[0] === "X" && game_model[8] === "X") || (game_model[6] === "X" && game_model[2] === "X")) {
            if (compendium_of_squares["two"].marked === false) {
              square_class = "two";
            } else if (compendium_of_squares["four"].marked === false) {
              square_class = "four";
            } else if (compendium_of_squares["six"].marked === false) {
              square_class = "six";
            } else if (compendium_of_squares["eight"].marked === false) {
              square_class = "eight"
            } else {
              square_class = "five";
            }
          return square_class;
          //priority 4: take center square
        } else if (game_model[4] === "E") {
          square_class = "five";
          //square_class = available_squares[Math.floor(Math.random() * available_squares.length)];
          return square_class;
          // priority 5: take opposite corner
        } else if (game_model[0] === "E" && (game_model[2] === "X" || game_model[6] === "X")) {
          square_class = "one";
          return square_class;
        } else if (game_model[2] === "E" && (game_model[0] === "X" || game_model[8] === "X")) {
          square_class = "three";
          return square_class;
        } else if (game_model[6] === "E" && (game_model[0] === "X" || game_model[8] === "X")) {
          square_class = "seven";
          return square_class;
        } else if (game_model[8] === "E" && (game_model[2] === "X" || game_model[6] === "X")) {
          square_class = "nine";
          return square_class;
          //priority 6: take available corner
        } else if (game_model[0] === "E") {
          square_class = "one";
          return square_class;
        } else if (game_model[2] === "E") {
          square_class = "three";
          return square_class;
        } else if (game_model[6] === "E") {
          square_class = "seven";
          return square_class;
        } else if (game_model[8] === "E") {
          square_class = "nine";
          //priority  7: take side space
        } else if (game_model[1] === "E") {
          square_class = "two";
          return square_class;
        } else if (game_model[5] === "E") {
          square_class = "six";
          return square_class;
        } else if (game_model[7] === "E") {
          square_class = "eight";
          return square_class;
        } else if (game_model[3] === "E") {
          square_class = "four";
          return square_class;
        }
      }
  }
}


 
});