let project = {
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

function finishRename() {
        projectName.contentEditable = "false";
        project.name = projectName.innerHTML;
        projectName.innerHTML = namingPrefix + projectName.innerHTML;
}

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

const mainCanvas = document.getElementById("mainViewport");
const renderer = new THREE.WebGLRenderer({ canvas: mainCanvas });

const camera = new THREE.PerspectiveCamera(
    75,
    mainCanvas.clientWidth / mainCanvas.clientHeight,
    0.1,
    1000
);

function onWindowResized() {
    const w = mainCanvas.clientWidth;
    const h = mainCanvas.clientHeight;
    renderer.setSize(w, h);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
}

window.addEventListener("resize", onWindowResized);

const scene = new THREE.Scene();

const testCube = THREE.Mesh(
    new THREE.BoxGeometry(2, 1, 4),
    new THREE.MeshBasicMaterial({color: 0x808080})
);

testCube.position.set(0, 0.5, 0);

scene.add(testCube);

function loop() {
    renderer.render(scene, camera);
    requestAnimationFrame(loop);
}
loop();