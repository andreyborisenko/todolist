<template>
  <div class="ui centered card user-form">
    <div class="ui form" :class="{ 'error': errorMessage.length > 0 }">
      <div class="field">
        <label>Email</label>
        <input v-model="email" type="email">
      </div>
      <div class="field">
        <label>Password</label>
        <input v-model="password" type="password">
      </div>
      <div class="ui two button attached buttons">
        <button class="ui basic blue button" @click="register" :disabled="!isButtonsEnabled">
          Register
        </button>
        <button class="ui basic red button" @click="login" :disabled="!isButtonsEnabled">
          Login
        </button>
      </div>

      <div class="ui error message" v-if="errorMessage">
        <div class="header">{{ errorMessage }}</div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'user-form',
  data() {
    return {
      email: '',
      password: '',
      errorMessage: '',
      showError: false
    }
  },
  methods: {
    async register() {
      if (!this.isButtonsEnabled) return

      const response = await fetch('http://localhost:3001/register', {
        method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
      })

      if (response.status == 200) await this.login() 
      else this.errorMessage = await response.text()
    },
    async login() {
      if (!this.isButtonsEnabled) return

      try {
        const response = await fetch('http://localhost:3001/login', {
          method: 'POST',
          headers: {
            'content-type': 'application/json'
          },
          body: JSON.stringify({
            email: this.email,
            password: this.password
          })
        })

        if (response.status == 200) {
          const payload = await response.json()
          this.$emit('auth', payload)
          this.errorMessage = ''
        } else {
          this.errorMessage = await response.text()
        }

      } catch(err) {
        this.errorMessage = err.message
      }
    }
  },
  computed: {
    isButtonsEnabled() {
      return this.password.length > 0 && this.email.length > 0
    }
  }
}
</script>

<style scoped>
.user-form.card {
  padding: 10px;
  margin-top: 20px;
}
</style>
