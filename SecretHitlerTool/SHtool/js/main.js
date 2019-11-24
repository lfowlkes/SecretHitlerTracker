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
var total = libCount + facCount;
var libCountB = 6; //counter for conflict
var facCountB = 11;
var libBoard = 0; //# liberal cards in play on the board
var facBoard = 0; //# facist cards in play on the board

var Normal = function(game) {}; //game state for a normal round when president and chancellor agree on the cards they had
Normal.prototype = {
preload: function() {
    game.load.image('fcard', 'assets/img/facistcard.png');
    game.load.image('lcard', 'assets/img/liberalcard.png');
    game.load.image('fcardglo', 'assets/img/facistcardglow.png');
    game.load.image('lcardglo', 'assets/img/liberalcardglow.png');
    game.load.image('gamelogbg', 'assets/img/gamelogbg.png');
    game.load.image('arrow', 'assets/img/arrow.png');
    game.load.image('confirm', 'assets/img/confirmbutton.png');
    
    
},
    
create: function() {
    /// booleans for each facist card; if the card is active, true, false if respective liberal is showing
    f1Active = true;
    f2Active = true;
    f3Active = true;
    cardPlayed = 0; // index of card selected as played
    
    /*/ Adding game assests and text /*/
    game.stage.backgroundColor = '#eddca4';
    logbg = game.add.sprite(750, 0, 'gamelogbg')
    logbg.scale.setTo(5, 12);
    confirm = game.add.sprite(300, 515, 'confirm'); confirm.inputEnabled = true;
    
    /*/ Adding all card sprites /*/
    fcard1 = game.add.sprite(100, 200, 'fcard');
    fcard2 = game.add.sprite(300, 200, 'fcard');
    fcard3 = game.add.sprite(500, 200, 'fcard');
    fcardglo1 = game.add.sprite(88, 184, 'fcardglo'); fcardglo1.alpha = 0;
    fcardglo2 = game.add.sprite(288, 184, 'fcardglo'); fcardglo2.alpha = 0;
    fcardglo3 = game.add.sprite(488, 184, 'fcardglo'); fcardglo3.alpha = 0;
    libcard1 = game.add.sprite(100, 200, 'lcard'); libcard1.alpha = 0; //liberal cards are originally hidden
    libcard2 = game.add.sprite(300, 200, 'lcard'); libcard2.alpha = 0;
    libcard3 = game.add.sprite(500, 200, 'lcard'); libcard3.alpha = 0;
    libcardglo1 = game.add.sprite(86, 185, 'lcardglo'); libcardglo1.alpha = 0;
    libcardglo2 = game.add.sprite(286, 185, 'lcardglo'); libcardglo2.alpha = 0;
    libcardglo3 = game.add.sprite(486, 185, 'lcardglo'); libcardglo3.alpha = 0;
    fcardglo1.inputEnabled = true; fcardglo2.inputEnabled = true; fcardglo3.inputEnabled = true;
    libcardglo1.inputEnabled = true; libcardglo2.inputEnabled = true; libcardglo3.inputEnabled = true;
    
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
    facistCountText = game.add.text(120, 100, 'FACIST: ' + facCount, { font: '25px Arial', fill: '#000'});
    liberalCountText = game.add.text(515, 100, 'LIBERAL: ' + libCount, { font: '25px Arial', fill: '#000'});
    game.add.text(800, 25, 'Game Logs', {font: ' 25px Celtic Garamond the 2nd', fill: '#FFF'});
    
    console.log("hi");
},
    
update: function() {
    facistCountText.text = 'FACIST: ' + facCount,
    liberalCountText.text = 'LIBERAL: ' + libCount,
    /*/Event handlers for clicking on buttons/*/
    //@params: the function being called, the object, a 0, and the index of the card to be changed
    arrow1Top.events.onInputDown.add(this.cardChange, this, 0, 1);
    arrow1Low.events.onInputDown.add(this.cardChange, this, 0, 1);
    arrow2Top.events.onInputDown.add(this.cardChange, this, 0, 2);
    arrow2Low.events.onInputDown.add(this.cardChange, this, 0, 2);
    arrow3Top.events.onInputDown.add(this.cardChange, this, 0, 3);
    arrow3Low.events.onInputDown.add(this.cardChange, this, 0, 3);
    //only tracking "on click" for the liberal glow card since it's the one on top and therefore the only one that will register mouse events
    libcardglo1.events.onInputDown.add(this.setGlow, this, 0, 1);
    libcardglo2.events.onInputDown.add(this.setGlow, this, 0, 2);
    libcardglo3.events.onInputDown.add(this.setGlow, this, 0, 3);
    confirm.events.onInputDown.add(this.confirmCards, this);
},
    
    /*/ Event handler functions for changing the cards back and forth between liberal and facist as players click buttons /*/
cardChange: function(empty, empty1, cardNum) {
    //don't ask why I have to have two empty values here, idk either, but I can't figure out another way to get the function to take my int as an argument, so here we are LOL
    if(cardNum == 1)
    {
        if(f1Active == true) //if the facist card is currently the one visible
        {
            //switches which card is visible and toggles boolean
            fcard1.alpha = 0; fcardglo1.alpha = 0;
            libcard1.alpha = 1;
            f1Active = false;
        }
        else //if the liberal card is currently the one visible
        {
            //inverse of above
            fcard1.alpha = 1;
            libcard1.alpha = 0; libcardglo1.alpha = 0;
            f1Active = true;
        }
    }
    else if(cardNum == 2)
    {
        if(f2Active == true) //if the facist card is currently the one visible
        {
            //switches which card is visible and toggles boolean
            fcard2.alpha = 0; fcardglo2.alpha = 0;
            libcard2.alpha = 1;
            f2Active = false;
        }
        else //if the liberal card is currently the one visible
        {
            //inverse of above
            fcard2.alpha = 1;
            libcard2.alpha = 0; libcardglo2.alpha = 0;
            f2Active = true;
        }
    }
    else
    {
        console.log(cardNum);
        if(f3Active == true) //if the facist card is currently the one visible
        {
            //switches which card is visible and toggles boolean
            fcard3.alpha = 0; fcardglo3.alpha = 0;
            libcard3.alpha = 1;
            f3Active = false;
        }
        else //if the liberal card is currently the one visible
        {
            //inverse of above
            fcard3.alpha = 1;
            libcard3.alpha = 0; libcardglo3.alpha = 0;
            f3Active = true;
        }
    }
},
    
setGlow: function(empty, empty2, cardNum) //highlights in glow the card clicked
    {
        if(f1Active && cardNum == 1)
        {
            fcardglo1.alpha = 1; //turns on glow for clicked card
            fcardglo2.alpha = 0; //turns off glow for all other cards
            fcardglo3.alpha = 0;
            libcardglo1.alpha = 0;
            libcardglo2.alpha = 0;
            libcardglo3.alpha = 0;
            cardPlayed = 1; //updates index of card selected as played
        }
        else if(f2Active && cardNum == 2)
        {
            fcardglo2.alpha = 1;
            fcardglo1.alpha = 0;
            fcardglo3.alpha = 0;
            libcardglo1.alpha = 0;
            libcardglo2.alpha = 0;
            libcardglo3.alpha = 0;
            cardPlayed = 2;
        }
        else if(f3Active && cardNum == 3)
        {
            fcardglo3.alpha = 1;
            fcardglo2.alpha = 0;
            fcardglo1.alpha = 0;
            libcardglo1.alpha = 0;
            libcardglo2.alpha = 0;
            libcardglo3.alpha = 0;
            cardPlayed = 3;
        }
        else if(!f1Active && cardNum == 1)
        {
            libcardglo1.alpha = 1;
            libcardglo2.alpha = 0;
            libcardglo3.alpha = 0;
            fcardglo1.alpha = 0;
            fcardglo2.alpha = 0;
            fcardglo3.alpha = 0;
            cardPlayed = 1;
        }
        else if(!f2Active && cardNum == 2)
        {
            libcardglo2.alpha = 1;
            libcardglo1.alpha = 0;
            libcardglo3.alpha = 0;
            fcardglo1.alpha = 0;
            fcardglo2.alpha = 0;
            fcardglo3.alpha = 0;
            cardPlayed = 2;
        }
        else
        {
            libcardglo3.alpha = 1;
            libcardglo1.alpha = 0;
            libcardglo2.alpha = 0;
            fcardglo1.alpha = 0;
            fcardglo2.alpha = 0;
            fcardglo3.alpha = 0;
            cardPlayed = 3;
        }
    },
    
confirmCards: function() {
    var f = 0; //facist cards claimed this turn
    var l = 0; //liberal cards claimed this turn
    var prob = 0; //used to hold probabilities
    
   
    
    /*/ Checks which cards are selected and updates counters accordingly /*/
    if(f1Active)
        f++;
    else
        l++;
    if(f2Active)
        f++;
    else
        l++;
    if(f3Active)
        f++;
    else
        l++;
    //NOTE: This block is commented out only because the forward slashes mess up my indentation on Xcode. It works fine otherwise.
    //Does the math to get probability that the claim was true
    if(f == 3)
    {
     prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
     }
     else if(f == 2)
     {
     prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((libCount)/(total-2)));
        }
    else if(f == 1)
    {
     prob = 100 *((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2)));
        }
    else
    {
        prob = 100 *((libCount/total) * ((libCount-1)/(total-1)) * ((libCount-2)/(total-2)));
    }
     
console.log(Phaser.Math.roundTo(prob, 0) + '% chance of claim being true.');
    
    //Subtracts claim from remaining card counts
    facCount -= f;
    libCount -= l;
    total = facCount + libCount;
    
    //Calculates odds of next draw having 3 facist cards
    prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
console.log(Phaser.Math.roundTo(prob, 0) + '% chance of next draw containing 3 facist cards.');
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
