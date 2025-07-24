export type Vector2 = {x: number, y: number}

export type G = 6.67430e-11 // in SI unit

export type BodyConfig = {
    position: Vector2;
    velocity?: Vector2;
    acceleration?: Vector2;
    mass: number;
    radius: number;
    isStatic?: boolean;
    color?: string;
}
