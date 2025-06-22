<template>
	<div class="add-visit-form">
		<n-form @submit.prevent="onSubmit">
			<n-form-item label="Visitor" path="visitorId">
				<n-select v-model:value="form.visitorId" :options="visitorOptions" placeholder="Select a visitor" required />
			</n-form-item>
			<n-form-item label="Services" path="services">
				<n-select v-model:value="form.services" :options="serviceOptions" multiple placeholder="Select services" required />
			</n-form-item>
			<n-form-item label="Notes" path="notes">
				<n-input v-model:value="form.notes" type="textarea" placeholder="Notes (optional)" />
			</n-form-item>
			<div class="actions">
				<n-button type="primary" attr-type="submit">Add Visit</n-button>
				<n-button @click.prevent="$emit('cancel')">Cancel</n-button>
			</div>
		</n-form>
	</div>
</template>

<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { computed, defineEmits, defineProps, ref } from 'vue'

const props = defineProps({
	visitors: {
		type: Array,
		required: true
	}
})
const emit = defineEmits(['submit', 'cancel'])
const form = ref({
	visitorId: null,
	services: [],
	notes: ''
})

const visitorOptions = computed(() =>
	props.visitors.map((v: any) => ({ label: v.name, value: v.id }))
)

const serviceOptions = [
	{ label: 'Pantry', value: 'pantry' },
	{ label: 'Clothing', value: 'clothing' },
	{ label: 'Housing', value: 'housing' },
	{ label: 'Other', value: 'other' }
]

function onSubmit() {
	emit('submit', { ...form.value })
}
</script>

<style scoped>
.add-visit-form {
	padding: 8px 0;
}
.actions {
	display: flex;
	gap: 12px;
	margin-top: 20px;
}
</style>
