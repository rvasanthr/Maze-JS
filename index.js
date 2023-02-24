// Destructuring Matter
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;
// World dimensions
const width = 800;
const height = 600;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { width, height }
});
Render.run(render);
Runner.run(Runner.create(), engine);
// Adding mouse constraint and mouse to world
World.add(world, MouseConstraint.create(engine, { mouse: Mouse.create(render.canvas) }));
// Adding a shapes to the world
// The Wall
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
];
// Other shapes
// const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: false });
// Adding objects to the world create
for (let i = 0; i < 20; i++) {
    // World.add(world, shape);
    World.add(world, Bodies.rectangle(Math.random() * width, Math.random() * height, 50, 50, { isStatic: false }));
}
World.add(world, walls);