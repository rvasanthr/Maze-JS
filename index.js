// Destructuring Matter
const { Engine, Render, Runner, World, Bodies } = Matter;
// World custom dimensions
//Square shape for now, to ease ogic implementation
const width = 600;
const height = 600;
// Cells count
const cells = 3;
// Matter.js world creation
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { width, height, wireframes: true },
});
Render.run(render);
Runner.run(Runner.create(), engine);
// Adding a bodies to the world
// The Wall, boundaries tied to world width and height respectively
const walls = [
    Bodies.rectangle(width / 2, 0, width, 40, { isStatic: true }),
    Bodies.rectangle(width / 2, height, width, 40, { isStatic: true }),
    Bodies.rectangle(0, height / 2, 40, height, { isStatic: true }),
    Bodies.rectangle(width, height / 2, 40, height, { isStatic: true })
];
// Adding objects to the world create
World.add(world, walls);
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
const grid = Array(cells).fill(null).map(() => (Array(cells).fill(false)));
// Make Verticals
const verticals = Array(cells).fill(null).map(() => (Array(cells - 1).fill(false)));
// Make Horizontals
const horizontals = Array(cells - 1).fill(null).map(() => (Array(cells).fill(false)));
// Testing
console.log(grid);
console.log(verticals);
console.log(horizontals);
// Starting Position
// Row
const startRow = Math.floor(Math.random() * cells);
// Column
const startColumn = Math.floor(Math.random() * cells);
// Testing
// console.log(startRow, startColumn);
// Step through cell function, iterates through the cells
const stepThroughCell = (row, column) => {
    // Go to cell [row, column]
    if (grid[row][column]) {
        // - If the cell was visited, the return
        return;
    }
    // - Mark the cell as visited (true/false)
    grid[row][column] = true;
    // Assemble randomly ordered list of neighbours
    //        c - 1   |    c    | c + 1
    // r-1  ; cell    |  CELL  | cell
    //   r  ; CELL   |  home  | CELL
    // r + 1; cell  |  CELL   | cell
    const neighbours = shuffle([
        // Above
        [row - 1, column],
        // Left
        [row, column - 1],
        // Right
        [row, column + 1],
        // Below
        [row + 1, column]
    ]);
    console.log('Neighbours:', neighbours);
    // For each neighbour...
    // - Check whether that neighbour is out of bounds
    //   - row or column cannot be less than 0 or greater than row or column.
    // - If neighbour had been visited, continue to next neighbour
    // - Remove the wall (horizontals or verticals, depends on direction of movement)
    // - Visit next cell (invoke stepThroughCell Fn with cell cordinates to visit)
};
// Invoke stepThroughCell Fn
// stepThroughCell(startRow, startColumn);
stepThroughCell(1, 1);