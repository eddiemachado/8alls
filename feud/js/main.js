/**
 *
 **/


// on doc ready
jQuery(function($) {



	var gameOver = false;

	var turn = localStorage.getItem('turn');

	// for the wrong answers
	var teamWrong;
	var svg = '<svg width="50" height="60" xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero" fill="none"><path d="M36.267 30.06l12.688-17.485c.304-.418.434-.943.36-1.46a1.974 1.974 0 00-.753-1.291L36.825.878A1.883 1.883 0 0035.4.51a1.91 1.91 0 00-1.26.772l-9.38 12.924-9.38-12.92a1.91 1.91 0 00-1.26-.773 1.883 1.883 0 00-1.424.369L.96 9.829a2.002 2.002 0 00-.394 2.751l12.687 17.48L.566 47.543a2.002 2.002 0 00-.36 1.459c.075.516.346.98.754 1.292l11.736 8.947c.408.312.92.444 1.424.369a1.91 1.91 0 001.26-.772l9.38-12.926 9.38 12.92a1.917 1.917 0 001.539.793c.415 0 .819-.138 1.15-.393l11.736-8.947c.409-.311.68-.776.754-1.292a2.002 2.002 0 00-.36-1.46L36.267 30.06z" fill="#B72170"/><path d="M35.652 55.346l-9.76-13.466-1.42-1.927a1.265 1.265 0 00-1.038-.52 1.267 1.267 0 00-1.021.551L12.237 54.713l-7.813-5.97 12.378-17.082a2.008 2.008 0 000-2.345L4.426 12.234 11.9 6.525l10.464 14.362c.233.32.595.513.983.525.389.013.762-.158 1.013-.462l1.531-1.853 9.755-13.465 7.401 5.656L30.21 29.71a1.339 1.339 0 00.015 1.547L43.407 49.42l-7.755 5.925z" fill="#FFF"/></g></svg>';

	// decide who's turn it is to start
	if (turn == 'team1Turn') {
		$('header').removeClass().addClass('team1Turn');
	}
	else {
		$('header').removeClass().addClass('team2Turn');
	}


	// if the team1 name exists
    if (localStorage.getItem('team1Name')) {
  		team1 = localStorage.getItem('team1Name');
  		$('#team1').text(team1);
	}

	// if the team1 name exists
    if (localStorage.getItem('team2Name')) {
  		team2 = localStorage.getItem('team2Name');
  		$('#team2').text(team2);
	}

	// if the team1Score exists
	if (localStorage.getItem('team1Score')) {
  		team1score = localStorage.getItem('team1Score');
  		$('#team1score').text(team1score);
	}

	// if team2Score exists
    if (localStorage.getItem('team2Score')) {
  		team2score = localStorage.getItem('team2Score');
  		$('#team2score').text(team2score);
	}

	// setting try counter
	var team1Counter = 0;
	var team2Counter = 0;

	// clicking on the board so we need to pass some data
	$(document).on('click', '.ff-card', function(e){

    	// don't take them right away
    	e.preventDefault();

		var boardNum = $(this).data("board");


    	// setting the number in localstorage
		localStorage.setItem('viewingList', boardNum);

		// put a localstorage unit for each board
		localStorage.setItem("'boardViewed-" + boardNum + "'", 'true');


    	// if there's a link on this
    	if (this.href) {
        	var target = this.href;
        	setTimeout(function(){
            	window.location = target;
            // wait this long to take them
        	}, 400);
    	}

	});


	// when someone gets the right answer
	function CorrectAnswer(id) {

		// log which answer you click
		var answer = '#list-' + id;

		// log the points
		var points = $(answer).find('.ffb-item-back-num').text();

		var team;
		var scoreDiv;
		var currentPoints;
		var newScore;

		// if it has already been answered, no more points
		if ($(answer).hasClass('is-flipped')) {
			// stop it
			return;
		}

		// flip the card
		$(answer).addClass( "is-flipped" );

		// check if it's not game over
		CheckStatus();

		// if it's player 1
		if (turn == 'team1Turn') {
			team = 'team1Score';
			scoreDiv = $('#team1score');
			currentPoints = localStorage.getItem('team1Score');

			if (team1Counter != 3) {

				// get the new score value
				newScore = parseInt(currentPoints) + parseInt(points);

				// assign the points to the team's localstorage
				localStorage.setItem(team, newScore);

				CountUp(scoreDiv, newScore);

				// switch turns
				SwitchTurns();

			}
			// end
			return;

		}

		// if it's player 2
		if (turn == 'team2Turn') {
			team = 'team2Score';
			scoreDiv = $('#team2score');
			currentPoints = localStorage.getItem('team2Score');

			if (team2Counter != 3) {

				// get the new score value
				newScore = parseInt(currentPoints) + parseInt(points);

				// assign the points to the team's localstorage
				localStorage.setItem(team, newScore);

				CountUp(scoreDiv, newScore);

				// switch turns
				SwitchTurns();

			}
			// end
			return;

		}



	} // end correct answer


	/// function for flipping a card
	$(document).on('click', '.ffb-item', function() {

		// log which answer you click
		var answer = $(this);

		// log the points
		var points = answer.find('.ffb-item-back-num').text();

		var team;
		var scoreDiv;
		var currentPoints;
		var newScore;

		// if it has already been answered, no more points
		if ($(answer).hasClass('is-flipped')) {
			// stop it
			return;
		}

		// flip the card
		$(answer).addClass( "is-flipped" );

		// check if it's not game over
		CheckStatus();

		// if it's player 1
		if (turn == 'team1Turn') {
			team = 'team1Score';
			scoreDiv = $('#team1score');
			currentPoints = localStorage.getItem('team1Score');

			if (team1Counter != 3) {

				// get the new score value
				newScore = parseInt(currentPoints) + parseInt(points);

				// assign the points to the team's localstorage
				localStorage.setItem(team, newScore);

				CountUp(scoreDiv, newScore);

				// switch turns
				SwitchTurns();

			}
			// end
			return;

		}

		// if it's player 2
		if (turn == 'team2Turn') {
			team = 'team2Score';
			scoreDiv = $('#team2score');
			currentPoints = localStorage.getItem('team2Score');

			if (team2Counter != 3) {

				// get the new score value
				newScore = parseInt(currentPoints) + parseInt(points);

				// assign the points to the team's localstorage
				localStorage.setItem(team, newScore);

				CountUp(scoreDiv, newScore);

				// switch turns
				SwitchTurns();

			}
			// end
			return;

		}

	});

	function CountUp(container, newScore) {
		// now count up the score on the page
		$(container).each(function() {
  			var $this = $(this),
      		countTo = newScore;

  			$({ countNum: $this.text()}).animate({
    			countNum: countTo
  			},
  			{
    			duration: 384,
    			easing:'linear',
    			step: function() {
      				$this.text(Math.floor(this.countNum));
    			},
    			complete: function() {
      				$this.text(this.countNum);
	    		}
  			});
		});
	}

	function SwitchTurns() {

		// if it's not game over then switch turns
		if (!gameOver) {



			// if it's team1
			if (turn == 'team1Turn') {

				// if team 2 is already done, then shut it down
				if (team2Counter == 3) {
					// do nothing
					return;
				}

				// otherwise let's switch turns
				turn = 'team2Turn';
				$('header').removeClass().addClass(turn);

				console.log(turn);

				return;
			}

			// if it's team 2
			if (turn == 'team2Turn') {

				// if team 1 is already done, then shut it down
				if (team1Counter == 3) {
					// do nothing
					return;
				}

				turn = 'team1Turn';
				$('header').removeClass().addClass(turn);

				console.log(turn);

				return;
			}

		} // end if it isn't game over

	}

	function CheckStatus() {

		// check if all the list items are turned over
		if ($('.ffb-list .ffb-item.is-flipped').length === $('.ffb-list .ffb-item').length) {

			// set game over
			gameOver = true;
			// remove the turn indicator
			$('header').removeClass();
			//return true
			$('#end-list').addClass('is-visible');

			return;
		}

		// if both teams have 3 strikes
		if ((team1Counter == 3) && (team2Counter == 3)) {

			console.log('game over both have 3');

			gameOver  = true;
			// remove the turn indicator
			$('header').removeClass();
			//return true
			$('#end-list').addClass('is-visible');

			return;
		}


	}

	/**
	 ** When the wrong button is pressed
	 */
	function WrongAnswer() {

		var teamWrong;

		if (turn == 'team1Turn') {
			team1Counter++;
			teamWrong = $('.score-left').find('.team-wrong');
		}

		if (turn == 'team2Turn') {
			team2Counter++;
			teamWrong = $('.score-right').find('.team-wrong');
		}

		// visually add the strike
  		teamWrong.addClass('strike').append(svg);

  		// switch turns
		SwitchTurns();

		// check if there's any more turns to be taken
		CheckStatus();

		return;

	} // end wrong answer function


	function ResetCounters() {

		gameOver = false;
		team1Counter = 0;
		team2Counter = 0;

	} // end reset counters


	/// function for flipping a card
	$(document).on('click', '.wrong-answer', function() {

		WrongAnswer();

	});






// finding what page you're on
var checkExist = setInterval(function() {

	// if it's the boards page
	if ($('#boards').length) {

		// if it's the board page, then we go rest
		ResetCounters();

		var viewed;
		// load up the json file
		var gameJSON = "http://8alls.com/feud/data/pubquiz.json";


    	$.getJSON(gameJSON, function (data) {

    		var html = '',
        	boardContainer = document.getElementById("board-container");

        	for (obj in data) {

        		for(entry in data[obj]) {



					// put a localstorage unit for each board
					viewed = localStorage.getItem("'boardViewed-" + entry + "'");

        			// create the board markup
        			html += '<a class="ff-card" data-viewed="' + viewed + '" data-board="' + entry + '" href="list.html"><h3>' + data.boards[entry].title + '</h3><p>' + data.boards[entry].desc + '</p></a>';

        			// add each card to the container
        			boardContainer.innerHTML = html;

        		} // end for entry
        	} // end for logic

		});





    	// stop the search
    	clearInterval(checkExist);
	}

	// if it's the list page
	if ($('#list').length) {

		// get the current board number
		var boardNum = localStorage.getItem('viewingList');

		// load up the json file
		var gameJSON = "http://8alls.com/feud/data/pubquiz.json";


    	$.getJSON(gameJSON, function (data) {

    		var html = '',
        	listContainer = document.getElementById("ffb-list");

			// get the data from local storage
			var boardName = data.boards['' + boardNum + ''].title;
			var boardDesc = data.boards['' + boardNum + ''].desc;
			var boardQuestion = data.boards['' + boardNum + ''].question;
			var boardTerm = data.boards['' + boardNum + ''].term;


			// display the data on the page
			$('#logo').find('h2').text(boardName);
			$('#logo').find('p').text(boardDesc);
			$('.ff-topic-headline').text(boardQuestion);
			$('#term').text(boardTerm);


        	var i = 0;
    		var j = 1;

        	for (obj in data) {

        		for(entry in data[obj]) {

        			$('#ffb-list').append('<li id="list-' + j +'" class="ffb-item"><div class="ffb-item-front"><span class="ffb-item-num">' + j +'</span></div><div class="ffb-item-back"><span class="ffb-word">' + data.boards['' + boardNum + ''].list['' + i + ''].word + '</span> <span class="ffb-item-back-num">' + data.boards['' + boardNum + ''].list['' + i + ''].score + '</span></div></li>');

        			i++;
         			j++;

        		} // end for entry
        	} // end for logic




        	// keyboard actions
        	document.addEventListener('keydown', function(e) {

        		// if you press the x button, it's a wrong answer
  				if (e.keyCode == 88) {
  					WrongAnswer();
  				}

  				// flip the appropriate numbers
  				// number 1
  				if (e.keyCode == 49) {
  					CorrectAnswer(1);
  				}
  				// number 1
  				if (e.keyCode == 50) {
  					CorrectAnswer(2);
  				}
  				// number 1
  				if (e.keyCode == 51) {
  					CorrectAnswer(3);
  				}
  				// number 1
  				if (e.keyCode == 52) {
  					CorrectAnswer(4);
  				}
  				// number 1
  				if (e.keyCode == 53) {
  					CorrectAnswer(5);
  				}
  				// number 1
  				if (e.keyCode == 54) {
  					CorrectAnswer(6);
  				}
  				// number 1
  				if (e.keyCode == 55) {
  					CorrectAnswer(7);
  				}
  				// number 1
  				if (e.keyCode == 56) {
  					CorrectAnswer(8);
  				}

			});




		});


    	// stop the search
    	clearInterval(checkExist);
	}



}, 100); // check every 100ms




}); // end document ready
