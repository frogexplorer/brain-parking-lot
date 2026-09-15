const parkButton = document.getElementById("parkButton");
const thoughtSection = document.getElementById("thoughtSection");
const thoughtInput = document.getElementById("thoughtInput");
const saveButton = document.getElementById("saveButton");
const thoughtsList = document.getElementById("thoughtsList");
const handledList = document.getElementById("handledList");
const handledSection = document.querySelector(".handled-section");
const clearHandledButton = document.getElementById("clearHandledButton");

let thoughts = JSON.parse(localStorage.getItem("brainParkingLot")) || [];

thoughts = thoughts.map(thought => {
    if (typeof thought === "string") {
        return {
            text: thought,
            handled: false
        };
    }

    return thought;
});

function saveThoughts() {
    localStorage.setItem("brainParkingLot", JSON.stringify(thoughts));
}

function displayThoughts() {
    thoughtsList.innerHTML = "";
    handledList.innerHTML = "";

    thoughts.forEach((thought, index) => {
        const thoughtCard = document.createElement("div");
        thoughtCard.className = "thought";

        if (thought.handled) {
            thoughtCard.classList.add("handled");
        }

        thoughtCard.innerHTML = `
            <div class="thought-text">
    ${escapeHTML(thought.text)}
    <div class="thought-time">
        ${thought.createdAt ? new Date(thought.createdAt).toLocaleDateString() : ""}
    </div>
</div>

            <div class="thought-actions">
                <button
                    class="handle-button"
                    onclick="toggleHandled(${index})"
                    title="${thought.handled ? "Put back" : "Mark as handled"}"
                >
                    ${thought.handled ? "↩" : "✓"}
                </button>

                <button
                    class="delete-button"
                    onclick="deleteThought(${index})"
                    title="Delete"
                >
                    ×
                </button>
            </div>
        `;

        if (thought.handled) {
            handledList.appendChild(thoughtCard);
        } else {
            thoughtsList.appendChild(thoughtCard);
        }
    });

    handledSection.style.display = thoughts.some(thought => thought.handled)
        ? "block"
        : "none";
}

function escapeHTML(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
}

function toggleHandled(index) {
    thoughts[index].handled = !thoughts[index].handled;

    saveThoughts();
    displayThoughts();
}

function deleteThought(index) {
    thoughts.splice(index, 1);

    saveThoughts();
    displayThoughts();
}

parkButton.addEventListener("click", () => {
    thoughtSection.classList.remove("hidden");
    thoughtInput.focus();
});

saveButton.addEventListener("click", () => {
    const thought = thoughtInput.value.trim();

    if (thought === "") {
        return;
    }

    thoughts.unshift({
    text: thought,
    handled: false,
    createdAt: new Date().toISOString()
});

    saveThoughts();
    displayThoughts();

    thoughtInput.value = "";
    thoughtSection.classList.add("hidden");
});

displayThoughts();
clearHandledButton.addEventListener("click", () => {
    const confirmed = confirm("Are you sure you want to clear all handled thoughts?");

    if (!confirmed) {
        return;
    }

    thoughts = thoughts.filter(thought => !thought.handled);

    saveThoughts();
    displayThoughts();
});