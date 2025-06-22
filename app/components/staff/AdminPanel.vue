<template>
	<div class="admin-panel">
		<n-card title="Export Data">
			<n-button @click="$emit('export-data', 'visitors')">Export Visitors</n-button>
			<n-button @click="$emit('export-data', 'visits')">Export Visits</n-button>
		</n-card>
		<!-- You can add more admin controls here -->
	</div>
</template>

<script setup lang="ts">
import { NButton, NCard } from "naive-ui"
import { defineEmits, defineProps } from "vue"

defineProps({
	stats: {
		type: Object,
		required: false
	}
})

defineEmits(["export-data"])
</script>

<style scoped>
.admin-panel {
	margin-top: 16px;
}
.n-card {
	padding: 16px;
}
.n-button {
	margin-right: 10px;
}
</style>
