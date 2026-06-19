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

<select v-model="category">
  <option>Academic</option>
  <option>Assignment</option>
  <option>Lab</option>
  <option>Project</option>
  <option>Exam</option>
</select>

  <button class="add-task-btn" @click="addTask">
  Add Task
</button>


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
<h2 >
Filter by Category
</h2>
  <select v-model="categoryFilter">
    <option>All</option>
    <option>Academic</option>
    <option>Assignment</option>
    <option>Lab</option>
    <option>Project</option>
    <option>Exam</option>
  </select>

  <p>
    Showing {{ filteredTasks.length }} task(s)
  </p>

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

<div class="upcoming-card">

  <h2>⚠️ Upcoming Deadlines</h2>

  <div
    v-for="task in upcomingTasks"
    :key="task.id"
    class="deadline-item"
  >
    <strong>{{ task.title }}</strong>

   <span
  :style="{
    color:
      getDaysLeft(task.due_date) === 'Today' ||
      getDaysLeft(task.due_date) === 'Tomorrow'
        ? 'red'
        : 'black'
  }"
>
  {{ getDaysLeft(task.due_date) }}
</span>

  </div>

</div>

<div v-if="filteredTasks.length === 0" class="no-results">
  🔍 No matching tasks found
</div>

    <div class="task-card"
  :class="{
    overdueCard: isOverdue(task.due_date, task.status)
  }"
  v-for="task in filteredTasks"
  :key="task.id"
>
  <div class="task-header">
  <h3>{{ task.title }}</h3>

  <span
    v-if="isOverdue(task.due_date, task.status)"
    class="overdue-badge"
  >
    OVERDUE!
  </span>
</div>
  <br>

  <p>📅 Due: {{ task.due_date.split("T")[0] }}</p>

  <p>
  <span class="category-badge">
    📂 {{ task.category }}
  </span>
</p>

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
const category = ref("Academic");
const categoryFilter = ref("All");

const filteredTasks = computed(() => {
  return tasks.value.filter(task => {

    const matchesSearch =
      task.title
        .toLowerCase()
        .includes(search.value.toLowerCase());

    const matchesCategory =
      categoryFilter.value === "All" ||
      task.category === categoryFilter.value;

    return matchesSearch && matchesCategory;

  });
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
  priority: priority.value,
  category: category.value
})
  });

  title.value = "";
dueDate.value = "";
priority.value = "Medium";
category.value = "Academic";
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

const upcomingTasks = computed(() => {
  const today = new Date();

  return tasks.value
    .filter(task => {
      const dueDate = new Date(task.due_date);
      return dueDate >= today;
    })
    .sort((a, b) => {
      return new Date(a.due_date) - new Date(b.due_date);
    })
    .slice(0, 5);
});

const getDaysLeft = (dueDate) => {
  const today = new Date();
  const due = new Date(dueDate);

  const diffTime = due - today;
  const diffDays = Math.ceil(
    diffTime / (1000 * 60 * 60 * 24)
  );

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";

  return `${diffDays} days left`;
};

const isOverdue = (dueDate, status) => {
  if (status === "Completed") return false;

  const today = new Date();
  const due = new Date(dueDate);

  today.setHours(0, 0, 0, 0);
  due.setHours(0, 0, 0, 0);

  return due < today;
};

</script>