<script setup lang="ts">
  import { Task } from "../../types";
  import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
  defineProps<{
    task: Task
  }>();
</script>
<template>
  <div
    class="flex flex-row items-start task bg-white p-2 mb-2 shadow-sm max-w-[250px]"
    :title="task?.created_at"
    v-if="task?.status"
  >
    <span class="mr-10 min-w-[70%]">{{ task.title }}</span>
    <span class="cursor-pointer" @click="removeTask">
      <font-awesome-icon icon="fa-solid fa-eraser" />
    </span>
  </div>
</template>

<script lang="ts">
  export default {
    methods: {
      removeTask() {
        if (confirm('Are you Sure?')) {
          this.$emit('remove-task', { taskId: this.task.id });
        }
      }
    }
  }
</script>