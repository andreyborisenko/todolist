<template>
  <div class="ui basic content center aligned segment">
    <button class="ui basic button icon" @click="isCreating = true" v-show="!isCreating">
      <i class="plus icon"></i>
    </button>
    <div class="ui centered card" v-show="isCreating">
      <div class="content">
        <div class="ui form">
          <div class="field">
            <label>Title</label>
            <input v-model="title" type="text">
          </div>
          <div class="ui two button attached buttons">
            <button class="ui basic blue button" @click="sendForm" :disabled="title.length == 0">
              Create
            </button>
            <button class="ui basic red button" @click="isCreating = false">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: "",
      errorMessage: '',
      isCreating: false
    };
  },
  methods: {
    async sendForm() {      
      if (this.title.length == 0) return 

      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Authorization': this.$jwt,
          'content-type': 'application/json'
        },
        body: JSON.stringify({
          title: this.title
        })
      })

      if (response.status != 200) {
        console.log('Unable to add todo');
        const error = await response.json()
        this.errorMessage = error.message
      } else {
        const todo = await response.json()

        this.$emit("addTodo", todo);

        this.title = "";
        this.isCreating = false;
      }
    }
  }
};
</script>