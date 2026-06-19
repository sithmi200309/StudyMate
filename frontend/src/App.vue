<template>
  <div class="container">
    <h1>📚StudyMate</h1>

<p class="subtitle">
Smart Student Planner
</p>

    <div class="form-section">

  <h2>Add New Task</h2>

  <input v-model="title" placeholder="Task Title" />

  <input type="date" v-model="dueDate" />

  <button @click="suggestPriority">
  Suggest Priority
</button>

  <select v-model="priority">
    <option>High</option>
    <option>Medium</option>
    <option>Low</option>
  </select>


  <button @click="addTask">Add Task</button>
 

</div>

    <br><br>

    <div class="form-section">
  <h2>Task Actions</h2>
  <br>

  <button @click="loadTasks">
    View Tasks
  </button>
</div>

  <br><br>
   <div class="form-section">
  <h2>Search Tasks</h2>

  <input
    v-model="search"
    placeholder="Search tasks"
  />
</div>

<br><br>

   <div class="dashboard">

  <div class="stat-card">
    <h2>{{ tasks.length }}</h2>
    <p>Total Tasks</p>
  </div>

  <div class="stat-card">
    <h2>
      {{ tasks.filter(t => t.status === 'Pending').length }}
    </h2>
    <p>Pending</p>
  </div>

  <div class="stat-card">
    <h2>
      {{ tasks.filter(t => t.status === 'Completed').length }}
    </h2>
    <p>Completed</p>
  </div>

</div>

<div class="progress-card">

  <h2>Task Completion Progress</h2>
  <br>

  <p class="progress_percentage">{{ progressPercentage }}%</p>
  
  <div class="progress-bar">
    <div
      class="progress-fill"
      :style="{ width: progressPercentage + '%' }"
    ></div>
  </div>

</div>

    <div
  class="task-card"
  v-for="task in filteredTasks"
  :key="task.id"
>
  <h3>{{ task.title }}</h3>
  <br>

  <p>📅 Due: {{ task.due_date.split("T")[0] }}</p>

  <p>📌 Status: {{ task.status }}</p>

  <p>🔥 Priority: {{ task.priority }}</p>

 <div class="actions">

  <select
    class="status-select"
    :value="task.status"
    @change="updateStatus(task.id, $event.target.value)"
  >
    <option>Pending</option>
    <option>In Progress</option>
    <option>Completed</option>
  </select>

  <button @click="deleteTask(task.id)">
    Delete
  </button>

</div>
</div>

<footer>
  © 2026 StudyMate | Developed for DesignHer 2.0
</footer>

  </div>
</template>

<script setup>
import { ref, computed } from "vue";

const tasks = ref([]);
const title = ref("");
const dueDate = ref("");
const priority = ref("Medium");
const search = ref("");

const filteredTasks = computed(() => {
  return tasks.value.filter(task =>
    task.title
      .toLowerCase()
      .includes(search.value.toLowerCase())
  );
});

const loadTasks = async () => {
  const response = await fetch("http://localhost:5000/tasks");
  tasks.value = await response.json();
};

const addTask = async () => {
  await fetch("http://localhost:5000/tasks", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
  title: title.value,
  description: "",
  due_date: dueDate.value,
  status: "Pending",
  priority: priority.value
})
  });

  title.value = "";
  dueDate.value = "";
  priority.value = "Medium";
  loadTasks();
};

const deleteTask = async (id) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "DELETE"
  });

  loadTasks();
};

const updateStatus = async (id, status) => {
  await fetch(`http://localhost:5000/tasks/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      status
    })
  });

  loadTasks();
};

const suggestPriority = () => {
  if (!dueDate.value) return;

  const today = new Date();
  const due = new Date(dueDate.value);

  const diffTime = due - today;
  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays <= 2) {
    priority.value = "High";
  } else if (diffDays <= 7) {
    priority.value = "Medium";
  } else {
    priority.value = "Low";
  }
};

const progressPercentage = computed(() => {
  if (tasks.value.length === 0) return 0;

  const completedTasks = tasks.value.filter(
    task => task.status === "Completed"
  ).length;

  return Math.round(
    (completedTasks / tasks.value.length) * 100
  );
});

</script>