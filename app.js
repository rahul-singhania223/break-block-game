// ------------ GLOABAL VARIABLES ----------//
const gameArea = document.querySelector('#game-area')
const gameOver = document.querySelector('#game-over');
const startBtn = document.querySelector('#start-btn');
const scoreDisplay = document.querySelector('#score-display');
const scoreDisplayOver = document.querySelector('#score-display-over');
const restartBtn = document.querySelector('#restart-btn');


const boardWidth = 560;
const boardHeight = 400;
const ballWidth = 20;
const userWidth = 120;
const blockWidth = 100;
const blockHeight = 20;
let userPosition = [260, 0];
let ballPosition = [160  , 200]
let initial = true;
let xDirection = 2;
let yDirection = -2;
let timerId;
let bigBlockPosition = [280, 50];
let score = 0;


startBtn.addEventListener('click', () => {
    timerId = setInterval(moveBall, 10);
})

// add blocks 
class Block {
    constructor(x, y) {
        this.bottomLeft = [x, y];
        this.bottomRight = [x + blockWidth, y];
        this.topLeft = [x, y + blockHeight];
        this.topRight = [x + blockWidth, y + blockHeight]
    }
}

let blocks = [
    new Block(10, boardHeight-blockHeight),
    new Block(10 * 2 + blockWidth, boardHeight-blockHeight),
    new Block(10 * 3 + blockWidth * 2, boardHeight-blockHeight),
    new Block(10 * 4 + blockWidth * 3, boardHeight-blockHeight),
    new Block(10 * 5 + blockWidth * 4, boardHeight-blockHeight),
    new Block(10, boardHeight-blockHeight*2-10),
    new Block(10 * 2 + blockWidth, boardHeight-blockHeight*2-10),
    new Block(10 * 3 + blockWidth * 2, boardHeight-blockHeight*2-10),
    new Block(10 * 4 + blockWidth * 3, boardHeight-blockHeight*2-10),
    new Block(10 * 5 + blockWidth * 4, boardHeight-blockHeight*2-10),
    new Block(10, boardHeight-blockHeight*3-20),
    new Block(10 * 2 + blockWidth, boardHeight-blockHeight*3-20),
    new Block(10 * 3 + blockWidth * 2, boardHeight-blockHeight*3-20),
    new Block(10 * 4 + blockWidth * 3, boardHeight-blockHeight*3-20),
    new Block(10 * 5 + blockWidth * 4, boardHeight-blockHeight*3-20),
    
]

const renderBlocks = () => {
    for(let i = 0; i < blocks.length; i++) {
        const block = document.createElement('div');
        block.classList.add('block');
        block.style.left = blocks[i].bottomLeft[0] + 'px';
        block.style.bottom = blocks[i].bottomLeft[1] + 'px';
        gameArea.appendChild(block);
    }
}

renderBlocks();



/// -----------GLOBAL FUNCTIONS -----------//

// restart the game -
restartBtn.addEventListener('click', () => {
    document.location.reload();
})

// -----------add user block ---------- //
const addUserBlock = () => {
    const userBlock = document.createElement('div');
    userBlock.classList.add('user-block');
    userBlock.style.left  = userPosition[0] + 'px';
    userBlock.style.bottom = userPosition[1] + 'px';
    gameArea.appendChild(userBlock);
    
}

addUserBlock();

// -------draw the user after every move ------ //

const userBlock = document.querySelector('.user-block');

const drawUser = () => {
    userBlock.style.left  = userPosition[0] + 'px';
    userBlock.style.bottom = userPosition[1] + 'px';
}


// ----------add ball ------------- //
const addBall = () => {
    const ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.left = ballPosition[0] + 'px';
    ball.style.bottom = ballPosition[1] + 'px';
    gameArea.appendChild(ball);
}

addBall()

// ----------draw ball ------------- //
const ball = document.querySelector('.ball');

const drawBall = () => {
    ball.style.left = ballPosition[0] + 'px';
    ball.style.bottom = ballPosition[1] + 'px';
}

// ------------move ball --------------- //
const moveBall = () => {
    ballPosition[0] += xDirection;
    ballPosition[1] += yDirection;
    drawBall();
    checkForCollision();
}



// -----------move user block ---------- //

const moveUser = () => {
    document.addEventListener('keydown', (e) => {
        switch(e.key) {
            case 'ArrowLeft': 
                (userPosition[0] != 0) ? userPosition[0] -= 10 : null;
                break;
            case 'ArrowRight':
                (userPosition[0]+userWidth != boardWidth) ? userPosition[0] += 10 : null;
                break;
        }

        drawUser();
        drawBall();
    })
}

moveUser();



//  ----------change direction ------------ //
const changeDirection = (hit) => {

    if(xDirection == 0 && yDirection == -2) {
        xDirection = 0;
        yDirection = 2;
    } else {
        if(hit == 'user') {
           yDirection = 2;
        } else if(hit == 'right') {
            xDirection = -2
        } else if(hit == 'up') {
            yDirection = -2;
        } else if(hit == 'left') {
            xDirection = 2;
        } else if(hit == 'blockBottom') {
            yDirection = -2;
        } else if(hit == 'blockRight') {
            xDirection = 2;
        } else if(hit == 'blockLeft') {
            xDirection = -2;
        } else if(hit == 'blockTop') {
            yDirection = 2;
        }
    }        

}

// check for game over
const checkGameOver = () => {
    if(blocks.length == 0 || ballPosition[1] < 0) {
        gameOver.style.display = 'flex';
        clearInterval(timerId)
    }
}

// ----------- check for collision --------- //
const checkForCollision = () => {

    // check for game over
    checkGameOver();
    
    // check for block collision ---

    let hitedBlock = {
        hited: false,
        index: null,
        side: null
    }

    for(let i = 0; i < blocks.length; i++) {
        let inRange = (ballPosition[0]+ballWidth >= blocks[i].bottomLeft[0] && ballPosition[0] <= blocks[i].bottomRight[0])
        let hitedBottom = (ballPosition[1]+ballWidth == blocks[i].bottomLeft[1] && inRange)
        let hitedTop = (ballPosition[1] == blocks[i].topLeft[1] && inRange);


        if(hitedBottom) {
           hitedBlock.hited = true;
           hitedBlock.side = 'blockBottom';
           hitedBlock.index = i;
        }

        if(hitedTop) {
            hitedBlock.hited = true;
           hitedBlock.side = 'blockTop';
           hitedBlock.index = i;       
        }
    }

    if(hitedBlock.hited) {
        const activeBlocks = Array.from(document.querySelectorAll('.block'));
        activeBlocks[hitedBlock.index].classList.remove('block');
        blocks.splice(hitedBlock.index, 1);
        score ++
        scoreDisplay.innerHTML = score;
        scoreDisplayOver.innerHTML = score;
        changeDirection(hitedBlock.side);
        
    }

   

    // user collision --
    let hitedUser = (ballPosition[1] == 20 && ballPosition[0] + ballWidth >= userPosition[0] && ballPosition[0] <= userPosition[0] + userWidth);

    if(hitedUser) {        
        changeDirection('user');        
    };


    // check for up wall colission --
    let hitedUp = (ballPosition[1] >= boardHeight-ballWidth);    

    if(hitedUp) {
        changeDirection('up');
    }

    // check for left wall collision --
    let hitedLeft = (ballPosition[0] == 0);
    if(hitedLeft) {
        changeDirection('left')
    }

    // check for left wall collision --
    let hitedRight = (ballPosition[0]+ballWidth == boardWidth);
    if(hitedRight) {
        changeDirection('right')
    }      
    

}


