<template>
  <div>
    <TodoItem
      v-for="todo in todos" 
      :todo="todo" 
      :key="todo.id"
      @completeTodo="completeTodo" 
      @saveTodo="saveTodo"
      @deleteTodo="deleteTodo"
    />
  </div>
</template>

<script>
import TodoItem from "./TodoItem";

export default {
  props: ["todos"],
  components: {
    TodoItem
  },
  methods: {
    async deleteTodo(todoId) {
      const response = await fetch(`${this.$apiPath}/todos/${todoId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': this.$store.state.token
        }
      })

      if (response.status != 200) {
        return console.log(`Unable to delete todo with id ${todoId}`);
      } else {
        const todoIndex = this.todos.findIndex(x => x._id == todoId);
        this.todos.splice(todoIndex, 1);
      }
    },
    async completeTodo(todoId) {
      const response = await fetch(`${this.$apiPath}/todos/${todoId}`, {
        method: 'PUT',
        headers: {
          'Authorization': this.$store.state.token,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          isDone: true
        })
      })

      if (response.status != 200) {
        return console.log(`Unable to complete todo with id ${todoId}`);
      } else {
        const todoIndex = this.todos.findIndex(x => x._id == todoId);
        this.todos[todoIndex].isDone = true
      }
    },
    async saveTodo({ id, title }) {
      const response = await fetch(`${this.$apiPath}/todos/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': this.$store.state.token,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          title
        })
      })

      if (response.status != 200) {
        return console.log(`Unable to update todo with id ${todoId}`);
      } else {
        const todoIndex = this.todos.findIndex(x => x._id == id);
        this.todos[todoIndex] = await response.json()
        this.$forceUpdate()
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.list-info {
  margin: 2rem;
  text-align: center;
}
</style>
