let allTasks = [];

function loadTask() {
  fetch("http://localhost:3000/tasks-json")
    .then((r) => r.json())
    .then((tasks) => {
      allTasks = tasks;
      console.log("tasks", allTasks);
    });
}

loadTask();
