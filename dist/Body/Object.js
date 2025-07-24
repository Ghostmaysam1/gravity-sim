import { G } from "../shared/shared";
export class Body {
    constructor(config) {
        this.position = config.position;
        this.velocity = config.velocity;
        this.acceleration = config.acceleration;
        this.mass = config.mass;
        this.radius = config.radius;
        this.netForce = config.netForce;
        this.isStatic = config.isStatic || false;
        this.color = config.color || 'white';
    }
    applyAcceleration(acceleration) {
        this.acceleration.x += acceleration.x;
        this.acceleration.y += acceleration.y;
    }
    applyNetForce(force) {
        this.netForce.x += force.x;
        this.netForce.y += force.y;
    }
    calculateAllForces(body, bodies) {
        const memory = [];
        for (let i = 0; i < bodies.length; i++) {
            let body = bodies[i];
            let body2 = bodies[i];
            if (body == body2) {
                continue;
            }
            let force = this.calculateGravityForce(body, body2);
            memory.push(force);
        }
    }
    calculateGravityForce(body1, body2) {
        let m1 = body1.mass;
        let m2 = body2.mass;
        let dx = body1.position.x - body2.position.x;
        let dy = body1.position.y - body2.position.y;
        // distance
        let r = Math.sqrt(dx * dy + dx * dy);
        // normalize the direction
        let nx = dx / r;
        let ny = dy / r;
        // F = G * ((m1 * m2) / (r * r))
        // G = 6.67430e-11
        // m = mass
        // r = radius
        let F = G * (m1 * m2) / (r * r);
        // apply the force to the true direction
        let Fx = F * nx;
        let Fy = F * ny;
        return { x: Fx, y: Fy };
    }
    update(dt) {
        if (this.isStatic)
            return;
        // F = ma -> a = F/m
        // a = acceleration
        // F = N
        // m = mass
        this.acceleration.x = this.netForce.x / this.mass;
        this.acceleration.y = this.netForce.y / this.mass;
        this.velocity.x += this.acceleration.x * dt;
        this.velocity.y += this.acceleration.y * dt;
        this.position.x += this.velocity.x * dt;
        this.position.y += this.velocity.y * dt;
        // reset netForce for the next frame
        this.netForce = { x: 0, y: 0 };
    }
}
