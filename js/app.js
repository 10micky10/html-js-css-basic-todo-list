document.getElementById("btn-principal").addEventListener("click", (e) => {
  let documentFormContainer = loadForm();

  const task = {
    taskTitle: "",
    taskTag: "",
  }

  document.getElementById("form-task").addEventListener("submit", (e) => {
    task.taskTitle = document.getElementById("task-name").value;
    task.taskTag = document.getElementById("task-tags").value;

    (task.taskTitle !== "")
      ? saveTaskForAdd(task, documentFormContainer)
      : alert("Task need a name");

    e.preventDefault();
  });
});

function saveTaskForAdd(task, documentFormContainer) {
  if (localStorage.getItem("tasksLStorage") === null) {
    let tasksArray = [];
    tasksArray.push(task);
    localStorage.setItem("tasksLStorage", JSON.stringify(tasksArray));
  } else {
    let tasksArray = JSON.parse(localStorage.getItem("tasksLStorage"));
    tasksArray.push(task);
    localStorage.setItem("tasksLStorage", JSON.stringify(tasksArray));
  }
  printOnDocumentTasks();

  document.getElementById("form-task").reset();
  documentFormContainer.innerHTML = "";
}

function loadForm() {
  let documentFormContainer = document.getElementById("form-container");
  documentFormContainer.innerHTML = `<form id="form-task" class="form-task">
    <input type="text" placeholder="Task name" id="task-name">
    <textarea class="task-form-tags" placeholder="Task Tags" id="task-tags"></textarea>
    <button class="btn save-form" type="submit">
      Save
    </button>
    <button class="btn cancel-form" type="reset">
      Cancel
    </button>
  </form>`;
  return documentFormContainer;
}

function printOnDocumentTasks() {
  let tasksArray = JSON.parse(localStorage.getItem("tasksLStorage"));
  let documentTasksContainer = document.getElementById("tasks-container");
  documentTasksContainer.innerHTML = "";

  if (tasksArray != null) {
    tasksArray.forEach(task => {
      documentTasksContainer.innerHTML += `<div class="card flex">
        <h3>Name:</h3>
        <p class="card-title" id="card-task-title">${task.taskTitle}</p>
        <h3>Tags:</h3>
        <p class="card-title" id="card-task-title">${task.taskTag}</p>
        <div>
          <button class="btn delete" onclick=deleteTask('${task.taskTitle}')>
            Delete
            <i class="far fa-trash-alt"></i>
          </button>
          <button class="btn update" onclick="updateTask('${task.taskTitle}')">
            Update
            <i class="fas fa-edit"></i>
          </button>
        </div>
      </div>`;
    });
  }
}

function deleteTask(title) {
  let tasksArray = JSON.parse(localStorage.getItem("tasksLStorage"));

  const taskArrayFilter = tasksArray.filter(task => task.taskTitle !== title);
  localStorage.setItem("tasksLStorage", JSON.stringify(taskArrayFilter));
  alert("Deleted sucesfully");

  printOnDocumentTasks();
}

function updateTask(title) {
  let tasksArray = JSON.parse(localStorage.getItem("tasksLStorage"));

  tasksArray.filter(task => task.taskTitle == title)
    .forEach(task => {
      let documentFormContainer = loadForm();

      document.getElementById("task-name").value = task.taskTitle;
      document.getElementById("task-tags").value = task.taskTag;

      document.getElementById("form-task").addEventListener("submit", (e) => {
        task.taskTitle = document.getElementById("task-name").value;
        task.taskTag = document.getElementById("task-tags").value;

        (task.taskTitle !== "")
          ? saveTaskForUpdate(tasksArray, documentFormContainer)
          : alert("Task need a name");

        e.preventDefault();
      });
    });
}

function saveTaskForUpdate(tasksArray, documentFormContainer) {
  localStorage.setItem("tasksLStorage", JSON.stringify(tasksArray));

  printOnDocumentTasks();

  document.getElementById("form-task").reset();
  documentFormContainer.innerHTML = "";
}

function downloadCSV() {
  const tasksArray = JSON.parse(localStorage.getItem("tasksLStorage"));
  const csvString = "data:text/csv;charset=utf-8," + [
    [
      "Todo Name",
      "Todo Tags",
    ],
    ...tasksArray.map(task => [
      task.taskTitle,
      task.taskTag,
    ])
  ].map(e => e.join(",")).join("\n");

  let encodedUri = encodeURI(csvString);
  let link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "todo-list.csv");
  document.body.appendChild(link);

  link.click();
}

printOnDocumentTasks();
