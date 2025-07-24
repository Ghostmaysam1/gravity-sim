export declare class TinyCanvas {
    private frameCount;
    private lastFpsUpdate;
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;
    dt: number;
    width: number;
    height: number;
    mouse: {
        x: number;
        y: number;
    };
    fps: number;
    constructor(canvasId?: string);
    resize(): void;
    clear(color?: string): void;
    circle(x: number, y: number, r: number, color?: string): void;
    /**
     * @typedef {Object} CircleShape
     * @property {'circle'} type
     * @property {string} name
     * @property {number} id
     * @property {Object} shape
     * @property {string} color
     * @property {number} shape.x
     * @property {number} shape.y
     * @property {number} shape.r
     * @property {number} mass
     */
    /**
     * @typedef {Object} PolygonShape
     * @property {'polygon'} type
     * @property {string} name
     * @property {number} id
     * @property {string} color
     * @property {Object} shape
     * @property {{ x: number, y: number }[]} shape
     * @property {number} mass
     */
    /**
     * @typedef {CircleShape | PolygonShape} ShapeType
     */
    /**
     * @param {ShapeType} shape
     */
    text(txt: string, x: number, y: number, size?: number, color?: string): void;
    loop(callback: Function): void;
}
