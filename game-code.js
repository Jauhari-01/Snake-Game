
//============= variables and constants for snacks initial value===================
let direction = { x: 0, y: 0 };

//Sound variables
const foodSound = new Audio('./music/food.mp3');
const gameOverSound = new Audio('./music/gameover.mp3')
const moveSound = new Audio("music/move.mp3");
const musicSound = new Audio("music/music.mp3");
const cube_width = 18;

let speed = 7;
let lastPaintTime = 0;
let snackArray = [
    { x: 13, y: 15 }
]
let snackFood = { x: 5, y: 5 };
let score = 0;

let hiscoreval = 0;// for hiscore
//=====================================================================================

//========================================= Game Functions=======================================

//--------------------Util functions-----------------------------------
const isCollide = (arr)=>{
    //if you bump into yourself
    for(let i =1 ; i < arr.length ; i++){
        if(arr[i].x === arr[0].x && arr[i].y === arr[0].y){
            return true;
        }
    }
    // if you bump on wall
    if( (arr[0].x >=cube_width || arr[0].x <=0)  || (arr[0].y >=cube_width || arr[0].y <=0 )){
        return true;
    }
    return false;
}

// function for if food has eaten by snake
const isEaten = ()=>{
    return (snackArray[0].x === snackFood.x && snackArray[0].y === snackFood.y);
}
//-----------------------------------------------------------------


//------------function actually running game------------------

//-------main function-----------------
const main = (ctime) => {
    window.requestAnimationFrame(main);
    if ((ctime - lastPaintTime) / 1000 < 1 / speed) {
        return;
    }
    lastPaintTime = ctime;
    gameEngine();
}
//-------------------------------------

//------------Game engin function-----------
const gameEngine = () => {


    // *********Part 1 : Updating the snake array and food ***********
    // if snack collides
    if(isCollide(snackArray)){
        
        gameOverSound.play();
        musicSound.pause();
        direction = {x:0,y:0};

        alert("Game Over . Press any key to play again!");
        score = 0;
        scoreBox.innerHTML = "Score : "+score;
        snackArray = [
            { x: 13, y: 15 }
        ]
        musicSound.play();
    }

    // If snake has eaten the food then we have to increase the size of 
    // the snake and increment the score and regenrate the food
    if(isEaten()){
        foodSound.play();
        score += 1;
        scoreBox.innerHTML = "Score : "+score;
        if(score>hiscoreval){
            hiscoreval = score;
            localStorage.setItem("hiscore", JSON.stringify(hiscoreval));
            hiscoreBox.innerHTML = "HiScore: " + hiscoreval;
        }
        snackArray.unshift({x: snackArray[0].x + direction.x , y:snackArray[0].y + direction.y});
        let a = 2;
        let b = 16;
        snackFood = {x: Math.round(a + (b-a)* Math.random()), y: Math.round(a + (b-a)* Math.random())};
    }

    //Moving the snake
    for(let i = snackArray.length-2 ; i >= 0 ; i--){
        snackArray[i+1] = {...snackArray[i]};
    }
    snackArray[0].x += direction.x;
    snackArray[0].y += direction.y;


 //********* Part 2 : *********************
    //Display(render) the snake
    board.innerHTML = "";
    snackArray.forEach((e, index) => {
        let snakeElement = document.createElement('div');
        snakeElement.style.gridRowStart = e.y;
        snakeElement.style.gridColumnStart = e.x;
        if (index === 0) {
            snakeElement.classList.add('snake-head');
        } else {
            snakeElement.classList.add('snake-body');
        }
        board.appendChild(snakeElement);
    })
    //Display(render) th food
    let snakefood = document.createElement('div');
    snakefood.style.gridRowStart = snackFood.y;
    snakefood.style.gridColumnStart = snackFood.x;
    snakefood.classList.add('food');
    board.appendChild(snakefood);
}

//==================================================================================


//---------- Main logic starts here--------------

window.requestAnimationFrame(main);
musicSound.play();
let hiscore = localStorage.getItem("hiscore"); // variable for hiscore 
if(hiscore === null){
    hiscoreval = 0;
    localStorage.setItem("hiscore", JSON.stringify(hiscoreval))
}
else{
    hiscoreval = JSON.parse(hiscore);
    hiscoreBox.innerHTML = "HiScore: " + hiscore;
}

//taking input
window.addEventListener('keydown', (e) => {
    direction = { x: 0, y: 1 }; // starts the game
    moveSound.play();
    switch (e.key) {

        case 'ArrowUp': 
            console.log("ArrowUp"); 
            direction.x = 0;
            direction.y = -1;
            break;
        case 'ArrowDown': 
            console.log("Arrowdown");
            direction.x = 0;
            direction.y = 1;
            break;

        case 'ArrowLeft': 
            console.log("ArrowLeft"); 
            direction.x = -1;
            direction.y = 0;
            break;
        case 'ArrowRight': 
            console.log("ArrowRight"); 
            direction.x = 1;
            direction.y = 0;
            break;
    }
})
//-----------------------------------------------------------
// The question is most simply answered with. requestAnimationFrame produces higher quality
// animation completely eliminating flicker and shear that can happen when using setTimeout or setInterval,
// and reduce or completely remove frame skips.

// Shear
// is when a new canvas buffer is presented to the display buffer midway 
// through the display scan resulting in a shear line caused by the mismatched 
// animation positions.

// Flicker
// is caused when the canvas buffer is presented to the display buffer before 
// the canvas has been fully rendered.

// Frame skip
// is caused when the time between rendering frames is not in precise sync with 
// the display hardware. Every so many frames a frame will be skipped producing inconsistent animation. 
// (There are method to reduce this but personally I think these methods produce worse overall results) 
// As most devices use 60 frames per second (or multiple of) resulting in a new frame every 16.666...ms and the 
// timers setTimeout and setInterval use integers values they can never perfectly match 
// the framerate (rounding up to 17ms if you have interval = 1000/60)