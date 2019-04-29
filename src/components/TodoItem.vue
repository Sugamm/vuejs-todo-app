<template>
    <div class="todo-item">
        <div class="todo-item-left">
            <input type="checkbox" v-model="completed" @change="doneEdit">
            <div v-if="!editing" @dblclick="editTodo" class="todo-item-label" :class="{completed : completed}">{{title}}</div>
            <input type="text" v-else class="todo-item-edit" v-model="title" @blur="doneTodo" @keyup.enter="doneTodo" @keyup.esc="cancelEditing" v-focus>
        </div>
        <button @click="pluralize">Plural</button>
        <span class="remove-items" @click="removeTodo(index)">
            &times;
        </span>
    </div>
</template>

<script>
export default {
    name:"todo-item",
    props: {
        todo:{
            type: Object,
            required:true
        },
        index:{
            type: Number,
            required:true
        },
        checkAll:{
            type: Boolean,
            required: true
        }
    },
    data(){
        return {
            'id': this.todo.id,
            'title':this.todo.title,
            'completed': this.todo.completed,
            'editing': this.todo.editing,
            'beforeEditCache' : '',
        }
    },
    watch: {
        checkAll() {
            // if(this.checkAll){
            //     this.completed=true
            // }else{
            //     this.completed=this.todo.completed
            // }
            this.completed=this.checkAll ?  true : this.todo.completed
        }
    },
    directives:{
        focus: {
            inserted: function(el){
                el.focus()
            }
        }
    },
    created() {
        eventBus.$on('pluralize', this.handlePluralize)
    },
    beforeDestroy() {
        eventBus.$off('pluralize', this.handlePluralize)
    },
    methods: {
        removeTodo(index){
            eventBus.$emit('removeTodo', index)
        },
        editTodo() {
            this.beforeEditCache = this.title
            this.editing=true;
        },
        doneTodo() {
            if(this.title.trim() == ''){
                this.title=this.beforeEditCache
            return
            }
            this.editing=false;
            eventBus.$emit('finishedEdit', {
                'index': this.index,
                'todo':{
                    'id': this.id,
                    'title': this.title,
                    'completed': this.completed,
                    'editing': this.editing,
                }
            })
        },
        doneEdit() {
            if(this.title.trim() == ''){
                this.title=this.beforeEditCache
            return
            }
            this.editing=false;
            eventBus.$emit('finishedEdit', {
                'index': this.index,
                'todo':{
                    'id': this.id,
                    'title': this.title,
                    'completed': this.completed,
                    'editing': this.editing,
                }
            })
        },
        cancelEditing() {
            this.title = this.beforeEditCache
            this.editing = false
        },
        pluralize(){
            eventBus.$emit('pluralize')
        },
        handlePluralize(){
            this.title = this.title + 's'
            eventBus.$emit('finishedEdit', {
                'index': this.index,
                'todo':{
                    'id': this.id,
                    'title': this.title,
                    'completed': this.completed,
                    'editing': this.editing,
                }
            })
        }
    },
}
</script>