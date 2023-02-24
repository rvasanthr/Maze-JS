// Destructuring Matter
const { Engine, Render, Runner, World, Bodies, MouseConstraint, Mouse } = Matter;
const engine = Engine.create();
const { world } = engine;
const render = Render.create({
    element: document.body,
    engine: engine,
    options: { width: 800, height: 600 }
});
Render.run(render);
Runner.run(Runner.create(), engine);
// Adding mouse constraint and mouse to world
World.add(world, MouseConstraint.create(engine, { mouse: Mouse.create(render.canvas) }));
// Adding a shapes to the world
const walls = [
    Bodies.rectangle(400, 0, 800, 40, { isStatic: true }),
    Bodies.rectangle(400, 600, 800, 40, { isStatic: true }),
    Bodies.rectangle(0, 300, 40, 600, { isStatic: true }),
    Bodies.rectangle(800, 300, 40, 600, { isStatic: true })
];
const shape = Bodies.rectangle(200, 200, 50, 50, { isStatic: false });
// Adding objects to the world create
World.add(world, shape);
World.add(world, walls);