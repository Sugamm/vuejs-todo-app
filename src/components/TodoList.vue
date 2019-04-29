<template>
  <div class="hello">
    <input type="text" class="todo-input" placeholder="What needs to be done" v-model="newTodo" @keyup.enter="addTodo">
    <transition-group name="fade" enter-active-clase="animated fadeInUp" leave-active-class="animated fadeOutDown">
      <!-- This way you can communicate between components parent to child using $emit function -->
      <!-- <TodoItem v-for="(todo, index) in todosFilter" :key="todo.id" :todo="todo" :index="index"  :checkAll="!anyRemaining" @removeTodo="removeTodo" @finishedEdit="finishedEdit">
      </TodoItem> -->
      <!-- Using Event Bus you can communicate with any component in the project -->
      <TodoItem v-for="(todo, index) in todosFilter" :key="todo.id" :todo="todo" :index="index"  :checkAll="!anyRemaining">
      </TodoItem>
    </transition-group>

    <div class="extra-container">
      <TodoCheckAll :anyRemaining="anyRemaining"></TodoCheckAll>
      <TodoItemRemaining :remaining="remaining"></TodoItemRemaining>
    </div>
    <div class="extra-container">
      <TodoFiltered></TodoFiltered>
      <transition name="fade">
        <TodoClearCompleted :showClearCompletedButton="showClearCompletedButton"></TodoClearCompleted>
      </transition>
    </div>
  </div>
</template>

<script>
import TodoItem from "./TodoItem"
import TodoItemRemaining from "./TodoItemRemaining"
import TodoCheckAll from "./TodoCheckAll"
import TodoFiltered from "./TodoFiltered"
import TodoClearCompleted from "./TodoClearCompleted"

export default {
  name: 'TodoList',
  components: {
    TodoItem,
    TodoItemRemaining,
    TodoCheckAll,
    TodoFiltered,
    TodoClearCompleted,
  },
  data() {
      return {
          newTodo: '',
          idForTodo: 3,
          beforeEditCache:'',
          filter:'all',
          todos: [
              {
                "id":1,
                "title": "Finish Vue Screencast",
                "completed":false,
                "editing":false
              },
              {
                "id":2,
                "title": "Take our world Screencast",
                "completed":false,
                "editing":false
              },
          ]
      }
  },
  created() {
    eventBus.$on('removeTodo', (index)  => this.removeTodo(index))
    eventBus.$on('finishedEdit', (data) => this.finishedEdit(data))
    eventBus.$on('checkAllChanged', (checked) => this.checkAllTodos(checked))
    eventBus.$on('filterChanged', (filter) => this.filter = filter)
    eventBus.$on('clearCompletedTodo', () => this.clearCompleted())
  },
  beforeDestroy() {
    eventBus.$off('removeTodo', (index)  => this.removeTodo(index))
    eventBus.$off('finishedEdit', (data) => this.finishedEdit(data))
    eventBus.$off('checkAllChanged', (checked) => this.checkAllTodos(checked))
    eventBus.$off('filterChanged', (filter) => this.filter = filter)
    eventBus.$off('clearCompletedTodo', () => this.clearCompleted())
  },
  computed: {
    remaining(){
      return this.todos.filter(todo => !todo.completed).length
    },
    anyRemaining() {
      return this.remaining != 0
    },
    todosFilter(){
      if(this.filter == 'all'){
        return this.todos
      } else if(this.filter == 'active'){
        return this.todos.filter(todo => !todo.completed)
      } else if(this.filter == 'completed'){
        return this.todos.filter(todo => todo.completed)
      }
      return this.todos
    },
    showClearCompletedButton(){
      return this.todos.filter(todo=> todo.completed).length > 0
    }
  },
  methods: {
      addTodo() {
          if(this.newTodo.trim().length == 0){
            alert("something should be there")
            this.newTodo=''
            return
          }

          this.todos.push({
            id:this.idForTodo,
            title:this.newTodo,
            completed:false,
            editing:false
          })
        this.newTodo=''
        this.idForTodo++
      },
      removeTodo(index) {
        this.todos.splice(index, 1)
      },
      editTodo(todo) {
        this.beforeEditCache = todo.title
        todo.editing=true;
      },
      doneTodo(todo) {
        if(todo.title.trim() == ''){
          todo.title=this.beforeEditCache
          return
        }
        todo.editing=false;
      },
      checkAllTodos(){
        this.todos.forEach((todo) => todo.completed = event.target.checked);
      },
      clearCompleted(){
        this.todos = this.todos.filter(todo => !todo.completed)
      },
      finishedEdit(data){
        this.todos.splice(data.index, 1, data.todo)
      }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss">
    @import url("https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.7.0/animate.css");
    .todo-input {
        width: 100%;
        padding:10px 18px;
        font-size: 18px;
        margin-bottom: 16px;
    }

    a:focus {
        outline: 0;
    }

    .todo-item {
      margin-bottom: 12px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      animation-duration: 0.3s;
    }

    .remove-items {
      cursor: pointer;
      margin-left: 14px;
      &:hover {
        color: black;
      }
    }
    .todo-item-left{
      display: flex;
      align-items: center
    }
    .todo-item-label{
      padding: 10px;
      border: 1px solid white;
      margin-left: 12px;
    }

    .todo-item-edit{
      font-size: 24px;
      color: #2c3e50;
      margin-left: 12px;
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      font-family: 'Times New Roman', Times, serif;

      &:focus{
        outline: none;
      }

    }

    .completed {
      text-decoration: line-through;
      color: gray;
    }

    .extra-container {
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 16px;
      border-top: 1px solid #000;
      padding-top: 14px;
      margin-bottom: 14px;
    }

    button {
      font-size: 14px;
      background-color: #fff;
      appearance: none;

      &:hover {
        background-color: lightgreen;
      }

      &:focus {
        outline: none;
      }
    }

    .active {
      background-color:lightgreen;
    }

    .fade-enter-active, .fade-leave-active {
      transition: opacity .2s;
    }

    .fade-enter, .fade-leave-to {
      opacity: 0;
    }
</style>
