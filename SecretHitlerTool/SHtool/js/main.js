// Set up game
var config = {
	width: 1100,
	height: 700,
	parent: 'canvas-holder',
	renderer: Phaser.AUTO,
	antialias: true,
	multiTexture: true,
};

var game = new Phaser.Game(config);

var FACIST = 11 // constant variable representing total facist and liberal cards in a deck
var LIBERAL = 6
var libCount = 6; //default count of liberal cards
var facCount = 11; //default count of facist cards
var total = libCount + facCount;
var libCountB = 6; //counter for conflict
var facCountB = 11;
var libBoard = 0; //# liberal cards in play on the board
var facBoard = 0; //# facist cards in play on the board
var split = false; //True when we're in a conflict state
var gameLogs = new Array();

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
    game.load.image('normalbuttonpressed', 'assets/img/normalbuttonpress.png');
    game.load.image('normalbutton', 'assets/img/normalbutton.png');
    game.load.image('conflictbutton', 'assets/img/conflictbutton.png');
    game.load.image('randombutton', 'assets/img/randombutton.png');


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
    logbg.scale.setTo(7, 14);
    confirmb = game.add.sprite(300, 515, 'confirm'); confirmb.inputEnabled = true;
    normalbpress = game.add.sprite(100, 630, 'normalbuttonpressed'); normalbpress.inputEnabled = true;
    conflictb = game.add.sprite(300, 630, 'conflictbutton'); conflictb.inputEnabled = true;
    randomb = game.add.sprite(500, 630, 'randombutton'); randomb.inputEnabled = true;

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
    game.add.text(835, 25, 'Game Logs', {font: ' 30px Celtic Garamond the 2nd', fill: '#FFF'});
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
    confirmb.events.onInputDown.add(this.confirmCards, this);
    conflictb.events.onInputDown.add(startConflict, this);
    randomb.events.onInputDown.add(startRandom, this);
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

   /*/ Keeps track of the cards on board based off what value the player clicked/*/
      if(cardPlayed == 1)
      {
          if(f1Active) {
              facBoard++; console.log("Played: Facist");
              gameLogs.push("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
              gameLogs.push("Played: Liberal");
          }
      }
      else if(cardPlayed == 2)
      {
          if(f2Active) {
              facBoard++; console.log("Played: Facist");
              gameLogs.push("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
              gameLogs.push("Played: Liberal");
          }
      }
      else if(cardPlayed == 3)
      {
          if(f3Active) {
              facBoard++; console.log("Played: Facist");
              gameLogs.push("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
              gameLogs.push("Played: Liberal");
          }
      }
      //Turns off glow for all cards
      libcardglo3.alpha = 0;
      libcardglo1.alpha = 0;
      libcardglo2.alpha = 0;
      fcardglo1.alpha = 0;
      fcardglo2.alpha = 0;
      fcardglo3.alpha = 0;

      cardPlayed = 0; //resets card played

      console.log('Facist cards on board: ' + facBoard);
      gameLogs.push('Facist cards on board: ' + facBoard);
      console.log('Liberal cards on board: ' + libBoard);
      gameLogs.push('Liberal cards on board: ' + libBoard);

    //Checks to see if either party has reached their card-based win condition
    if(libBoard == 5)
    {
        console.log("Liberals win!");
        gameLogs.push("Liberals win!");
    }
    else if(facBoard == 6)
    {
        console.log("Facists win!");
        gameLogs.push("Facists win!");
    }

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

    console.log("Claim: " + f + " Facist, " + l + " Liberal");
    gameLogs.push("Claim: " + f + " Facist, " + l + " Liberal");
    //NOTE: This block is commented out only because the forward slashes mess up my indentation on Xcode. It works fine otherwise.
    //Does the math to get probability that the claim was true

    if(f == 3)
    {
     prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
     }
     else if(f == 2)
     {
     prob = 300 *((facCount/total) * ((facCount-1)/(total-1)) * ((libCount)/(total-2)));
        }
    else if(f == 1)
    {
     prob = 300 *((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2)));
        }
    else
    {
        prob = 100 *((libCount/total) * ((libCount-1)/(total-1)) * ((libCount-2)/(total-2)));
    }

    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of claim being true.');
    gameLogs.push(Phaser.Math.roundTo(prob, 0) + '% chance of claim being true.');


    //Subtracts claim from remaining card counts
    facCount -= f;
    libCount -= l;
    total = facCount + libCount;

    /*/ Reshuffles board when deck is < 3 /*/
    if(total < 3)
    {
        facCount = FACIST - facBoard; //resets deck counts to true values based on cards on board
        libCount = LIBERAL - libBoard;
        total = libCount + facCount;
        split = false; // conflict state ends once deck is reshuffled
    }

    //Calculates odds of next draw having 3 facist cards
        prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of next draw being 3 facist cards.');
    gameLogs.push(Phaser.Math.roundTo(prob, 0) + '% chance of next draw being 3 facist');

    updateLogs();
}
}

