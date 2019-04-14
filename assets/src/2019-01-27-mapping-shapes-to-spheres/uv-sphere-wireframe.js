import { Vector3, Vector2, WebGLRenderer, PerspectiveCamera, Scene, SphereGeometry, MeshBasicMaterial, Mesh } from 'https://unpkg.com/three@0.103.0/build/three.module.js';

var OrbitCameraControls = /** @class */ (function () {
    function OrbitCameraControls(camera, startRadius, startPosition, origin) {
        if (origin === void 0) { origin = new Vector3(0, 0, 0); }
        this.camera = camera;
        this.startRadius = startRadius;
        this.startPosition = startPosition;
        this.origin = origin;
        this.startExp = 6;
        this.mouseDown = false;
        this.radius = this.startExp;
        this.position = startPosition.clone();
        this.rotateCamera();
    }
    OrbitCameraControls.prototype.addEventListeners = function (canvas) {
        var _this = this;
        canvas.addEventListener("mousedown", function (event) {
            return _this.onMouseDown(new Vector2(event.clientX, event.clientY));
        });
        document.addEventListener("mouseup", function () { return _this.onMouseUp(); });
        document.addEventListener("mousemove", function (event) {
            return _this.onMouseMove(new Vector2(event.clientX, event.clientY));
        });
        canvas.addEventListener("wheel", function (event) {
            event.preventDefault();
            _this.onMouseWheel(event.deltaY);
        });
    };
    OrbitCameraControls.prototype.onMouseDown = function (mousePosition) {
        this.mouseDown = true;
        this.mouseClickPosition = mousePosition;
    };
    OrbitCameraControls.prototype.onMouseUp = function () {
        this.mouseDown = false;
        this.startPosition = this.position;
    };
    OrbitCameraControls.prototype.onMouseMove = function (mousePosition) {
        if (!this.mouseDown) {
            return;
        }
        var delta = mousePosition.clone()
            .sub(this.mouseClickPosition)
            .multiplyScalar(1 / 250);
        this.position = this.startPosition.clone()
            .sub(new Vector3(delta.x, delta.y, 0));
        this.rotateCamera();
    };
    OrbitCameraControls.prototype.onMouseWheel = function (wheelDelta) {
        var delta = -wheelDelta / 10000;
        if (this.getScaledRadius(this.radius - delta) >= 0) {
            this.radius -= delta;
            this.zoomCamera();
        }
    };
    OrbitCameraControls.prototype.update = function (deltaTime) {
        if (this.mouseDown) {
            return;
        }
        this.position.x += deltaTime / 3000;
        this.startPosition = this.position.clone();
        this.rotateCamera();
    };
    OrbitCameraControls.prototype.getScaledRadius = function (radius) {
        return Math.exp(radius) - Math.exp(this.startExp) + this.startRadius;
    };
    OrbitCameraControls.prototype.rotateCamera = function () {
        this.camera.position.y = -this.position.y;
        this.camera.position.x = Math.sin(this.position.x);
        this.camera.position.z = Math.cos(this.position.x);
        this.zoomCamera();
        this.camera.lookAt(this.origin);
    };
    OrbitCameraControls.prototype.zoomCamera = function () {
        this.camera.position.normalize()
            .multiplyScalar(this.getScaledRadius(this.radius));
    };
    return OrbitCameraControls;
}());

var canvas = document.getElementById("uv-sphere-wireframe");
var renderer = new WebGLRenderer({ antialias: true, canvas: canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);
var camera = new PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight);
var controls = new OrbitCameraControls(camera, 10, new Vector3(-Math.PI * 0.5, -Math.PI * 0.25, 0));
controls.addEventListeners(canvas);
canvas.addEventListener("resize", function () {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
});
var scene = new Scene();
var geometry = new SphereGeometry(5, 32, 32);
var material = new MeshBasicMaterial({ wireframe: true });
var sphere = new Mesh(geometry, material);
scene.add(sphere);
var time = 0;
function update() {
    var newTime = new Date().getTime();
    if (time !== 0) {
        controls.update(newTime - time);
    }
    time = newTime;
}
function render() {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}
render();
