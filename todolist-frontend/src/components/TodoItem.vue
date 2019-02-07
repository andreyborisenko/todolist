<template>
  <div class='ui centered card'>
    <!-- // Todo shown when we are not in editing mode. -->
    <div class="content" v-show="!isEditing">
      <div class='header'>
          {{ todo.title }}
      </div>
      <div class='extra content'>
        <span class='right floated edit icon' @click="isEditing = true">
          <i class='edit icon big'></i>
        </span>
        <span class='right floated trash icon' @click="deleteTodo(todo)">
          <i class='trash icon big'></i>
        </span>
      </div>
    </div>
    <!-- // form is visible when we are in editing mode -->
    <div class="content" v-show="isEditing">
      <div class="ui form">
        <div class="field">
          <label>Title</label>
          <input type="text" v-model="title" >
        </div>
        <div class="ui two button attached buttons">
          <button class="ui basic blue button" @click="saveTodo(todo)">
            Save
          </button>
          <button class="ui basic blue button" @click="isEditing = false">
            Close X
          </button>
        </div>
      </div>
    </div>
    <div class="ui bottom attached green basic button" v-show="!isEditing && todo.isDone" disabled>
        Completed
    </div>
    <div class="ui bottom attached red basic button" v-show="!isEditing && !todo.isDone" @click="completeTodo(todo)">
        Pending
    </div>
  </div>
</template>

<script>
export default {
  props: ["todo"],
  data() {
    return {
      title: '',
      isEditing: false
    };
  },
  methods: {
    saveTodo({ _id: id }) {
      this.$emit("saveTodo", {
        id,
        title: this.title
      });
      this.isEditing = false
    },
    deleteTodo({ _id: id }) {
      this.$emit("deleteTodo", id);
    },
    completeTodo({ _id: id }) {
      this.$emit("completeTodo", id);
    }
  },
  watch: {
    isEditing(v) {
      if (v) {
        this.title = this.todo.title
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.button[disabled] {
  cursor: not-allowed;
}
i {
  cursor: pointer;
}
</style>
