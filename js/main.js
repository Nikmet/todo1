//* NODE CONSTANTS
const formNode = document.querySelector("#form");
const inputTaskNode = document.querySelector("#taskInput");
const taskListNode = document.querySelector("#tasksList");
const emptyListNode = document.querySelector("#emptyList");

//* VARS

let tasks = [];

//* FUNCTIONS

// Создание разметки для задачи
function createTaskHtml(task) {
    // Проверим выполнена ли задача, и если это правда, поменяем класс заголовка
    const titleClass = task.done ? "task-title task-title--done" : "task-title";

    // Отображаем разметку
    taskListNode.insertAdjacentHTML(
        "beforeend",
        `
        <li id="${task.id}" class="list-group-item d-flex justify-content-between task-item">
			<span class="${titleClass}">${task.text}</span>
			<div class="task-item__buttons">
				<button type="button" data-action="done" class="btn-action">
					<img src="./img/tick.svg" alt="Done" width="18" height="18">
				</button>
				<button type="button" data-action="delete" class="btn-action">
					<img src="./img/cross.svg" alt="done" width="18" height="18">
                </button>
			</div>
		</li>
    `
    );
}

// Добавление новой задачи
function addTask(e) {
    e.preventDefault();
    let taskText = inputTaskNode.value;

    // Создаем объект задачи и помещвем в массив с ними
    const newTask = {
        id: Date.now(),
        text: taskText,
        done: false,
    };
    tasks.push(newTask);
    putDataToLocalStorage();

    // Разметка
    createTaskHtml(newTask);
    checkEmptyList();

    inputTaskNode.value = "";
    inputTaskNode.focus();
}

// Удаление задачи
function removeTask(e) {
    if (e.target.dataset.action !== "delete") return;

    const taskNode = e.target.closest("li");
    const index = tasks.findIndex(task => task.id == taskNode.id);
    tasks.splice(index, 1);
    putDataToLocalStorage();

    // Разметка
    taskNode.remove();
    checkEmptyList();
}

// Выполнение задачи
function doneTask(e) {
    if (e.target.dataset.action !== "done") return;
    const taskNode = e.target.closest("li");

    const task = tasks.find(t => t.id == taskNode.id);
    task.done = !task.done;
    putDataToLocalStorage();

    const title = taskNode.querySelector(".task-title");
    title.classList.toggle("task-title--done");
}

// Отсутствие задач
function checkEmptyList() {
    const emptyListHTML = `
        <li id="emptyList" class="list-group-item empty-list">
			<img src="./img/leaf.svg" alt="Empty" width="48" class="mt-3">
			<div class="empty-list__title">Список дел пуст</div>
        </li>
    `;

    if (tasks.length === 0) taskListNode.insertAdjacentHTML("afterbegin", emptyListHTML);
    else document.querySelector("#emptyList") ? document.querySelector("#emptyList").remove() : null;
}

// Сохранение данных в localstorage
function putDataToLocalStorage() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

//* EVENTS

if (localStorage.getItem("tasks")) {
    tasks = JSON.parse(localStorage.getItem("tasks"));
    tasks.forEach(task => createTaskHtml(task));
}

checkEmptyList();

formNode.addEventListener("submit", addTask);
taskListNode.addEventListener("click", removeTask);
taskListNode.addEventListener("click", doneTask);
