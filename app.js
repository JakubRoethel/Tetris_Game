document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector(".grid");
    let squares = Array.from(document.querySelectorAll(".grid div"));
    const scoreDisplay = document.querySelector("#score");
    const startBtn =document.querySelector("#start-btn");
    const width = 10;
    let nextRandom = 0;
    let timerId
    let score = 0
    const colors = [
        "orange",
        "red",
        "purple",
        "green",
        "blue"
    ]
    // console.log(squares)
      //The Tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [1, width+1, width*2+1, width*2],
        [width, width*2, width*2+1, width*2+2]
    ];
    const zTetromino = [
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1],
        [0,width,width+1,width*2+1],
        [width+1, width+2,width*2,width*2+1]
    ];
    const tTetromino = [
        [1,width,width+1,width+2],
        [1,width+1,width+2,width*2+1],
        [width,width+1,width+2,width*2+1],
        [1,width,width+1,width*2+1]
    ];
    const oTetromino = [
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1],
        [0,1,width,width+1]
    ];
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ];
    const theTetrominoes = [lTetromino, zTetromino,tTetromino, oTetromino,iTetromino];
    let currentPosition = 4;
    let currentRotation = 0;

    //randomly select a Tetromino and its first rotation
    let random = Math.floor(Math.random()*theTetrominoes.length);

    // console.log(random)
    let current = theTetrominoes[random][currentRotation];
    console.log(current);

    //draw the Tetromino
    const draw = () => {
        current.forEach(i=> {
            squares[currentPosition + i].classList.add("tetromino");
            squares[currentPosition + i].style.backgroundColor = colors[random];
        });
    };
    // console.log(squares)

    // undraw the Tetromino 
    const unDraw = () => {
        current.forEach(i => {
            squares[currentPosition + i].classList.remove('tetromino');
            squares[currentPosition + i].style.backgroundColor = ""
        });
    };

    // make the tetromino move down every second

    const moveDown = () => {
        unDraw();
        currentPosition += width;
        draw();
        freeze();
    };

    //keyCodes
    const contoleKey = (e) => {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    };
    document.addEventListener("keyup", contoleKey);

    // freeze tetronimo
    const freeze = () => {
        if (current.some(i => squares[currentPosition + i + width].classList.contains("taken"))) {
            current.forEach(i => squares[currentPosition + i].classList.add("taken"));
            //start next tetromino
            random=nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            current = theTetrominoes[random][currentRotation];
            currentPosition = 4;
            draw();
            displayShape();
            addScore();
            gameOver();
        };
    };

    // move left and right to the edge function
    const moveLeft = () => {
        unDraw();
        const isAtLeftEdge = current.some(i => (currentPosition + i) % width === 0);
        if (!isAtLeftEdge) currentPosition -= 1;
        if(current.some(i => squares[currentPosition + i].classList.contains("taken"))) {
            currentPosition +=1
        };
        draw ();
    };
    const moveRight = () => {
        unDraw();
        const isAtRightEdge = current.some(i => (currentPosition + i) % width === width -1);

        if(!isAtRightEdge) currentPosition +=1;

        if(current.some(i => squares[currentPosition + i].classList.contains("taken"))) {
            currentPosition -=1
        };
        draw();
    };

    //rotate
    const rotate = () => {
        unDraw();
        currentRotation ++
        // console.log("currentRotation", currentRotation)
        // console.log("length", current.length)
        if (currentRotation == current.length) {
            currentRotation = 0
        };
        current = theTetrominoes[random][currentRotation];
        draw();
    };

    //show up-next tetromino in mini-grid 
    const displaySquares = document.querySelectorAll(".mini-grid div");
    const displayWidth = 4;
    let displayIndex = 0;
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //Ltetromino
        [0,displayWidth,displayWidth+1,displayWidth*2+1], //Ztetromino
        [1,displayWidth,displayWidth+1,displayWidth+2], //Ttetromino
        [0,1,displayWidth,displayWidth+1], //Otetromino
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //Itetromino
    ];

    // display shape 
    const displayShape = () => {
        displaySquares.forEach(square => {
            square.classList.remove("tetromino");
            square.style.backgroundColor = "";
        });
        upNextTetrominoes[nextRandom].forEach(i=> {
            displaySquares[displayIndex + i].classList.add("tetromino");
            displaySquares[displayIndex + i].style.backgroundColor = colors[nextRandom];
        } );
    }

    // control button function 
    const btnControl = () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            timerId = setInterval(moveDown,1000);
            // nextRandom = Math.floor(Math.random()*theTetrominoes.length);
            displayShape();
        };
    };
    startBtn.addEventListener("click", btnControl);

    // add score
    const addScore = () => {
        for (let i=0; i<200; i +=width){
            const row = [i,i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8, i+9];
            if(row.every(index => squares[index].classList.contains("taken"))) {
                score += 10;
                scoreDisplay.innerHTML = score;
                row.forEach(index => {
                    squares[index].classList.remove("taken");
                    squares[index].classList.remove("tetromino")
                    squares[index].style.backgroundColor=""
                });
                const squaresRemoved = squares.splice(i,width);
                squares = squaresRemoved.concat(squares);
                squares.forEach( el => grid.appendChild(el));
            };
        };
    };

    // gameOver
    const gameOver = () => {
        if(current.some(i => squares[currentPosition + i].classList.contains("taken"))){
            scoreDisplay.innerHTML = "end";
            clearInterval(timerId);
        }
    };


});