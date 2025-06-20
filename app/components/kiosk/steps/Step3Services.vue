<template>
	<div class="step3-services">
		<div class="content">
			<!-- Header -->
			<div class="header">
				<h1 class="title">Select Services</h1>
				<p class="subtitle">Welcome back, {{ visitorData?.name || 'Guest' }}</p>
			</div>

			<!-- Pantry Eligibility Warning -->
			<div v-if="showPantryWarning" class="pantry-warning">
				<n-alert type="warning" :show-icon="false">
					<div class="warning-content">
						<Icon :name="WarningIcon" :size="24" />
						<div class="warning-text">
							<h4>Cannot use pantry</h4>
							<p>Pantry is allowed once per veteran/household per 30 days. Your next eligibility date to use the pantry is: <strong>{{ nextPantryEligibilityDate }}</strong></p>
						</div>
					</div>
				</n-alert>
			</div>

			<!-- Services Grid -->
			<div class="services-grid">
				<div 
					v-for="service in availableServices" 
					:key="service.id"
					class="service-item"
					:class="{ 
						'selected': selectedServices.includes(service.id),
						'disabled': service.disabled
					}"
					@click="toggleService(service)"
				>
					<div class="service-icon">
						<Icon :name="service.icon" :size="48" />
					</div>
					<div class="service-content">
						<h3 class="service-title">{{ service.title }}</h3>
						<p class="service-description">{{ service.description }}</p>
						<div v-if="service.disabled" class="service-disabled">
							{{ service.disabledReason }}
						</div>
					</div>
					<div class="service-checkbox">
						<n-checkbox 
							:checked="selectedServices.includes(service.id)"
							:disabled="service.disabled"
							@update:checked="toggleService(service)"
						/>
					</div>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="actions">
				<n-button 
					size="large" 
					class="back-btn"
					@click="$emit('back')"
				>
					<Icon :name="BackIcon" :size="20" />
					Back
				</n-button>

				<n-button 
					size="large" 
					type="primary" 
					class="submit-btn"
					:disabled="selectedServices.length === 0"
					@click="$emit('next')"
				>
					Continue
					<Icon :name="NextIcon" :size="20" />
				</n-button>
			</div>

			<!-- Selected Services Summary -->
			<div v-if="selectedServices.length > 0" class="selected-summary">
				<h4>Selected Services ({{ selectedServices.length }})</h4>
				<div class="selected-list">
					<n-tag 
						v-for="serviceId in selectedServices" 
						:key="serviceId"
						:type="getServiceById(serviceId)?.type || 'default'"
						round
						closable
						@close="removeService(serviceId)"
					>
						{{ getServiceById(serviceId)?.title }}
					</n-tag>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NCheckbox, NAlert, NTag } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'

// Props
const props = defineProps<{
	selectedServices: string[]
	visitorData: any
}>()

// Emits
const emit = defineEmits<{
	'services-updated': [value: string[]]
	next: []
	back: []
}>()

// Local state
const localSelectedServices = ref<string[]>(props.selectedServices)

// Icons
const BackIcon = 'mdi:arrow-left'
const NextIcon = 'mdi:arrow-right'
const WarningIcon = 'mdi:alert-circle'

// Services data
const servicesData = [
	{
		id: 'pantry',
		title: 'Food Pantry',
		description: 'Access to our food pantry services',
		icon: 'mdi:food-variant',
		type: 'success',
		disabled: false,
		disabledReason: ''
	},
	{
		id: 'clothing',
		title: 'Clothing Assistance',
		description: 'Clothing and personal care items',
		icon: 'mdi:tshirt-crew',
		type: 'info',
		disabled: false,
		disabledReason: ''
	},
	{
		id: 'housing',
		title: 'Housing Support',
		description: 'Housing assistance and resources',
		icon: 'mdi:home',
		type: 'warning',
		disabled: false,
		disabledReason: ''
	},
	{
		id: 'employment',
		title: 'Employment Services',
		description: 'Job training and placement assistance',
		icon: 'mdi:briefcase',
		type: 'primary',
		disabled: false,
		disabledReason: ''
	},
	{
		id: 'healthcare',
		title: 'Healthcare Access',
		description: 'Medical and mental health services',
		icon: 'mdi:medical-bag',
		type: 'error',
		disabled: false,
		disabledReason: ''
	},
	{
		id: 'transportation',
		title: 'Transportation',
		description: 'Transportation assistance and resources',
		icon: 'mdi:car',
		type: 'default',
		disabled: false,
		disabledReason: ''
	}
]

// Computed
const availableServices = computed(() => {
	return servicesData.map(service => {
		if (service.id === 'pantry') {
			const isEligible = checkPantryEligibility()
			return {
				...service,
				disabled: !isEligible.eligible,
				disabledReason: isEligible.eligible ? '' : 'Not eligible until ' + isEligible.nextDate
			}
		}
		return service
	})
})

const showPantryWarning = computed(() => {
	const pantryService = availableServices.value.find(s => s.id === 'pantry')
	return pantryService?.disabled && hasUsedPantryBefore()
})

const nextPantryEligibilityDate = computed(() => {
	// Mock data - replace with actual API call
	const eligibility = checkPantryEligibility()
	return eligibility.nextDate
})

