import {
    Mesh,
    MeshBasicMaterial,
    PerspectiveCamera,
    Scene,
    SphereGeometry,
    Vector3,
    WebGLRenderer,
} from "three";
import OrbitCameraControls from "../_common/orbit-camera-controls";

const canvas = document.getElementById("uv-sphere-wireframe") as HTMLCanvasElement;
const renderer = new WebGLRenderer({ antialias: true, canvas });
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const camera = new PerspectiveCamera(70, canvas.clientWidth / canvas.clientHeight);
const controls = new OrbitCameraControls(camera, 10, new Vector3(-Math.PI * 0.5, -Math.PI * 0.25, 0));

controls.addEventListeners(canvas);
canvas.addEventListener("resize", () => {
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
});

const scene = new Scene();

const geometry = new SphereGeometry(5, 32, 32);
const material = new MeshBasicMaterial({ wireframe: true });
const sphere = new Mesh(geometry, material);

scene.add(sphere);

let time = 0;
function update(): void {
    const newTime = new Date().getTime();

    if (time !== 0) {
        controls.update(newTime - time);
    }

    time = newTime;
}

function render(): void {
    requestAnimationFrame(render);
    update();
    renderer.render(scene, camera);
}

render();
