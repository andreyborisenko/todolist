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
      isLoggedIn: this.$store.state.token.length > 0,
      user: {}
    };
  },
  methods: {
    async addTodo(todo) {
      this.todos.unshift(todo)
    },
    onAuth({ token, user }) {
      console.log(token, user);
      Cookie.set('jwt', token, { domain: 'localhost' })
      // this.$store.state.token = token
      this.$store.commit({
        type: 'SET_TOKEN',
        token
      })
      this.isLoggedIn = true
      this.user = user

      this.getInitialTodos()
    },
    async getMe() {
      const response = await fetch(`${this.$apiPath}/me`, {
        headers: {
          'Authorization': this.$store.state.token
        }
      })

      if (response.status == 200) {
        this.user = await response.json()
      } else {
        this.logout()
      }
    },
    async getInitialTodos() {
      const response = await fetch(`${this.$apiPath}/todos?limit=100`, {
        headers: {
          'Authorization': this.$store.state.token
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
      // this.$store.state.token = ''
      this.$store.commit({
        type: 'SET_TOKEN',
        token: ''
      })
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