// Methods
const toggleService = (service: any) => {
	if (service.disabled) return
	
	const index = localSelectedServices.value.indexOf(service.id)
	if (index > -1) {
		localSelectedServices.value.splice(index, 1)
	} else {
		localSelectedServices.value.push(service.id)
	}
	
	emit('services-updated', localSelectedServices.value)
}

const removeService = (serviceId: string) => {
	const index = localSelectedServices.value.indexOf(serviceId)
	if (index > -1) {
		localSelectedServices.value.splice(index, 1)
		emit('services-updated', localSelectedServices.value)
	}
}

const getServiceById = (serviceId: string) => {
	return servicesData.find(service => service.id === serviceId)
}

const checkPantryEligibility = () => {
	// Mock pantry eligibility check - replace with actual API call
	// This should check the visitor's last pantry visit date
	const lastPantryVisit = getLastPantryVisit()
	const today = new Date()
	const thirtyDaysAgo = new Date(today.getTime() - (30 * 24 * 60 * 60 * 1000))
	
	if (!lastPantryVisit || new Date(lastPantryVisit) < thirtyDaysAgo) {
		return { eligible: true, nextDate: null }
	} else {
		const nextEligible = new Date(lastPantryVisit)
		nextEligible.setDate(nextEligible.getDate() + 30)
		return { 
			eligible: false, 
			nextDate: nextEligible.toLocaleDateString() 
		}
	}
}

const hasUsedPantryBefore = () => {
	// Mock check - replace with actual API call
	const lastPantryVisit = getLastPantryVisit()
	return !!lastPantryVisit
}

const getLastPantryVisit = () => {
	// Mock data - replace with actual API call
	// This should fetch the visitor's last pantry visit from the database
	return null // Return null if never used, or date string if used before
}

// Watch for prop changes
watch(() => props.selectedServices, (newValue) => {
	localSelectedServices.value = newValue
})
</script>

<style scoped>
.step3-services {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
	overflow-y: auto;
}

.content {
	text-align: center;
	max-width: 800px;
	width: 100%;
}

.header {
	margin-bottom: 30px;
}

.title {
	font-size: 36px;
	font-weight: bold;
	color: white;
	margin: 0 0 10px 0;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
	font-size: 18px;
	color: rgba(255, 255, 255, 0.9);
	margin: 0;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.pantry-warning {
	margin-bottom: 30px;
}

.warning-content {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	text-align: left;
}

.warning-text h4 {
	margin: 0 0 8px 0;
	color: #d97706;
}

.warning-text p {
	margin: 0;
	color: #92400e;
}

.services-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
	gap: 20px;
	margin-bottom: 40px;
}

.service-item {
	display: flex;
	align-items: center;
	gap: 20px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	backdrop-filter: blur(10px);
	border: 2px solid transparent;
	cursor: pointer;
	transition: all 0.3s ease;
	position: relative;
}

.service-item:hover:not(.disabled) {
	background: rgba(255, 255, 255, 0.15);
	border-color: rgba(255, 255, 255, 0.3);
	transform: translateY(-2px);
}

.service-item.selected {
	background: rgba(24, 160, 88, 0.2);
	border-color: #18a058;
}

.service-item.disabled {
	opacity: 0.5;
	cursor: not-allowed;
	background: rgba(255, 255, 255, 0.05);
}

.service-icon {
	color: white;
	flex-shrink: 0;
}

.service-content {
	flex: 1;
	text-align: left;
}

.service-title {
	font-size: 20px;
	font-weight: bold;
	color: white;
	margin: 0 0 8px 0;
}

.service-description {
	font-size: 14px;
	color: rgba(255, 255, 255, 0.8);
	margin: 0 0 8px 0;
}

.service-disabled {
	font-size: 12px;
	color: #f56565;
	font-weight: bold;
}

.service-checkbox {
	flex-shrink: 0;
}

.actions {
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 30px;
}

.back-btn,
.submit-btn {
	height: 50px;
	font-size: 18px;
	font-weight: bold;
	border-radius: 25px;
	padding: 0 30px;
}

.back-btn {
	background: rgba(255, 255, 255, 0.2);
	color: white;
	border: 2px solid rgba(255, 255, 255, 0.3);
}

.back-btn:hover {
	background: rgba(255, 255, 255, 0.3);
}

.submit-btn {
	background: #18a058;
	color: white;
	border: none;
}

.submit-btn:disabled {
	background: rgba(255, 255, 255, 0.3);
	color: rgba(255, 255, 255, 0.5);
	cursor: not-allowed;
}

.selected-summary {
	text-align: left;
	padding: 20px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	backdrop-filter: blur(10px);
}

.selected-summary h4 {
	color: white;
	margin: 0 0 15px 0;
	font-size: 18px;
}

.selected-list {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

/* Responsive design */
@media (max-width: 768px) {
	.step3-services {
		padding: 20px;
	}

	.title {
		font-size: 28px;
	}

	.subtitle {
		font-size: 16px;
	}

	.services-grid {
		grid-template-columns: 1fr;
		gap: 15px;
	}

	.service-item {
		padding: 15px;
		gap: 15px;
	}

	.service-title {
		font-size: 18px;
	}

	.actions {
		flex-direction: column;
		gap: 15px;
	}

	.back-btn,
	.submit-btn {
		width: 100%;
	}
}

@media (max-width: 480px) {
	.title {
		font-size: 24px;
	}

	.service-item {
		flex-direction: column;
		text-align: center;
		gap: 10px;
	}

	.service-content {
		text-align: center;
	}
}
</style> 