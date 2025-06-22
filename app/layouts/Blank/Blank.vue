<template>
	<slot />
</template>

<script lang="ts" setup>
import "./main.scss"
</script>

<style lang="scss" scoped>
.layout {
	width: 100vw;
	height: 100vh;
	height: 100svh;
	overflow: hidden;
	perspective: 1000px;
}
</style>
