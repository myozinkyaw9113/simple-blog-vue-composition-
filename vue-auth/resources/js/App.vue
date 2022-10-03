<template>
    <Nav></Nav>
    <router-view></router-view>
</template>

<script>
import Nav from './layouts/Nav.vue'

export default {
    name : 'App',
    components : {
        Nav
    },
}
</script>
