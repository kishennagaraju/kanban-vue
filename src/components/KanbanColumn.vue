<script setup lang="ts">
import DraggableHandle from "./DraggableHandle.vue";
import KanbanTask from "./KanbanTask.vue";
import { Column } from "../../types";
defineProps<{
  column: Column
}>();
</script>

<template>
  <div class="column bg-gray-200 p-5 rounded min-w-[250px]">
    <header class="flex flex-row items-start font-bold mb-4">
      <DraggableHandle />
      <span class="min-w-[80%]">{{ column.title }}</span>
      <span
          class="cursor-pointer"
          @click="removeColumn(column.id)"
      >
        <font-awesome-icon icon="fa-solid fa-eraser" />
      </span>
    </header>
    <draggable
        v-model="column.tasks"
        group="tasks"
        :animation="150"
        item-key="id"
        @start="itemsDragged = false"
        @end="itemsDragged = true"
    >
      <template #item="{element: task}">
        <KanbanTask :task="task" @remove-task="removeTask" />
      </template>
    </draggable>
    <footer>
      <input
          type="text"
          class="task bg-white p-2 mb-2 shadow-sm min-w-[200px]"
          v-model="title"
          ref="taskAdd"
          @keyup.enter="addTask(column.id)"
          @blur="toggleNewTask()"
          :class="{hidden: !newTask}"
      />
      <button
          class="text-gray-500"
          :class="{hidden: newTask}"
          @click="toggleNewTask()"
      >
        + Add a Task
      </button>
    </footer>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import { nanoid } from "nanoid";

export default {
  components: {
    draggable
  },
  data() {
    return {
      newTask: false,
      itemsDragged: false,
      title: "",
    }
  },
  methods: {
    addTask(columnId) {
      const task = {
        id: nanoid(),
        title: this.title,
        status: 1,
        createdAt: new Date()
      };
      this.$emit('add-task', { columnId, task });
      this.title = "";
    },
    removeTask (eventData) {
      this.$emit('task-removed', { taskId: eventData.taskId, columnId: this.column.id });
    },
    removeColumn (columnId) {
      this.$emit('remove-column', { columnId });
    },
    toggleNewTask() {
      const nt = this.newTask;
      this.newTask = !nt;
      if (this.newTask) {
        this.focusInput();
      }
    },
    focusInput() {
      this.$nextTick(() => {
        const inputRef = this.$refs.taskAdd;
        inputRef.focus();
      });
    }
  },
  mounted() {
    this.focusInput();
  },
  watch: {
    itemsDragged(value, oldValue) {
      if (value && value != oldValue) {
        this.$emit('update-data', { status: true });
      }
    }
  }
}
</script>