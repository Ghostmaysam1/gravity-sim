import { TinyCanvas } from './drawing/TinyCanvas.js';
import Body from './Body/Body.js';
const tc = new TinyCanvas("canvas");
var bodies = [];
tc.loop((delta) => {
    var _a;
    tc.clear();
    for (let i = 0; i < bodies.length; i++) {
        let body = bodies[i];
        tc.circle(body.position.x, body.position.y, body.radius, body.color);
        tc.drawVector(body.position, body.velocity, "green", 1100);
        tc.drawVector(body.position, body.acceleration, 'red', 1000000);
        body.update(delta, body, bodies);
    }
    tc.text((((_a = bodies[bodies.length - 1]) === null || _a === void 0 ? void 0 : _a.speed) * 1000 / 36).toFixed(2) + 'cm/s', 140, 140, 70);
});
const Sun = new Body({
    position: { x: tc.width / 2, y: tc.height / 2 },
    mass: 1000000 * 10000000,
    radius: 150,
    color: 'orange',
    isStatic: true
});
const Earth = new Body({
    position: { x: tc.width / 3, y: tc.height / 3 },
    mass: 1000000 * 100000,
    radius: 45,
    color: 'green'
});
const Unknown = new Body({
    position: { x: 2500, y: 660 },
    mass: 1000000 * 10000,
    radius: 40,
    color: 'white',
    isStatic: true
});
bodies.push(Sun);
bodies.push(Earth);
// bodies.push(Unknown)
controlMove();
function controlMove() {
    document.addEventListener('click', () => {
        Earth.velocity.x += 0.3;
    });
}
function controlPlus() {
    document.addEventListener('click', (e) => {
        if (!e.shiftKey && !e.ctrlKey)
            bodies.push(new Body({
                position: { x: e.pageX, y: e.pageY },
                mass: 1000000 * 10000000,
                radius: 250,
                color: 'orange',
            }));
        if (e.altKey) {
            bodies = [];
        }
        if (e.ctrlKey && !e.shiftKey) {
            bodies.push(new Body({
                position: { x: e.pageX, y: e.pageY },
                mass: 1000000 * 10000000,
                radius: 250,
                color: 'orange',
                isStatic: true
            }));
        }
        if (e.ctrlKey && e.shiftKey) {
            bodies.push(new Body({
                position: { x: e.pageX, y: e.pageY },
                mass: 1000000 * 100000,
                radius: 65,
                color: 'green',
                isStatic: true
            }));
        }
        if (e.shiftKey && !e.ctrlKey)
            bodies.push(new Body({
                position: { x: e.pageX, y: e.pageY },
                mass: 1000000 * 100000,
                radius: 65,
                color: 'green'
            }));
    });
}
