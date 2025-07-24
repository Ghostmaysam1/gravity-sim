import type { BodyConfig, Vector2 } from "../types";
import { G } from "../shared/shared.js";


export default class Body {
    position: Vector2;
    velocity: Vector2;
    speed: number;
    acceleration: Vector2;
    mass: number;
    radius: number;
    netForce: Vector2;
    isStatic: boolean;
    color: string;

    constructor(config: BodyConfig) {
        this.position = config.position;
        this.velocity = config.velocity || { x: 0, y: 0 };
        this.acceleration = config.acceleration || { x: 0, y: 0 };
        this.mass = config.mass;
        this.radius = config.radius;
        this.netForce = { x: 0, y: 0 };
        this.isStatic = config.isStatic || false;
        this.color = config.color || 'white';
        this.speed = 0;
    }

    public applyAcceleration(acceleration: Vector2) {
        this.acceleration.x = acceleration.x;
        this.acceleration.y = acceleration.y;
    }

    public applyNetForce(force: Vector2) {
        this.netForce.x = force.x;
        this.netForce.y = force.y;
    }

    public calculateAllForces(body: Body, bodies: Body[]) {
        const memory = []

        for (let i = 0; i < bodies.length; i++) {
            let body2 = bodies[i];

            if (body == body2) {
                continue;
            }

            // let force = this.calculateGravityForce(body, body2)
            let force = this.calculateShellGravityForce(body, body2)
            memory.push(force);
        }

        for (let i = 0; i < memory.length; i++) {
            this.netForce.x += memory[i].x;
            this.netForce.y += memory[i].y;
        }
    }

    public resolveElasticCollision(body1: Body, body2: Body) {
        const xVelocityDiff = body1.velocity.x - body2.velocity.x;
        const yVelocityDiff = body1.velocity.y - body2.velocity.y;

        const xDist = body2.position.x - body1.position.x;
        const yDist = body2.position.y - body1.position.y;

        // Check if they’re moving toward each other
        if (xVelocityDiff * xDist + yVelocityDiff * yDist >= 0) return;

        const angle = -Math.atan2(body2.position.y - body1.position.y, body2.position.x - body1.position.x);

        const m1 = body1.mass;
        const m2 = body2.mass;

        // Rotate velocities
        const u1 = this.rotate(body1.velocity, angle);
        const u2 = this.rotate(body2.velocity, angle);

        // Conservation of momentum (1D)
        const v1 = {
            x: u1.x * (m1 - m2) / (m1 + m2) + u2.x * 2 * m2 / (m1 + m2),
            y: u1.y
        };
        const v2 = {
            x: u2.x * (m2 - m1) / (m1 + m2) + u1.x * 2 * m1 / (m1 + m2),
            y: u2.y
        };

        // Rotate back
        const vFinal1 = this.rotate(v1, -angle);
        const vFinal2 = this.rotate(v2, -angle);

        body1.velocity = vFinal1;
        body2.velocity = vFinal2;
    }

    private rotate(velocity: Vector2, angle: number): Vector2 {
        return {
            x: velocity.x * Math.cos(angle) - velocity.y * Math.sin(angle),
            y: velocity.x * Math.sin(angle) + velocity.y * Math.cos(angle)
        };
    }


    public calculateGravityForce(body1: Body, body2: Body): Vector2 {
        let m1 = body1.mass;
        let m2 = body2.mass;

        let dx = body2.position.x - body1.position.x;
        let dy = body2.position.y - body1.position.y;

        // distance
        let r = Math.sqrt(dx * dx + dy * dy)

        r = Math.max(r, 1)

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

        // console.log(Fx)

        return { x: Fx, y: Fy };
    }

    public calculateSpeed() {
        let velocity = this.velocity
        this.speed = Math.sqrt(velocity.x * velocity.x + velocity.y * velocity.y);
    }
    

    public calculateShellGravityForce(body1: Body, body2: Body): Vector2 {
        const dx = body2.position.x - body1.position.x;
        const dy = body2.position.y - body1.position.y;
        let r = Math.sqrt(dx * dx + dy * dy);
        
        if (r < body1.radius + body2.radius) {
            // this.resolveElasticCollision(body1, body2);
        }

        const m1 = body1.mass;
        const m2 = body2.mass;
        const R = body2.radius;

        let forceMagnitude = 0;

        if (r >= R) {
            forceMagnitude = G * m1 * m2 / (r * r);
        } else {
            const effectiveMass = m2 * Math.pow(r / R, 3);
            forceMagnitude = G * m1 * effectiveMass / (r * r);
        }

        const nx = dx / r;
        const ny = dy / r;

        return {
            x: forceMagnitude * nx,
            y: forceMagnitude * ny
        };
    }


    public update(dt: number, body: Body, bodies: Body[]) {
        if (this.isStatic)
            return;

        this.calculateAllForces(body, bodies);


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
        this.calculateSpeed();
        this.netForce = { x: 0, y: 0 };
    }
}