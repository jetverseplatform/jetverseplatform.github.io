import * as THREE from "./lib/three.module.js";

const project = {
    name: "Untitled",
    ROOT_ID: crypto.randomUUID(),
    objects: {}
}

const projectName = document.getElementById("projectname");
const namingPrefix = "Jetcore - "

function renameProject() {
    projectName.innerHTML = projectName.innerHTML.slice(namingPrefix.length);
    projectName.contentEditable = "true";
    projectName.focus();
}

window.renameProject = renameProject;

function finishRename() {
        projectName.contentEditable = "false";
        project.name = projectName.innerHTML;
        projectName.innerHTML = namingPrefix + projectName.innerHTML;
}

const keys = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false,
    shift: false,
    " " : false
}

let rotating = false;

projectName.addEventListener("keydown", (ev) => {
    if (ev.key === "Enter") {
        ev.preventDefault();
        projectName.blur();
    }
});

projectName.addEventListener("blur", () => {
    finishRename();
});

function newPart() {
    const id = crypto.randomUUID();
    project.objects[id] = {
        UUID: id,
        name: "Part",
        parent: project.ROOT_ID
    }
}

window.newPart = newPart;

document.addEventListener("keydown", (ev) => {
    keys[ev.key.toLowerCase()] = true;
});

document.addEventListener("keyup", (ev) => {
    keys[ev.key.toLowerCase()] = false;
});

const mainCanvas = document.getElementById("mainViewport");
const renderer = new THREE.WebGLRenderer({ canvas: mainCanvas });

mainCanvas.addEventListener("mousedown", (ev) => {
    if (ev.button === 2) {
        rotating = true;
        mainCanvas.requestPointerLock();
    }
});

mainCanvas.addEventListener("mouseup", (ev) => {
    if (ev.button === 2) {
        rotating = false;
        document.exitPointerLock();
    }
});

requestAnimationFrame(() => {
    onWindowResized();
});

const camera = new THREE.PerspectiveCamera(
    75,
    mainCanvas.clientWidth / mainCanvas.clientHeight,
    0.1,
    1000
);

camera.position.set(5, 5, 5);
camera.lookAt(0, 0, 0);


function onWindowResized() {
    const w = mainCanvas.clientWidth;
    const h = mainCanvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

onWindowResized();

window.addEventListener("resize", onWindowResized);

const scene = new THREE.Scene();

const testCube = new THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 4),
    new THREE.MeshBasicMaterial({color: 0xffffff})
);

testCube.position.set(0, 0.5, 0);

scene.add(testCube);

let last = performance.now();

function wasdMove(dt) {
    const cameraspeed = keys[" "] ? 10 : (keys["shift"] ? 2 : 5);
    const forward = new THREE.Vector3();
    const left = new THREE.Vector3();
    camera.getWorldDirection(forward);
    left.crossVectors(camera.up, forward);
    if (keys["w"]) camera.position.addScaledVector(forward, cameraspeed * dt);
    if (keys["s"]) camera.position.addScaledVector(forward, -cameraspeed * dt);
    if (keys["a"]) camera.position.addScaledVector(left, cameraspeed * dt);
    if (keys["d"]) camera.position.addScaledVector(left, -cameraspeed * dt);
    if (keys["q"]) camera.position.addScaledVector(camera.up, -cameraspeed * dt);
    if (keys["e"]) camera.position.addScaledVector(camera.up, cameraspeed * dt);
}

let yaw = 0;
let pitch = 0;

mainCanvas.addEventListener("mousemove", (ev) => {
    if (rotating && document.pointerLockElement === mainCanvas) {
        yaw -= ev.movementX * 0.005;
        pitch -= ev.movementY * 0.005;
        const l = Math.PI / 2 -0.001;
        pitch = Math.max(-l, Math.min(l, pitch));
        camera.rotation.set(pitch, yaw, 0);
    }
});

function loop() {
    const now = performance.now();
    const dt = (now - last) / 1000;
    last = now;
    wasdMove(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
loop();