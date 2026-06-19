<template>
  <div class="container">
    <h1>StudyMate</h1>

<p class="subtitle">
Smart Student Planner
</p>

    <input v-model="title" placeholder="Task Title" />
    <br><br>

    <input type="date" v-model="dueDate" />
    <br><br>

<select v-model="priority">
  <option>High</option>
  <option>Medium</option>
  <option>Low</option>
</select>

<br><br>

    <button @click="addTask">Add Task</button>
    <button @click="loadTasks">Load Tasks</button>

    <br><br>
    <input
  v-model="search"
  placeholder="Search tasks"
/>

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

    <div
  class="task-card"
  v-for="task in filteredTasks"
  :key="task.id"
>
  <h3>{{ task.title }}</h3>

  <p>
    <strong>Due Date:</strong>
    {{ task.due_date.split("T")[0] }}
  </p>

  <p>
    <strong>Status:</strong>

    <select
      :value="task.status"
      @change="updateStatus(task.id, $event.target.value)"
    >
      <option>Pending</option>
      <option>In Progress</option>
      <option>Completed</option>
    </select>
  </p>

  <p>
  <strong>Priority:</strong>
  {{ task.priority }}
</p>

  <button @click="deleteTask(task.id)">
    Delete
  </button>
</div>
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


</script>