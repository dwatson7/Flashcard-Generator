const inquirer = require("inquirer");
const BasicCard = require("./BasicCard.js");
const ClozeCard = require("./ClozeCard.js")
const qa = require("./QA.json");
const fs = require("fs");

var selectedCard;
var playedCard;
var count = 0;


function startGame(){
  inqurier.prompt([
    {
      type:"list",
      message: "We need to go ahead and create this list!!",
      name: "createCard"
    }
  ]).then(function(answer){
      var bufferMessage;

      switch (answer.createCard) {
        case 'Create':
        console.log("Here Goes Nothing..Let's Create A Card");

          break;
        default:
        console.log("");
        console.log("hmmm, didn't quite get that. Sorry!!");
        console.log("");

      }
  });

}

startGame();

//Run this function when the user has selected to create a card.
function newCard() {
  inqurier.prompt([{


    type: "list",
    message: "You're Basic right? Just choose that card",
    choices:["Basic Card","Cloze Card"],
    name:"cardType"
  }


]).then(function (cardData) {

    var typeCard = cardData.typeCard;
    console.log(typeCard);

    if (typeCard === "Basic Card") {
      inqurier.prompt([
        {
          type: "input",
          message: "Who was the first black President",
          name: "front"
        },

        {
          type: "input",
          message: "Barack Obama",
          name:"back"
        }


      ]).then(function (flashData){

        var cardObj ={
          type: "Basic Card",
          front: flashData.front,
          back: flashData.back

        };
    library.push(cardObj);
    fs.writeFile("QA.json", JSON.stringify(qa, null, 2));

    inqurier.prompt([

          {
            type: "list",
            message:"Hmm..Create another card?",
            choices: ["Oh Yeah","Nope, I'm good for now"],
            name: anotherCard
          }
        ]).then(function cardData() {
          if (flashData.anotherCard === "Yes") {
              newCard();

          } else {
              setTimeout(startGame, 1000);
          }

        });
      });
}
      else {
        inqurier.prompt([
          {
            type: "input",
            message: "How many teams are there in the NFL?",
            name: "text"
          },
          {
            type:"input",
            message: "What's the most points scored in a NBA game?",
            name: "cloze"
          },
        ]).then(function(flashData){
          var cardObj = {
            type: "ClozeCard",
            text: flashData.text,
            cloze: flashData.cloze
          };
          if (cardObj.text.indexof(cardObj.cloze) !== -1) {
            library.push(cardObj);
            fs.writeFile("QA.json",JSON.stringify(qa,null, 2));

          }else {
            console.log("Oh no! something didnt' match");
          }
          inqurier.prompt([
            {
              type:"list",
              message: "Create another Card?",
              choices: ["Yes","No"],
              name: "anotherCard",
            }
          ]).then(function(flashData) {
              if (flashData.anotherCard === "Yes") {
                  startGame();

              }else {
                setTimeout(startGame,1000);
              }

          });
        });
      }
    });
};

function newQuestion(card){
    if (card.type === "BasicCard") {
      selectedCard = new BasicCard(card.front, card.back);
      return selectedCard.front;

    }else if (card.type === "ClozeCard") {
      selectedCard = new ClozeCard(card.text, card.cloze);
      return selectedCard.clozeRemoved();

    }
};

function voiceQuestion(){
  if (count < qa.length) {
      playedCard = newQuestion(qa[count]);
      inqurier.prompt([
        {
          type: "input",
          message: playedCard,
          name: "question"
        }
      ]).then(function(answer){

          if (answer.question === qa[count].back || answer.question === qa[count].cloze) {
            console.log("YOU'RE CORRECT WHOOAAAAA!!");

          }else {
              if (selectedCard.front !== undefined) {
                  console.log("Sorry, that's not the right answer" + qa[count].back + "." + "Now this was this was the correct answer");
              }else {
                console.log("Sorry, that's not the right answer" + qa[count].cloze + "." + "Now this was this was the correct answer");

              }

          }
          count++;
          voiceQuestion();
      });

  }else {
    count = 0;
    startGame();
  }
};

function showCards(){

  var qa = require("./QA.json");

  if (count < qa.length) {
    if (qa[count].front !== undefined) {
      console.log("");
      console.log("=======Basic Cards=========");
      console.log("==================");
      console.log("front:" + qa[count].front);
      console.log("==================");
      console.log("Back:"+ qa[count].back + ".");
      console.log("==================");
      console.log("");

    }else {
      console.log("");
      console.log("=========Cloze Cards=======");
      console.log("");
      console.log("Text:" + qa[count].text);
      console.log("===============");
      console.log("Cloze:" + qa[count].cloze + ".");
      console.log("");
    }
    count++;
    showCards();

  }else {
    count=0;
    startGame();
  }
}



}
