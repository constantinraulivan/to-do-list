let allTasks = [];
const hamburger = document.querySelector(".hamburger");
const navLinks = document.querySelector(".nav-links");

function loadTask() {
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

loadTask();
