const API = {
  CREATE: {
    URL: "http://localhost:3000/tasks/create",
    METHOD: "POST",
  },
  READ: {
    URL: "http://localhost:3000/tasks-json",
    METHOD: "GET",
  },
  UPDATE: {
    URL: "http://localhost:3000/tasks/update",
    METHOD: "PUT",
  },
  DELETE: {
    URL: "http://localhost:3000/tasks/delete",
    METHOD: "DELETE",
  },
};

let allTasks = [];
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const backBtn = document.querySelector(".back");
let taskFormTitle;
let taskId;
let taskCompleted;

//for demo
const isDemo = location.host === "constantinraulivan.github.io";
const inlineChanges = isDemo;
if (isDemo) {
  API.READ.URL = "data/tasks.json";
  API.DELETE.URL = "data/delete.json";
  API.CREATE.URL = "data/create.json";
  API.UPDATE.URL = "data/update.json";

  API.DELETE.METHOD = "GET";
  API.CREATE.METHOD = "GET";
  API.UPDATE.METHOD = "GET";
}

function $(selector) {
  return document.querySelector(selector);
}

function getTasksHTML(task) {
  return `  <div class="added-content">
  <label class="toggle"><input type="checkbox" name="checkbox" data-id="${
    task.id
  }" ${task.completed ? "" : "checked"}><span class="slider"></span></label>
  <div class="task ${task.completed ? "todo" : ""}" data-id="${task.id}">${
    task.name
  }</div>
  <div class="edit">
    <button class="editbtn" data-id="${task.id}" type="">Edit</button>
    <button class="deletebtn" data-id="${task.id}" type="">Delete</button>
  </div>
</div>`;
}

function displayTasks(tasks) {
  const tasksHTML = tasks.map(getTasksHTML);

  //afisare
  $("#tasks-section").innerHTML = tasksHTML.join("");
}

function loadTasks() {
  fetch(API.READ.URL)
    .then((r) => r.json())
    .then((tasks) => {
      allTasks = tasks;
      displayTasks(allTasks);
    });
}

function createTaskRequest(task) {
  const method = API.CREATE.METHOD;
  return fetch(API.CREATE.URL, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" ? null : JSON.stringify(task),
  }).then((r) => r.json());
}

function updateTaskRequest(task) {
  const method = API.UPDATE.METHOD;
  return fetch(API.UPDATE.URL, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body: method === "GET" ? null : JSON.stringify(task),
  }).then((r) => r.json());
}

function deleteTask(id) {
  return fetch(API.DELETE.URL, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: id }),
  })
    .then((r) => r.json())
    .then((r) => {
      if (r.success) {
        loadTasks();
      }
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
  $("body").classList.toggle("blurred");
  const taskPopupText = $("#task-form h2");
  taskPopupText.innerHTML = taskFormTitle;
  $("#task-form").classList.add("task-form-show");
}

function submitForm(e) {
  console.log("SUBMIT FORM");
  e.preventDefault();

  const name = $("#input-task").value;
  let task = {
    name,
  };
  if (taskId) {
    task.id = taskId;
    task.completed = taskCompleted;
    updateTaskRequest(task).then((status) => {
      if (status.success) {
        if (inlineChanges) {
          allTasks = allTasks.map((t) => {
            return t.id === taskId ? task : t;
          });
          displayTasks(allTasks);
        } else {
          loadTasks();
        }
        closeTaskPopup();
      }
    });
  } else {
    task.completed = false;
    createTaskRequest(task).then((status) => {
      if (status.success) {
        if (inlineChanges) {
          allTasks = [...allTasks, { ...task, id: status.id }];
          displayTasks(allTasks);
        } else {
          loadTasks();
        }
        closeTaskPopup();
      }
    });
  }
}

function startEditTask(id) {
  const task = allTasks.find((task) => id === task.id);
  taskCompleted = task.completed;
  taskId = id;
  $("input[id=input-task]").value = task.name;
}

function closeTaskPopup() {
  $("#task-form").classList.remove("task-form-show");
  $("body").classList.toggle("blurred");
  taskId = undefined;
  taskCompleted = undefined;
  $("#input-form").reset();
}

function markdDone(id) {
  $(`div[data-id=${id}]`).classList.toggle("todo");
}

function initEvents() {
  const addTaskBtn = $("#add-task-btn");
  addTaskBtn.addEventListener("click", function () {
    taskFormTitle = "ADD A NEW TASK TO YOUR LIST";
    addOrEditTaskPopup();
  });

  const container = document.querySelector("#container");
  container.addEventListener("click", function (e) {
    if (e.target.matches(".editbtn")) {
      taskFormTitle = "YOU CAN EDIT YOUR TASK";
      addOrEditTaskPopup();
      const id = e.target.getAttribute("data-id");
      startEditTask(id);
    } else if (e.target.matches("input[name=checkbox]")) {
      const id = e.target.getAttribute("data-id");
      markdDone(id);
    }
  });

  const exit = $("#exit-btn");
  exit.addEventListener("click", closeTaskPopup);

  const form = $("#input-form");
  form.addEventListener("submit", submitForm);
}

loadTasks();
initEvents();
