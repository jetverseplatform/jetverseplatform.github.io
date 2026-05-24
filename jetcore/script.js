let project = {
    name: "Untitled"
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