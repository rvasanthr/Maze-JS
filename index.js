// Destructuring Matter
const { Engine, Render, Runner, World, Bodies, Body, Events } = Matter;
// World custom dimensions
// For SQUARE or RECTANGLE
//Square shape for now, to ease logic implementation
const width = window.innerWidth - 4;
const height = window.innerHeight - 4;
const mazeWallWidth = 2.5;
// Cells count
// const cells = 7;
const cellsHorizontal = 10;
const cellsVertical = 7;
// Inner Wall dimension control, new x, y
// const unitLength = width / cells;
const unitLengthX = width / cellsHorizontal;
const unitLengthY = height / cellsVertical;
// Inner Wall dimension control, width
const innerWallWidth = 3;
// Matter.js world creation
// Engine
const engine = Engine.create();
// Disabling gravity along y
engine.world.gravity.y = 0;
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { width, height, wireframes: true },
});
Render.run(render);
Runner.run(Runner.create(), engine);
// Adding a bodies to the world
// The Maze Walls, boundaries tied to world width and height respectively
const walls = [
    // Bodies.rectangle(x, y, width, height); // Syntax
    Bodies.rectangle(width / 2, 0, width, mazeWallWidth, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, mazeWallWidth, { isStatic: true }),
    Bodies.rectangle(0, height / 2, mazeWallWidth, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, mazeWallWidth, height, { isStatic: true })
];
// Adding objects to the world created
World.add(world, walls);
// The GOAL object component
const goal = Bodies.rectangle((width - unitLengthX / 2), (height - unitLengthY / 2),
    (unitLengthX * 0.8), (unitLengthY * 0.8), { label: 'goal', isStatic: true });
