





// on doc ready
jQuery(function($) {

	// the start button game where we set everything up
	$('#start').click(function(e){

    	// don't take them right away
    	e.preventDefault();

    	// clearing all previous data
    	localStorage.clear();

    	console.log('Game is Starting...');
    	// add a class for a waiting animation


    	// setting up things in localstorage
    	const team1name = $('#team1').val();
    	const team2name = $('#team2').val();

    	// setup team names
		localStorage.setItem('team1Name', team1name);
		localStorage.setItem('team2Name', team2name);

		console.log('Team 1: ' + team1name);
		console.log('Team 2: ' + team2name);

    	// setup scores
		localStorage.setItem('team1Score', '000');
		localStorage.setItem('team2Score', '000');

    	// set the turn order
    	turn = (Math.floor(Math.random() * 2) == 0) ? 'team1Turn' : 'team2Turn';

    	console.log('First up is: ' + turn);

    	// set the turn in localstorage
		localStorage.setItem('turn', turn);

		// load up the json file
		var gameJSON = "https://rainbowsprinkles.com/feud/data/sampleGame.json";

		// we're creating localstorage for each board to track views
		$.getJSON(gameJSON, function (data) {

        	for (obj in data) {

        		for(entry in data[obj]) {

        			// put a localstorage unit for each board
					localStorage.setItem("'boardViewed-" + entry + "'", 'false');

        		} // end for entry
        	} // end for logic

		});

    	// if there's a link on this
    	if (this.href) {
        	var target = this.href;
        	setTimeout(function(){
            	window.location = target;
            // wait this long to take them
        	}, 340);
    	}


	});

});
