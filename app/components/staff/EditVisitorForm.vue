<template>
	<div class="edit-visitor-form">
		<n-form
			ref="formRef"
			:model="formValue"
			:rules="rules"
			label-placement="left"
			label-width="100px"
			require-mark-placement="right-hanging"
		>
			<n-form-item label="First Name" path="firstName">
				<n-input v-model:value="formValue.firstName" placeholder="First Name" />
			</n-form-item>

			<n-form-item label="Last Name" path="lastName">
				<n-input v-model:value="formValue.lastName" placeholder="Last Name" />
			</n-form-item>

			<n-form-item label="Phone" path="phone">
				<n-input v-model:value="formValue.phone" placeholder="Phone Number" />
			</n-form-item>

			<n-form-item label="Email" path="email">
				<n-input v-model:value="formValue.email" placeholder="Email Address (Optional)" />
			</n-form-item>

			<div class="form-actions">
				<n-button @click="handleCancel">Cancel</n-button>
				<n-button type="primary" @click="handleSubmit">Save Changes</n-button>
			</div>
		</n-form>
	</div>
</template>

<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { onMounted, reactive, ref } from 'vue'

const props = defineProps<{
	visitor: {
		id: number
		name: string
		phone: string
		email?: string
	} | null
}>()

const emit = defineEmits<{
	submit: [updatedData: any]
	cancel: []
}>()

const formRef = ref(null)
const formValue = reactive({
	id: 0,
	firstName: '',
	lastName: '',
	phone: '',
	email: ''
})

const rules = {
	firstName: {
		required: true,
		message: 'Please enter a first name',
		trigger: 'blur'
	},
	lastName: {
		required: true,
		message: 'Please enter a last name',
		trigger: 'blur'
	},
	phone: {
		required: true,
		message: 'Please enter a phone number',
		trigger: 'blur'
	}
}

// Initialize form with visitor data
onMounted(() => {
	if (props.visitor) {
		formValue.id = props.visitor.id
		// Split name into first and last
		const nameParts = props.visitor.name.split(' ')
		formValue.firstName = nameParts[0] || ''
		formValue.lastName = nameParts.slice(1).join(' ') || ''
		formValue.phone = props.visitor.phone || ''
		formValue.email = props.visitor.email || ''
	}
})

function handleSubmit() {
	if (formRef.value) {
		formRef.value.validate((errors: any) => {
			if (!errors) {
				// Combine first and last name
				const updatedData = {
					id: formValue.id,
					name: `${formValue.firstName} ${formValue.lastName}`.trim(),
					phone: formValue.phone,
					email: formValue.email
				}
				emit('submit', updatedData)
			}
		})
	}
}

function handleCancel() {
	emit('cancel')
}
</script>

<style scoped>
.edit-visitor-form {
	max-width: 500px;
	margin: 0 auto;
}

.form-actions {
	display: flex;
	justify-content: flex-end;
	margin-top: 20px;
	gap: 10px;
}
</style>
