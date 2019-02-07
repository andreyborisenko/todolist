<template>
  <div>
    <UserForm v-if="!isLoggedIn" @auth="onAuth" /> 
    <div v-else>
      <UserInfo :user="user" @logout="logout" />
      <CreateTodo @addTodo="addTodo" />
      <TodoList :todos="todos" />
      <!-- <CreateTodo v-on:add-todo="addTodo" /> -->
    </div>
  </div>
</template>

<script>
import TodoList from "./components/TodoList";
import CreateTodo from "./components/CreateTodo.vue";
import UserInfo from "./components/UserInfo.vue";
import UserForm from "./components/UserForm.vue";

import Cookie from 'js-cookie'

export default {
  name: "app",
  components: {
    TodoList,
    CreateTodo,
    UserInfo,
    UserForm
  },
  data() {
    return {
      todos: [],
      isLoggedIn: this.$jwt.length > 0,
      user: {}
    };
  },
  methods: {
    async addTodo(todo) {
      this.todos.unshift(todo)
    },
    onAuth({ token, user }) {
      Cookie.set('jwt', token, { domain: 'localhost' })
      this.$jwt = token
      this.isLoggedIn = true
      this.user = user
    },
    async getMe() {
      const response = await fetch('http://localhost:3001/me', {
        headers: {
          'Authorization': this.$jwt
        }
      })

      if (response.status == 200) {
        this.user = await   response.json()
      } else {
        this.isLoggedIn = false
        this.$jwt = ''
        Cookie.set('jwt', '', { domain: 'localhost' })
      }
    },
    async getInitialTodos() {
      const response = await fetch('http://localhost:3001/todos?limit=100', {
        headers: {
          'Authorization': this.$jwt
        }
      })

      if (response.status == 200) {
        const { todos } = await response.json()
        this.todos = todos
      } else {
        this.logout()
      }
    },
    logout() {
      this.isLoggedIn = false
      this.$jwt = ''
      Cookie.set('jwt', '', { domain: 'localhost' })
    }
  },
  async created() {
    if (this.isLoggedIn) {
      if (Object.keys(this.user) == 0) {
        await this.getMe()
      }

      await this.getInitialTodos()
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 25px 0;
}
</style>
