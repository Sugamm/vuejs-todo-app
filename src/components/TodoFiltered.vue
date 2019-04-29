<template>
    <div>
        <button :class="{ active: filter == 'all'}" @click="changeFiltered('all')">All</button>
        <button :class="{ active: filter == 'active'}" @click="changeFiltered('active')">Active</button>
        <button :class="{ active: filter == 'completed'}" @click="changeFiltered('completed')">Completed</button>
    </div>
</template>

<script>
export default {
    name: 'todo-filtered',
    data() {
        return {
            'filter':'all',
        }
    },
    methods: {
        changeFiltered(filter){
            this.filter = filter
            eventBus.$emit('filterChanged', filter)
        }
    },
}
</script>