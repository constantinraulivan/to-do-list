let allTasks = [];
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const backBtn = document.querySelector(".back");
let taskFormTitle;
let taskId;
let taskCompleted;

function $(selector) {
  return document.querySelector(selector);
}

function getTasksHTML(task) {
  return `  <div class="added-content">
  <label class="toggle"><input type="checkbox" checked><span class="slider"></span></label>
  <div class="task">${task.name}</div>
  <div class="edit">
    <button class="editbtn" data-id="${task.id}" type="">Edit</button>
    <button class="deletebtn" data-id="${task.id}" type="">Delete</button>
  </div>
</div>`;
}

function displayTasks(tasks) {
  const tasksHTML = tasks.map(getTasksHTML);
  //afisare
  $(".section-todo").innerHTML += tasksHTML.join("");
}

function loadTasks() {
  fetch("http://localhost:3000/tasks-json")
    .then((r) => r.json())
    .then((tasks) => {
      allTasks = tasks;
      displayTasks(allTasks);
    });
}

hamburger.addEventListener("click", () => {
  hamburger.classList.toggle("active");
  navLinks.classList.toggle("active");
});

document.querySelectorAll(".nav-links").forEach((links) =>
  links.addEventListener("click", () => {
    hamburger.classList.toggle("active");
    navLinks.classList.toggle("active");
  })
);

window.addEventListener("scroll", () => {
  const scroll = document.querySelector(".back");
  scroll.classList.toggle("active", window.scrollY > 200);
});

backBtn.addEventListener("click", backToTop);

function backToTop() {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}

function addOrEditTaskPopup() {
  const taskPopupText = $("#task-popup h2");
  taskPopupText.innerHTML = taskFormTitle;
  document.getElementById("task-popup").classList.add("task-popup-show");
}

function submitForm(e) {
  e.preventDefault();

  const name = $("input[id=input-task]").value;
  let task = {
    name,
  };
  if (taskId) {
    task.id = taskId;
    task.completed = taskCompleted;
    console.warn("task", task);
    $("#input-form").reset();
    taskId = undefined;
  }
}

function startEditTask(id) {
  const task = allTasks.find((task) => id === task.id);
  taskCompleted = task.completed;
  taskId = id;
  $("input[id=input-task]").value = task.name;
}

function initEvents() {
  const addTaskBtn = document.getElementById("add-task-btn");
  addTaskBtn.addEventListener("click", function () {
    taskFormTitle = "ADD A NEW TASK TO YOUR LIST";
    addOrEditTaskPopup();
  });

  const container = document.querySelector("#container");
  container.addEventListener("click", function (e) {
    if (e.target.matches(".editbtn")) {
      taskFormTitle = "EDIT TASK";
      addOrEditTaskPopup();
      const id = e.target.getAttribute("data-id");
      startEditTask(id);
    }
  });

  const exit = document.getElementById("exit-btn");
  exit.addEventListener("click", function () {
    document.getElementById("task-popup").classList.remove("task-popup-show");
  });

  const form = $("#input-form");
  form.addEventListener("submit", submitForm);
}

loadTasks();
initEvents();
