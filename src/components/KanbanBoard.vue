<template>
  <header class="mb-5">
    <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 mr-2 rounded"
        @click="this.newColumn = !this.newColumn"
    >
      Add Column
    </button>
    <input
        type="text"
        class="task bg-white p-2 mb-2 mr-4 shadow-sm min-w-[200px]"
        v-model="title"
        @keyup.enter="addColumn()"
        @blur="this.newColumn = !this.newColumn"
        :class="{hidden: !newColumn}"
    />
    <button
        class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 border border-blue-700 rounded"
        @click="downloadDb"
    >
      Export Db
    </button>
  </header>
  <div>
    <draggable
      v-model="columns"
      group="columns"
      handle=".drag-handle"
      item-key="id"
      class="flex gap-4 overflow-x-auto items-start"
      @start="valueChange = false"
      @end="valueChange = true"
    >
      <template #item="{element: column}">
        <KanbanColumn
            :column="column"
            @add-task="addTask"
            @remove-column="removeColumn"
            @update-data="dataUpdated"
            @task-removed="taskRemoved"
        />
      </template>
    </draggable>
  </div>
</template>

<script lang="ts">
import draggable from "vuedraggable";
import KanbanColumn from "./KanbanColumn.vue";
import { nanoid } from "nanoid";
import { toRaw } from "vue";
import axios from "axios";
import { listCardsUrl, postCardsUrl, exportDbUrl } from '../../api/config.js';

export default {
  components: {
    //import draggable as a component
    draggable,
    KanbanColumn
  },
  methods: {
    addTask (eventData) {
        const {columnId, task} = eventData;

        for (let i = 0; i < this.columns.length; i++) {
          if (this.columns[i].id == columnId) {
            this.columns[i].tasks.push(task);
          }
        }
        this.valueChange = true;
    },
    addColumn () {
      const column = {
        id: nanoid(),
        title: this.title,
        tasks: []
      };
      this.columns.push(column);
      this.title = "";
      this.newColumn = false;
      this.valueChange = true;
    },
    removeColumn (eventData) {
      this.columns = this.columns.filter(column => column.id != eventData.columnId);
    },
    dataUpdated (eventData) {
      this.valueChange = eventData.status;
    },
    taskRemoved (eventData) {
      const { taskId } = eventData;
      let columns = toRaw(this.columns);
      for (let i = 0; i < columns.length; i++) {
        columns[i] = toRaw(columns[i]);
        if (columns[i].tasks) {
          for (let task = 0; task < columns[i].tasks.length; task++) {
            columns[i].tasks[task] = toRaw(columns[i].tasks[task]);
            if (columns[i].tasks[task].id == taskId) {
              columns[i].tasks[task].status = 0;
            }
          }
        }
      }
      this.columns = columns;
      this.valueChange = true;
    },
    downloadDb () {
      axios.get(exportDbUrl())
        .then(response => {
          let a = window.document.createElement('a');
          a.href = window.URL.createObjectURL(new Blob([response.data], {type: 'text/plain'}));
          a.download = 'data_dump.sql';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        })
        .catch(error => {
          // console.log(error);
        });
    }
  },
  data() {
    return {
      title: "",
      newColumn: false,
      valueChange: false,
      columns: []
    }
  },
  mounted() {
    axios.get(listCardsUrl())
        .then(response => {
          const {data, status} = response;
          if (status === 200) {
            this.columns = data;
          }
        })
        .catch(error => {
          this.columns = [];
        });
  },
  watch: {
    valueChange(value, oldValue) {
      if (value && value != oldValue) {
        let columns = toRaw(this.columns);
        for (let i = 0; i < columns.length; i++) {
          columns[i] = toRaw(columns[i]);
          if (columns[i].tasks) {
            for (let task = 0; task < columns[i].tasks.length; task++) {
              columns[i].tasks[task] = toRaw(columns[i].tasks[task]);
            }
          }
        }

        axios
            .post(postCardsUrl(), {"data": JSON.stringify(columns)})
            .then(response => {
              console.log("Successfully Posted!");
            })
            .catch(error => {
              console.log("Failed to Post Data!", error);
            });

        this.valueChange = false;
      }
    }
  }
}
</script>
