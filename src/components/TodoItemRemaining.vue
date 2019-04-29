<template>
    <div>
        <div>{{ remaining }} items left</div>
    </div>
</template>

<script>
export default {
    name: 'todo-remaining',
    props: {
        remaining: {
            type: Number,
            required: true,
        }
    }
}
</script>