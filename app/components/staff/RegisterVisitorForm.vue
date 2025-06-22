<template>
	<div class="register-visitor-form">
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
				<n-button type="primary" @click="handleSubmit">Register Visitor</n-button>
			</div>
		</n-form>
	</div>
</template>

<script setup lang="ts">
import { NButton, NForm, NFormItem, NInput } from 'naive-ui'
import { reactive, ref } from 'vue'

const emit = defineEmits<{
	submit: [visitorData: any]
	cancel: []
}>()

const formRef = ref(null)
const formValue = reactive({
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

function handleSubmit() {
	if (formRef.value) {
		formRef.value.validate((errors: any) => {
			if (!errors) {
				const visitorData = {
					name: `${formValue.firstName} ${formValue.lastName}`.trim(),
					phone: formValue.phone,
					email: formValue.email || null
				}
				emit('submit', visitorData)
			}
		})
	}
}

function handleCancel() {
	emit('cancel')
}
</script>

<style scoped>
.register-visitor-form {
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
