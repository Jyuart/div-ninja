import { Engine, Render, Runner, Body, Bodies, Composite, Constraint, MouseConstraint, Events } from 'matter-js';
import { isMobile } from './helpers';

var engine = Engine.create();

const ww = window.innerWidth;
const wh = window.innerHeight;

// NOTE: probaby have a wrapper to store object's size to be able to have them different
const divWidth = 150;
const divHeight = 150;

var render = Render.create({
    element: document.body,
    engine: engine,
    options: {
        // TODO: find a way to render it full screen without small gaps
        width: window.innerWidth,
        height: window.innerHeight
    }
});

// NOTE: Temporary stuff, to be deleted, after I wire it up with phone manipulation
const mouseConstraint = MouseConstraint.create(engine);
const mouse = Bodies.circle(ww / 2, wh / 2, 20);
mouse.isSensor = true;
mouse.label = 'mouse';
// NOTE: Required to remove mouse's object gravity

// NOTE: don't fix 'duplicated' logic. It'll be easier to just get rid of mouse at some point
const cursor: Body = Bodies.circle(ww / 2, wh / 2, 30);

Events.on(engine, 'beforeUpdate', () => {
    const gravity = engine.gravity;

    Body.applyForce(mouse, mouse.position, {
        x: -gravity.x * gravity.scale * mouse.mass,
        y: -gravity.y * gravity.scale * mouse.mass,
    });
    Body.applyForce(cursor, cursor.position, {
        x: -gravity.x * gravity.scale * cursor.mass,
        y: -gravity.y * gravity.scale * cursor.mass,
    });
});

Events.on(engine, 'collisionStart', (event) => {
    // TODO: find a way to do this without callign forEach on the pair
    event.pairs.forEach((collision) => {
        const bodyA = collision.bodyA;
        const bodyB = collision.bodyB;

        // NOTE: ignore this for pieces created after hit
        if (bodyA.label != 'div' && bodyB.label != 'div') {
            return
        }

        if (bodyA == cursor) {
            divHit(bodyB);
        } else {
            divHit(bodyA);
        }

    });
});

function divHit(div: Body) {
    Composite.remove(engine.world, [div]);

    const { x: posX, y: posY } = div.position;
    const { y: forceY } = div.force;
    const divHalfWidth = divWidth / 2;

    const pieceA = Bodies.rectangle(posX - divHalfWidth, posY, divHalfWidth, divHeight);
    pieceA.isSensor = true;
    pieceA.force = { x: -0.1, y: forceY * -10 };

    const pieceB = Bodies.rectangle(posX + divHalfWidth, posY, divHalfWidth, divHeight);
    pieceB.isSensor = true;
    pieceB.force = { x: 0.1, y: forceY * -10 };

    Composite.add(engine.world, [pieceA, pieceB]);
}


function startDivsGeneration(interval: number) {
    setInterval(() => {
        const x = Math.round(Math.random() * window.innerWidth);
        var anotherBody = Bodies.rectangle(x, window.innerHeight, divWidth, divHeight);
        // NOTE: needed to remove physics collision for parts created after hit
        anotherBody.label = 'div';
        Body.setMass(anotherBody, 50);
        const randomXForce = Math.random() - 0.5;
        anotherBody.force = { x: randomXForce, y: -5 };
        Composite.add(engine.world, [anotherBody]);
    }, interval)
};

function addObjectToTheWorld(...bodies: (Body | Constraint | MouseConstraint)[]) {
    Composite.add(engine.world, bodies);
}

addObjectToTheWorld(mouse, mouseConstraint, cursor);
startDivsGeneration(2000);

// NOTE: don't need the whole canvas on mobile
if (!isMobile()) {
    Render.run(render);
    var runner = Runner.create();
    Runner.run(runner, engine);
}

// exported stuff
export function changeCursorPosition(x: number, y: number) {
    cursor.position = { x, y };
}
