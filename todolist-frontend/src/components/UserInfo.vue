<template>
  <div class="ui centered user-info">
    <h2>Hello, {{ user.email }}</h2>
    <button class="ui inverted red button" @click="$emit('logout')">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'user-info',
  props: {
    user: {
      type: Object,
      required: true
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scoped>
h2 {
  text-align: center;
  margin: 30px 0 15px;
}

.user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-flow: column
}
</style>
