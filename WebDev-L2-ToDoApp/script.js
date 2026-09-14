const taskInput = document.getElementById("taskInput");
const addTaskBtn = document.getElementById("addTaskBtn");

const pendingTasks = document.getElementById("pendingTasks");
const completedTasks = document.getElementById("completedTasks");

const pendingCount = document.getElementById("pendingCount");
const completedCount = document.getElementById("completedCount");

let tasks = JSON.parse(localStorage.getItem("todoTasks")) || [];


/* Add Task */
addTaskBtn.addEventListener("click", addTask);

taskInput.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
        addTask();
    }
});


function addTask() {

    const taskText = taskInput.value.trim();

    if (taskText === "") {
        alert("Please enter a task.");
        return;
    }

    const newTask = {
        id: Date.now(),
        text: taskText,
        completed: false,
        createdAt: new Date().toLocaleString()
    };

    tasks.push(newTask);

    saveTasks();
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
}


/* Save Tasks */
function saveTasks() {
    localStorage.setItem("todoTasks", JSON.stringify(tasks));
}


/* Display Tasks */
function renderTasks() {

    pendingTasks.innerHTML = "";
    completedTasks.innerHTML = "";

    const pending = tasks.filter(task => !task.completed);
    const completed = tasks.filter(task => task.completed);

    pendingCount.textContent = pending.length;
    completedCount.textContent = completed.length;


    /* Pending Tasks */

    if (pending.length === 0) {

        pendingTasks.innerHTML = `
            <p class="empty-message">
                No pending tasks. Add a new task to get started!
            </p>
        `;

    } else {

        pending.forEach(task => {
            pendingTasks.appendChild(createTaskElement(task));
        });
    }


    /* Completed Tasks */

    if (completed.length === 0) {

        completedTasks.innerHTML = `
            <p class="empty-message">
                No completed tasks yet.
            </p>
        `;

    } else {

        completed.forEach(task => {
            completedTasks.appendChild(createTaskElement(task));
        });
    }
}


/* Create Task Element */
function createTaskElement(task) {

    const taskItem = document.createElement("div");

    taskItem.className = "task-item";

    if (task.completed) {
        taskItem.classList.add("completed");
    }


    const content = document.createElement("div");

    content.className = "task-content";


    const text = document.createElement("span");

    text.className = "task-text";

    text.textContent = task.text;


    const time = document.createElement("small");

    time.className = "task-time";

    time.textContent = `Created: ${task.createdAt}`;


    content.appendChild(text);
    content.appendChild(time);


    const actions = document.createElement("div");

    actions.className = "task-actions";


    /* Complete / Undo Button */

    const completeButton = document.createElement("button");

    completeButton.className = "complete-btn";

    completeButton.textContent = task.completed
        ? "Undo"
        : "Complete";


    completeButton.addEventListener("click", function () {

        task.completed = !task.completed;

        saveTasks();
        renderTasks();
    });


    /* Edit Button */

    const editButton = document.createElement("button");

    editButton.className = "edit-btn";

    editButton.textContent = "Edit";


    editButton.addEventListener("click", function () {

        startEditing(task, content);
    });


    /* Delete Button */

    const deleteButton = document.createElement("button");

    deleteButton.className = "delete-btn";

    deleteButton.textContent = "Delete";


    deleteButton.addEventListener("click", function () {

        deleteTask(task.id);
    });


    actions.appendChild(completeButton);
    actions.appendChild(editButton);
    actions.appendChild(deleteButton);


    taskItem.appendChild(content);
    taskItem.appendChild(actions);


    return taskItem;
}


/* Edit Task */
function startEditing(task, content) {

    content.innerHTML = "";

    const editInput = document.createElement("input");

    editInput.type = "text";

    editInput.className = "edit-input";

    editInput.value = task.text;


    content.appendChild(editInput);

    editInput.focus();


    editInput.addEventListener("keydown", function (event) {

        if (event.key === "Enter") {

            const updatedText = editInput.value.trim();

            if (updatedText === "") {
                alert("Task cannot be empty.");
                return;
            }

            task.text = updatedText;

            saveTasks();
            renderTasks();
        }


        if (event.key === "Escape") {

            renderTasks();
        }
    });


    editInput.addEventListener("blur", function () {

        const updatedText = editInput.value.trim();

        if (updatedText !== "") {

            task.text = updatedText;

            saveTasks();
            renderTasks();

        } else {

            renderTasks();
        }
    });
}


/* Delete Task */
function deleteTask(taskId) {

    const confirmDelete = confirm("Are you sure you want to delete this task?");

    if (!confirmDelete) {
        return;
    }

    tasks = tasks.filter(task => task.id !== taskId);

    saveTasks();
    renderTasks();
}


/* Load Tasks When Page Opens */
renderTasks();