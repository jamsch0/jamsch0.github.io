import {
    PerspectiveCamera,
    Vector2,
    Vector3,
} from "three";

export default class OrbitCameraControls {
    private readonly startExp: number = 6;

    private radius: number;
    private position: Vector3;
    private mouseDown: boolean = false;
    private mouseClickPosition: Vector2;

    constructor(
        private readonly camera: PerspectiveCamera,
        private readonly startRadius: number,
        private startPosition: Vector3,
        private readonly origin: Vector3 = new Vector3(0, 0, 0),
    ) {
        this.radius = this.startExp;
        this.position = startPosition.clone();

        this.rotateCamera();
    }

    public addEventListeners(canvas: HTMLCanvasElement): void {
        canvas.addEventListener("mousedown", event =>
            this.onMouseDown(new Vector2(event.clientX, event.clientY)));

        document.addEventListener("mouseup", () => this.onMouseUp());

        document.addEventListener("mousemove", event =>
            this.onMouseMove(new Vector2(event.clientX, event.clientY)));

        canvas.addEventListener("wheel", event => {
            event.preventDefault();
            this.onMouseWheel(event.deltaY)
        });
    }

    public onMouseDown(mousePosition: Vector2): void {
        this.mouseDown = true;
        this.mouseClickPosition = mousePosition;
    }

    public onMouseUp(): void {
        this.mouseDown = false;
        this.startPosition = this.position;
    }

    public onMouseMove(mousePosition: Vector2): void {
        if (!this.mouseDown) {
            return;
        }

        const delta = mousePosition.clone()
            .sub(this.mouseClickPosition)
            .multiplyScalar(1 / 250);
        this.position = this.startPosition.clone()
            .sub(new Vector3(delta.x, delta.y, 0));

        this.rotateCamera();
    }

    public onMouseWheel(wheelDelta: number): void {
        const delta = -wheelDelta / 10_000;
        if (this.getScaledRadius(this.radius - delta) >= 0) {
            this.radius -= delta;
            this.zoomCamera();
        }
    }

    public update(deltaTime: number): void {
        if (this.mouseDown) {
            return;
        }

        this.position.x += deltaTime / 3000;
        this.startPosition = this.position.clone();
        this.rotateCamera();
    }

    private getScaledRadius(radius: number): number {
        return Math.exp(radius) - Math.exp(this.startExp) + this.startRadius;
    }

    private rotateCamera(): void {
        this.camera.position.y = -this.position.y;
        this.camera.position.x = Math.sin(this.position.x);
        this.camera.position.z = Math.cos(this.position.x);

        this.zoomCamera();
        this.camera.lookAt(this.origin);
    }

    private zoomCamera(): void {
        this.camera.position.normalize()
            .multiplyScalar(this.getScaledRadius(this.radius));
    }
}