////////////////

var Conflict = function(game) {}; //game state to handle when the president and the chancellor claim to have given/received different cards and probabilities for both draws need to be logged and accounted for
Conflict.prototype = {//This state will only happen if there is a fac card is placed. When 3 lib card is there, there will not be a conflict happen
    /* So here's how I recommend doing this:
     * 0A. Check if the deck is about to be reshuffled. (i.e. total < 6) if it is, just ignore the conflict state because it doesn't matter because there won't be uncertainty once it shuffles. There may be some cases where it would still be beneficial to print out the probability that chancellor and president are etlling the truth about their respective draws, but I'm not sure if that's necessary yet. We can revist that later.
     * 0B. Check if split = true already. If so, flash a warning message telling them they can't have two conflict states occur before the next reshuffle, make them press okay, and send them back to the normal stage
     * 1. On the right side of the screen, have the president select which 3 cards they received. You can mostly just re-use the selection card of my "normal" code for this
     * 2. Re-use my "setGlow" method to have the user select one of the president's cards, except instead of counting this as the card played, count this as the card DISCARDED. You might need to create a new "cardPicked" value for this if you want to reuse the other one for the next step
     * 3. You're going to need to keep track of both what the president claimed they handed to the chancellor, and what they claimed to have discarded.
     * 4. Print the probability that the president's claim is correct (again, you can re-use my code for this)
     * 5. We're now going to live in a world in which we're assuming/pretending that the president was telling the truth about whatever the third card that they discarded was.
     * 6. On the right side of the screen, have the chancellor input which 2 cards they claim they were handed, and re-use the setglow function to have them select which card was played (Note: 99% of the time the chancelor's selection here will be 2 facist cards, but may as wel give them the choice to be safe)
     * 7. Split game logs into two columns. Idk how to do that with Phaser text tools but idk I believe in you
     * 8. The left side of the logs are now going to operate with facCount and libCount based on the cards the president claims to have drawn
     * 9. The right side of the logs are now going to operate with facCountB and libCountB based on the two cards the chancellor claims to have been given + the card the president says they discarded
     * 10. Print the probability that the next draw has 3 red cards for both sides of the claim.
     * 11. Set split state to be true;
     */
preload: function() {
    game.load.image('conflictbuttonpressed', 'assets/img/conflictbuttonpress.png');
    game.load.image('fcard', 'assets/img/facistcard.png');
    game.load.image('lcard', 'assets/img/liberalcard.png');
    game.load.image('fcardglo', 'assets/img/facistcardglow.png');
    game.load.image('lcardglo', 'assets/img/liberalcardglow.png');
    game.load.image('gamelogbg', 'assets/img/gamelogbg.png');
    game.load.image('arrow', 'assets/img/arrow.png');
    game.load.image('confirm', 'assets/img/confirmbutton.png');
    game.load.image('normalbuttonpressed', 'assets/img/normalbuttonpress.png');
    game.load.image('normalbutton', 'assets/img/normalbutton.png');
    game.load.image('conflictbutton', 'assets/img/conflictbutton.png');
    game.load.image('randombutton', 'assets/img/randombutton.png');

},

create: function() {
    logbg = game.add.sprite(750, 0, 'gamelogbg')
    logbg.scale.setTo(7, 14);
    confirmb = game.add.sprite(300, 515, 'confirm'); confirmb.inputEnabled = true;
    normalb = game.add.sprite(100, 630, 'normalbutton'); normalb.inputEnabled = true;
    conflictbpress = game.add.sprite(300, 630, 'conflictbuttonpressed'); conflictbpress.inputEnabled = true;
    randomb = game.add.sprite(500, 630, 'randombutton'); randomb.inputEnabled = true;


    f1Active = true;
    f2Active = true;
    f3Active = true;
    cardPlayed = 0; // index of card selected as played

    /*/ Adding game assests and text /*/
    game.stage.backgroundColor = '#eddca4';
    logbg = game.add.sprite(750, 0, 'gamelogbg')
    logbg.scale.setTo(7, 14);
    confirmb = game.add.sprite(300, 515, 'confirm'); confirmb.inputEnabled = true;
    //normalbpress = game.add.sprite(100, 630, 'normalbuttonpressed'); normalbpress.inputEnabled = true;
    //conflictb = game.add.sprite(300, 630, 'conflictbutton'); conflictb.inputEnabled = true;
    randomb = game.add.sprite(500, 630, 'randombutton'); randomb.inputEnabled = true;

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
    fcardglo1.inputEnabled = true; fcardglo2.inputEnabled = true;   fcardglo3.inputEnabled = true;
    libcardglo1.inputEnabled = true; libcardglo2.inputEnabled = true;   libcardglo3.inputEnabled = true;

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
    game.add.text(835, 25, 'Game Logs', {font: ' 30px Celtic Garamond the 2nd', fill: '#FFF'});

},

update: function() {
    facistCountText.text = 'FACIST: ' + facCount;
    liberalCountText.text = 'LIBERAL: ' + libCount;
    //transitions between stages
    normalb.events.onInputDown.add(startNormal, this);
    randomb.events.onInputDown.add(startRandom, this);

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
    confirmb.events.onInputDown.add(this.confirmCards, this);
    conflictb.events.onInputDown.add(startConflict, this);
    randomb.events.onInputDown.add(startRandom, this);
},
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

   /*/ Keeps track of the cards on board based off what value the player clicked/*/
      if(cardPlayed == 1)
      {
          if(f1Active) {
              facBoard++; console.log("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
          }
      }
      else if(cardPlayed == 2)
      {
          if(f2Active) {
              facBoard++; console.log("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
          }
      }
      else if(cardPlayed == 3)
      {
          if(f3Active) {
              facBoard++; console.log("Played: Facist");
          }
          else {
              libBoard++; console.log("Played: Liberal");
          }
      }
      //Turns off glow for all cards
      libcardglo3.alpha = 0;
      libcardglo1.alpha = 0;
      libcardglo2.alpha = 0;
      fcardglo1.alpha = 0;
      fcardglo2.alpha = 0;
      fcardglo3.alpha = 0;

      cardPlayed = 0; //resets card played

      console.log('Facist cards on board: ' + facBoard);
      console.log('Liberal cards on board: ' + libBoard);

    //Checks to see if either party has reached their card-based win condition
    if(libBoard == 5)
        console.log("Liberals win!");
    else if(facBoard == 6)
        console.log("Facists win!");

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

    console.log("Claim: " + f + " Facist, " + l + " Liberal");
    //NOTE: This block is commented out only because the forward slashes mess up my indentation on Xcode. It works fine otherwise.
    //Does the math to get probability that the claim was true

   /* if(f == 3)
    {
     prob = 100 *(((facCount/total)) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
     }
     else if(f == 2)
     {
     prob = 50 *((((facCount/total) * ((facCount-1)/(total-1))) * ((libCount)/(total-2)))+((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2))));
        }
    else if(f == 1)
    {
     prob = 50 *(((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2)))+((facCount/total) * ((facCount-1)/(total-1)) * ((libCount)/(total-2))));
        }
    else
    {
        prob = 100 *(((libCount/total) * ((libCount-1)/(total-1)) * ((libCount-2)/(total-2))));
    }
*/
    if(f == 3)
    {
     prob = 100 *(((facCount/total)) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
     }
     else if(f == 2)
     {
     prob = 150 *((((facCount/total) * ((facCount-1)/(total-1))) * ((libCount)/(total-2)))+((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2))));
        }
    else if(f == 1)
    {
     prob = 150 *(((facCount/total) * ((libCount)/(total-1)) * ((libCount-1)/(total-2)))+((facCount/total) * ((facCount-1)/(total-1)) * ((libCount)/(total-2))));
        }
    else
    {
        prob = 100 *(((libCount/total) * ((libCount-1)/(total-1)) * ((libCount-2)/(total-2))));
    }

    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of claim being true.');


    //Subtracts claim from remaining card counts
    facCount -= f;
    libCount -= l;
    total = facCount + libCount;

    /*/ Reshuffles board when deck is < 3 /*/
    if(total < 3)
    {
        facCount = FACIST - facBoard; //resets deck counts to true values based on cards on board
        libCount = LIBERAL - libBoard;
        total = libCount + facCount;
        split = true; // conflict state ends once deck is reshuffled
    }

    if(split===true){
        split=false;
        game.state.start('Normal');//may add popup later
    }
    //Calculates odds of next draw having 3 facist cards
        prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of next draw being 3 facist');

}
}

////////////////

var Random = function(game) {}; //Game state to log card play when government is thrown into choas (3 failed votes in a row) and a random card is put on the board.
Random.prototype = {

preload: function() {
    game.load.image('randombuttonpressed', 'assets/img/randombuttonpress.png');
},

create: function() {

    rActive = true;
    rcard = game.add.sprite(300, 200, 'fcard');
    rlibcard = game.add.sprite(300, 200, 'lcard'); rlibcard.alpha = 0;

    rarrowTop = game.add.sprite(345, 165, 'arrow'); rarrowTop.inputEnabled = true;
    rarrowLow = game.add.sprite(345, 485, 'arrow'); rarrowLow.inputEnabled = true;
    rarrowLow.scale.setTo(1, -1);


    logbg = game.add.sprite(750, 0, 'gamelogbg')
    logbg.scale.setTo(7, 14);
    confirmb = game.add.sprite(300, 515, 'confirm'); confirmb.inputEnabled = true;
    normalb = game.add.sprite(100, 630, 'normalbutton'); normalb.inputEnabled = true;
    conflictb = game.add.sprite(300, 630, 'conflictbutton'); conflictb.inputEnabled = true;
    randombpress = game.add.sprite(500, 630, 'randombuttonpressed'); randombpress.inputEnabled = true;

    /*/ Text /*/
    game.add.text(200, 25, 'Cards remaining:', { font: '40px Celtic Garamond the 2nd', fill: '#000'});
    facistCountText = game.add.text(120, 100, 'FACIST: ' + facCount, { font: '25px Arial', fill: '#000'});
    liberalCountText = game.add.text(515, 100, 'LIBERAL: ' + libCount, { font: '25px Arial', fill: '#000'});
    game.add.text(835, 25, 'Game Logs', {font: ' 30px Celtic Garamond the 2nd', fill: '#FFF'});

},

update: function() {
    facistCountText.text = 'FACIST: ' + facCount;
    liberalCountText.text = 'LIBERAL: ' + libCount;
    //transitions between stages

    rarrowTop.events.onInputDown.add(this.rcardChange, this);
    rarrowLow.events.onInputDown.add(this.rcardChange, this);

    confirmb.events.onInputDown.add(this.rconfirmCards, this);

    normalb.events.onInputDown.add(startNormal, this);
    conflictb.events.onInputDown.add(startConflict, this);
},

rcardChange: function() {
    if(rActive) //if the facist card is currently the one visible
        {
            //switches which card is visible and toggles boolean
            rcard.alpha = 0;
            rlibcard.alpha = 1;
            rActive = false;
        }
    else //if the liberal card is currently the one visible
        {
            //inverse of above
            rcard.alpha = 1;
            rlibcard.alpha = 0;
            rActive = true;
        }
},

rconfirmCards: function() {
    var f = 0;
    var l = 0;
    var prob = 0;

    if(rActive)
        {
        facBoard++; console.log("Played: Facist");
        }
    else
        {
        libBoard++; console.log("Played: Liberal");
        }

    console.log('Facist cards on board: ' + facBoard);
    console.log('Liberal cards on board: ' + libBoard);

    //Checks to see if either party has reached their card-based win condition
    if(libBoard == 5)
        console.log("Liberals win!");
    else if(facBoard == 6)
        console.log("Facists win!");

    //Checks which cards are selected and updates counters accordingly
    if(rActive)
        f++;
    else
        l++;

    if(f == 1)
        prob = 100 * (facCount/total);
    else
        prob = 100 * (libCount/total);


    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of claim being true.');


    //Subtracts claim from remaining card counts
    facCount -= f;
    libCount -= l;
    total = facCount + libCount;

    // Reshuffles board when deck is  < 3
    if(total < 3)
    {
        facCount = FACIST - facBoard; //resets deck counts to true values based on cards on board
        libCount = LIBERAL - libBoard;
        total = libCount + facCount;
        split = false; // conflict state ends once deck is reshuffled
    }

    //Calculates odds of next draw having 3 facist cards
    prob = 100 *((facCount/total) * ((facCount-1)/(total-1)) * ((facCount-2)/(total-2)));
    console.log(Phaser.Math.roundTo(prob, 0) + '% chance of next draw being 3 facist ');
}
}

///////////////
function startNormal()
{
    game.state.start('Normal');
    updateLogs();
}
function startConflict()
{
    game.state.start('Conflict');
    updateLogs();
}

function startRandom()
{
    game.state.start('Random');
    updateLogs();
}
function updateLogs()
{
    
    for(i = 0; i < gameLogs.length; i++)
      {
        game.add.text(760, (i*25) + 75, gameLogs[i], { font: '18px Arial', fill: '#FFF'});
      }
    
}
///////////////

game.state.add('Normal', Normal);
game.state.add('Conflict', Conflict);
game.state.add('Random', Random);
game.state.start('Normal');
