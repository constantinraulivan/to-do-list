let allTasks = [];
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");
const backBtn = document.querySelector(".back");

function loadTasks() {
  fetch("http://localhost:3000/tasks-json")
    .then((r) => r.json())
    .then((tasks) => {
      allTasks = tasks;
      console.log("tasks", allTasks);
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

function initEvents() {
  const addTaskBtn = document.getElementById("add-task-btn");
  addTaskBtn.addEventListener("click", function () {
    document
      .getElementById("add-task-popup")
      .classList.remove("add-task-hidden");
    document.getElementById("add-task-popup").classList.add("add-task");
  });

  const exit = document.getElementById("exit-btn");
  exit.addEventListener("click", function () {
    document.getElementById("add-task-popup").classList.add("add-task-hidden");
    document.getElementById("add-task-popup").classList.remove("add-task");
  });
}

loadTasks();
initEvents();
