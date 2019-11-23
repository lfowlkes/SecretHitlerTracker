// Set up game
var config = {
    width: 1000,
    height: 600,
	parent: 'canvas-holder',
    renderer: Phaser.AUTO,
    antialias: true,
    multiTexture: true,
};

var game = new Phaser.Game(config);

var libCount = 6; //default count of liberal cards
var facCount = 11; //default count of facist cards
var libCountB = 6; //counter for second concept
var facCountB = 11;
var libBoard = 0; //# liberal cards in play on the board
var facBoard = 0; //# facist cards in play on the board

var Normal = function(game) {}; //game state for a normal round when president and chancellor agree on the cards they had
Normal.prototype = {
preload: function() {
    game.load.image('fcard', 'assets/img/facistcard.png');
    game.load.image('lcard', 'assets/img/liberalcard.png');
    game.load.image('gamelogbg', 'assets/img/gamelogbg.png');
    game.load.image('arrow', 'assets/img/arrow.png');


},

create: function() {
    /// booleans for each facist card; if the card is active, true, false if respective liberal is showing
    f1Active = true;
    f2Active = true;
    f3Active = true;

    /*/ Adding game assests and text /*/
    game.stage.backgroundColor = '#eddca4';
    logbg = game.add.sprite(750, 0, 'gamelogbg')
    logbg.scale.setTo(5, 12);

    /*/ Adding all card sprites /*/
    fcard1 = game.add.sprite(100, 200, 'fcard');
    fcard2 = game.add.sprite(300, 200, 'fcard');
    fcard3 = game.add.sprite(500, 200, 'fcard');
    libcard1 = game.add.sprite(100, 200, 'lcard'); libcard1.alpha = 0; //liberal cards are originally hidden
    libcard2 = game.add.sprite(300, 200, 'lcard'); libcard2.alpha = 0;
    libcard3 = game.add.sprite(500, 200, 'lcard'); libcard3.alpha = 0;

    /*/ Adding all arrow button sprites /*/
    arrow1Top = game.add.sprite(145, 165, 'arrow'); arrow1Top.inputEnabled = true;
    arrow2Top = game.add.sprite(345, 165, 'arrow'); arrow2Top.inputEnabled = true;
    arrow3Top = game.add.sprite(545, 165, 'arrow'); arrow3Top.inputEnabled = true;
    arrow1Low = game.add.sprite(145, 485, 'arrow'); arrow1Low.inputEnabled = true;
    arrow2Low = game.add.sprite(345, 485, 'arrow'); arrow2Low.inputEnabled = true;
    arrow3Low = game.add.sprite(545, 485, 'arrow'); arrow3Low.inputEnabled = true;
    arrow1Low.scale.setTo(1, -1); arrow2Low.scale.setTo(1, -1); arrow3Low.scale.setTo(1, -1);

    /*/ Adding baseline game text /*/
    game.add.text(200, 25, 'Cards remaining:', { font: '40px Celtic Garamond the 2nd', fill: '#000'});
    game.add.text(120, 100, 'FACIST: ' + facCount, { font: '25px Arial', fill: '#000'});
    game.add.text(515, 100, 'LIBERAL: ' + libCount, { font: '25px Arial', fill: '#000'});
    game.add.text(800, 25, 'Game Logs', {font: ' 25px Celtic Garamond the 2nd', fill: '#FFF'});
},

update: function() {

    /*/Event handlers for clicking on buttons/*/
    arrow1Top.events.onInputDown.add(this.card1Change, this);
    arrow1Low.events.onInputDown.add(this.card1Change,this);
    arrow2Top.events.onInputDown.add(this.card2Change, this);
    arrow2Low.events.onInputDown.add(this.card2Change, this);
    arrow3Top.events.onInputDown.add(this.card3Change, this);
    arrow3Low.events.onInputDown.add(this.card3Change, this);
},

    /*/ Event handler functions for changing the cards back and forth between liberal and facist as players click buttons /*/
card1Change: function() {
    if(f1Active == true) //if the facist card is currently the one visible
    {
        //switches which card is visible and toggles boolean
        fcard1.alpha = 0;
        libcard1.alpha = 1;
        f1Active = false;

    }
    else //if the liberal card is currently the one visible
    {
        //inverse of above
        fcard1.alpha = 1;
        libcard1.alpha = 0;
        f1Active = true;
    }
},

card2Change: function() {
    if(f2Active == true) //if the facist card is currently the one visible
    {
        //switches which card is visible and toggles boolean
        fcard2.alpha = 0;
        libcard2.alpha = 1;
        f2Active = false;
    }
    else //if the liberal card is currently the one visible
    {
        //inverse of above
        fcard2.alpha = 1;
        libcard2.alpha = 0;
        f2Active = true;
    }
},

card3Change: function() {
    if(f3Active == true) //if the facist card is currently the one visible
    {
        //switches which card is visible and toggles boolean
        fcard3.alpha = 0;
        libcard3.alpha = 1;
        f3Active = false;
    }
    else //if the liberal card is currently the one visible
    {
        //inverse of above
        fcard3.alpha = 1;
        libcard3.alpha = 0;
        f3Active = true;
    }
}

}

////////////////

var Conflict = function(game) {}; //game state to handle when the president and the chancellor claim to have given/received different cards and probabilities for both draws need to be logged and accounted for
Conflict.prototype = {

preload: function() {

},

create: function() {

},

update: function() {

}
}

////////////////

var Random = function(game) {}; //Game state to log card play when government is thrown into choas and a random card is put on the board
Random.prototype = {

preload: function() {

},

create: function() {

},

update: function() {

}
}

///////////////

game.state.add('Normal', Normal);
game.state.add('Conflict', Conflict);
game.state.add('Random', Random);
game.state.start('Normal');
