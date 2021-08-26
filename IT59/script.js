/*************************************************************************** Iks Oks ***************************************************************************/

var orgBoard;
var playOption = '';
var singlePlayer=document.getElementById('sngPlayer');
var multiPlayer=document.getElementById('mltPlayer');
const player1 = "X";
const player2 = "O";
var lastPlay = player2;
const winCombos = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
]

singlePlayer.onclick=function() {
    playOption='singlePlayer';
    document.querySelector("#restart").style.display="block";
    document.querySelector("#sngPlayer").style.display="none";
    startGame();
}

multiPlayer.onclick=function() {
    playOption='multiPlayer';
    document.querySelector("#restart").style.display="block";
    document.querySelector("#sngPlayer").style.display="none";
    startGame();
}


const cells = document.querySelectorAll('.cell');

function startGame() {
    console.log(lastPlay);
    lastPlay=player2;
    document.querySelector(".end_game").style.display="none";
    document.querySelector("#sngPlayer").style.display="none";
    document.querySelector("#mltPlayer").style.display="none";
    orgBoard = Array.from(Array(9).keys());
    for(var i=0;i<cells.length;i++){
        cells[i].innerText='';
        cells[i].style.removeProperty('background-color');
        if(playOption=='singlePlayer'){
            cells[i].addEventListener('click', turnClick, false);
        }
        if(playOption=='multiPlayer'){
            cells[i].addEventListener('click', turnPlayerClick, false, lastPlay);
        }
    }
}

function turnPlayerClick(square){
    if(lastPlay==player2){
        lastPlay=player1;
        if(typeof orgBoard[square.target.id]=='number'){
            turn(square.target.id, player1);
        } 
    }
    else if(lastPlay==player1){
        lastPlay=player2;
        if(typeof orgBoard[square.target.id]=='number'){
            turn(square.target.id, player2);
        }
    }
}

function turnClick(square){
    if(typeof orgBoard[square.target.id]=='number'){
        turn(square.target.id, player1);
        setTimeout(function() {
            if(!checkTie()) turn(bestSpot(), player2);
        }, (300));
        
    }
    
}

function turn(squareId, player) {
    console.log(lastPlay);
    orgBoard[squareId] = player;
    document.getElementById(squareId).innerText=player;
    let gameWon = checkWin(orgBoard, player)
    if(gameWon) gameOver(gameWon)
}


function checkWin(board, player) {
    let plays = board.reduce((a,e,i)=>
    (e===player) ? a.concat(i) : a, []);
    let gameWon=null;
    if(playOption=='multiPlayer'){
        if(emptySquares().length==0){
            for(var i=0;i<cells.length;i++){
                cells[i].style.backgroundColor = "green";
                cells[i].removeEventListener('click', turnPlayerClick,false,lastPlay);
            }
            declareWinner("Tie Game!");
            document.querySelector("#sngPlayer").style.display="block";
            document.querySelector("#mltPlayer").style.display="block";
        }
    }
    for(let[index,win] of winCombos.entries()){
        if(win.every(elem=>plays.indexOf(elem)>-1)){
            for(var i=0;i<cells.length;i++){
                cells[i].style.backgroundColor = "#687497";
            }
            gameWon={index:index, player:player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon){
    
    for(let index of winCombos[gameWon.index]){
        document.getElementById(index).style.backgroundColor =
         gameWon.player == player1 ? "blue" : "red";
    }
    document.querySelector(".end_game").style.display="none";
    document.querySelector("#sngPlayer").style.display="block";
    document.querySelector("#mltPlayer").style.display="block";
    document.querySelector("table").style.display="block";
    for(var i=0;i<cells.length;i++){
        if(playOption=='singlePlayer'){
            cells[i].removeEventListener('click', turnClick,false);
        }
        if(playOption=='multiPlayer'){
            cells[i].removeEventListener('click', turnPlayerClick, false, lastPlay);
            
        }
    }
    
    declareWinner(gameWon.player==player1 ? "X win!" : "O win!");
}

function declareWinner(winner){
    document.querySelector(".end_game").style.display="block";
    document.querySelector(".end_game .text").innerText=winner;
}

function emptySquares(){
    return orgBoard.filter(s=>typeof s == 'number');
}

function bestSpot(){
    return minimax(orgBoard,player2).index;
}

function checkTie(){
    if(emptySquares().length==0){
        for(var i=0;i<cells.length;i++){
            cells[i].style.backgroundColor = "green";
            cells[i].removeEventListener('click', turnClick,false);
        }
        declareWinner("Tie Game!");
        document.querySelector("#sngPlayer").style.display="block";
        document.querySelector("#mltPlayer").style.display="block";
        return true;
    }
    return false;
}

function minimax(newBoard,player){
    var availSpots = emptySquares(newBoard);
    if(checkWin(newBoard,player1)){
        return{score: -10};
    }else if(checkWin(newBoard,player2)){
        return{score:10};
    }else if(availSpots.length===0){
        return{score:0};
    }
    var moves = [];
    for(var i=0;i<availSpots.length;i++){
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]]=player;
        if(player==player2){
            var result = minimax(newBoard, player1);
            move.score = result.score;
        }else{
            var result = minimax(newBoard, player2);
            move.score = result.score;
        }
        newBoard[availSpots[i]]=move.index;
        moves.push(move);
    }
    var bestMove;
    if(player === player2){
        var bestScore = -10000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score>bestScore){
                bestScore = moves[i].score;
                bestMove=i;
            }
        }
    }else{
        var bestScore = 10000;
        for(var i=0;i<moves.length;i++){
            if(moves[i].score<bestScore){
                bestScore = moves[i].score;
                bestMove=i;
            }
        }
    }
    return moves[bestMove];
}




/*************************************************************************** Mapa ******************************************************************************/
function initMap(){
    var location = {lat: 45.467830, lng: 19.457890}
    var map = new google.maps.Map(document.getElementById("map"),{
        zoom: 8,
        center: location
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map
    })
}

/**************************************************************************** FORMA ***************************************************************************/


function submitForm(){
    

    let name = document.querySelector(".name").value;
    let email = document.querySelector(".email").value;
    let phone = document.querySelector(".phone").phone;
    let message = document.querySelector(".message").value;


    sendEmail(name,email,phone,message);
}

function sendEmail(name,email,phone,message){
    Email.send({
        Host: "smtp.gmail.com",
        Username: 'email',
        Password: "password",
        To: 'email recieve',
        From: 'email',
        Subject: `${name} sent you a message`,
        Body: `Name: ${name} <br/> Email: ${email} <br/> Phone: ${phone} <br/> Message: ${message}`,
    }).then((message)=>alert("The mail has been sent succesfully!"));
}