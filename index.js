// Destructuring Matter
const { Engine, Render, Runner, World, Bodies } = Matter;
// World dimensions
//Square shape for now, to ease ogic implementation
const width = 600;
const height = 600;

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
// Make grid
const grid = Array(3).fill(null).map(() => (Array(3).fill(false)));
// Testing
console.log(grid);