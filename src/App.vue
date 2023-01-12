<template>
  <div class="p-10 h-screen bg-blue-600 overflow-auto">
    <h1 class="text-4xl text-white flex items-centered mb-10">
      Kanban Board
    </h1>
    <KanbanBoard />
  </div>
</template>

<script>
import KanbanBoard from "./components/KanbanBoard.vue";
export default {
  components: { KanbanBoard }
}
</script>