// Adding the goal to the Matter.js world
World.add(world, goal);
// Bodies.circle(x, y, radius);
// BALL component
const ballRadius = Math.min(unitLengthX, unitLengthY) / 3.7;
const ball = Bodies.circle(unitLengthX / 2, unitLengthY / 2, ballRadius, { label: 'ball' });
// Adding ball to world
World.add(world, ball);
// Event listener on the document to control ball
document.addEventListener('keydown', event => {
    // Getting the velocity of the ball
    const { x, y } = ball.velocity;
    // console.log(x, y);
    const accleration = 2;
    // Move ball Up
    if (event.key === 'ArrowUp') {
        // Arrow Up, key = 'ArrowUp'
        // console.log('Move ball up');
        Body.setVelocity(ball, { x, y: y - accleration });
    }
    // Move ball Down
    if (event.key === 'ArrowDown') {
        // Arrow Down, key = 'ArrowDown'
        // console.log('Move ball Down');
        Body.setVelocity(ball, { x, y: y + accleration });
    }
    // Move ball Left
    if (event.key === 'ArrowLeft') {
        // Arrow Left, key = 'ArrowLeft'
        // console.log('Move ball Left');
        Body.setVelocity(ball, { x: x - accleration, y });
    }
    // Move ball Right
    if (event.key === 'ArrowRight') {
        // Arrow Right, key = 'ArrowRight'
        // console.log('Move ball Right');
        Body.setVelocity(ball, { x: x + accleration, y });
    }
});
// MAZE GENERATOR
// shuffler Fn to randomize grid neighbours
const shuffle = (theArray) => {
    let length = theArray.length;
    // - Random number generated will always be between the indices range
    while (length > 0) {
        // Generate random index for swapping per iteration
        const randomIndex = Math.floor(Math.random() * length);
        // Eventual exit of loop
        // Prevents array index out of bounds error
        length--;
        // Swap
        const temp = theArray[length];
        theArray[length] = theArray[randomIndex];
        theArray[randomIndex] = temp;
    }
    return theArray;
}
// Grid Maker
const grid = Array(cellsVertical).fill(null).map(() => (Array(cellsHorizontal).fill(false)));
// Make Verticals
const verticals = Array(cellsVertical).fill(null).map(() => (Array(cellsHorizontal - 1).fill(false)));
// Make Horizontals
const horizontals = Array(cellsVertical - 1).fill(null).map(() => (Array(cellsHorizontal).fill(false)));
// Starting Positions
// Row
const startRow = Math.floor(Math.random() * cellsVertical);
// Column
const startColumn = Math.floor(Math.random() * cellsHorizontal);
// Testing
// console.log(startRow, startColumn);
// Step through cell function, iterates through the cells
const stepThroughCell = (row, column) => {
    // console.log(row, column);
    // Go to cell [row, column]
    if (grid[row][column]) {
        // - If the cell was visited, the return
        return;
    }
    // - Mark the cell as visited (true)
    grid[row][column] = true;
    // Assemble randomly ordered list of neighbours
    //        c - 1   |    c    | c + 1
    // r-1  ; cell    |  CELL  | cell
    //   r  ; CELL   |  home  | CELL
    // r + 1; cell  |  CELL   | cell
    const neighbours = shuffle([
        // Up
        [row - 1, column, 'up'],
        // Left
        [row, column - 1, 'left'],
        // Right
        [row, column + 1, 'right'],
        // Down
        [row + 1, column, 'down']
    ]);
    // console.log('Neighbours:', neighbours);
    // For each neighbour...
    for (let neighbour of neighbours) {
        // Destructuring
        const [nextRow, nextColumn, direction] = neighbour;
        // console.log(nextRow, nextColumn, direction);
        // - Check whether that neighbour is out of bounds
        if (nextRow < 0 || nextRow >= cellsVertical || nextColumn < 0 || nextColumn >= cellsHorizontal) {
            //   - row || column should not be < 0 || >= cells. if so skip
            // console.log('trigger 1');
            continue;
        }
        // - If neighbour had been visited, skip onto next neighbour
        if (grid[nextRow][nextColumn]) {
            // console.log('trigger 2');
            continue;
        }
        // - Remove the wall (horizontals or verticals, depends on direction of movement)
        // Verticals walls
        //      c:0   c:1
        // r:0 false false
        // r:1 false false
        // r:2 false false
        // Horizontal walls
        //   c:0   c:1  c:2
        // r:0 false false false
        // r:1 false false false
        if (direction === 'left') {
            // console.log('Sub trigger 1');
            verticals[row][column - 1] = true;
        } else if (direction === 'right') {
            // console.log('Sub trigger 2');
            verticals[row][column] = true;
        } else if (direction === 'up') {
            // console.log('Sub trigger 3');
            horizontals[row - 1][column] = true;
        } else if (direction === 'down') {
            // console.log('Sub trigger 4');
            horizontals[row][column] = true;
        }
        // - Visit next cell (invoke stepThroughCell Fn with cell cordinates to visit)
        stepThroughCell(nextRow, nextColumn);
    }
};
// Invoke stepThroughCell Fn
stepThroughCell(startRow, startColumn);
// stepThroughCell(1, 1);
// Testing
// console.log('Grid:', grid);
// console.log('Verticals:', verticals);
// console.log('Horizontals:', horizontals);
// Iterating over horizontals and verticals to create walls
// Horizontals
horizontals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            // if there is no wall, return
            return;
        } else {
            // If there is wall, build rectangle
            // Bodies.rectangle(x, y, width, height);
            const horizontalWall = Bodies.rectangle((columnIndex * unitLengthX + unitLengthX / 2),
                (rowIndex * unitLengthY + unitLengthY), unitLengthX, innerWallWidth, { label: 'wall', isStatic: true });
            World.add(world, horizontalWall);
        }
    });
});
// Verticals
verticals.forEach((row, rowIndex) => {
    row.forEach((open, columnIndex) => {
        if (open) {
            return;
        } else {
            // Bodies.rectangle(x, y, width, height);
            const verticalWall = Bodies.rectangle((columnIndex * unitLengthX + unitLengthX), (rowIndex * unitLengthY + unitLengthY / 2), innerWallWidth, unitLengthY, { label: 'wall', isStatic: true });
            World.add(world, verticalWall);
        }
    });
});
// WIN Condition
// collisionStart property monitors collision events between Matter objects
// MatterJS uses single event object, so event pairs array gets wiped out when called
Events.on(engine, 'collisionStart', event => {
    // console.log(event);
    // So, get collision from pairs, triggering forEach per pair
    event.pairs.forEach(collision => {
        // console.log(collision);
        // Labels if ball and goal
        const labels = ['ball', 'goal'];
        // Not sure if A or B is goal or ball, so
        if (labels.includes(collision.bodyA.label) && labels.includes(collision.bodyB.label)) {
            // console.log('You won!!!');
            // Turning World gravity back on for dramatic Win Effect
            world.gravity.y = 1;
            // Using labes to identify inner walls and making them drop down
            world.bodies.forEach(body => {
                if (body.label === 'wall') {
                    Body.setStatic(body, false);
                }
            });
        }
    });
});