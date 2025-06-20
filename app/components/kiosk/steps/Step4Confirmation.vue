<template>
	<div class="step4-confirmation">
		<div class="content">
			<!-- Header -->
			<div class="header">
				<h1 class="title">Confirm Your Visit</h1>
				<p class="subtitle">Please review your selections before confirming</p>
			</div>

			<!-- Visit Summary -->
			<div class="visit-summary">
				<div class="summary-card">
					<h3>Visit Summary</h3>
					
					<div class="visitor-info">
						<div class="info-item">
							<Icon :name="UserIcon" :size="20" />
							<span><strong>Name:</strong> {{ visitorData?.name || 'N/A' }}</span>
						</div>
						<div class="info-item">
							<Icon :name="PhoneIcon" :size="20" />
							<span><strong>Phone:</strong> {{ formatPhone(visitorData?.phone) }}</span>
						</div>
						<div class="info-item">
							<Icon :name="TimeIcon" :size="20" />
							<span><strong>Check-in Time:</strong> {{ currentTime }}</span>
						</div>
					</div>

					<div class="services-summary">
						<h4>Selected Services ({{ selectedServices.length }})</h4>
						<div class="services-list">
							<div 
								v-for="serviceId in selectedServices" 
								:key="serviceId"
								class="service-item"
							>
								<Icon :name="getServiceIcon(serviceId)" :size="20" />
								<span>{{ getServiceTitle(serviceId) }}</span>
							</div>
						</div>
					</div>

					<!-- Pantry Eligibility Info -->
					<div v-if="showPantryInfo" class="pantry-info">
						<n-alert type="info" :show-icon="false">
							<div class="pantry-content">
								<Icon :name="InfoIcon" :size="20" />
								<div class="pantry-text">
									<h4>Pantry Information</h4>
									<p v-if="nextPantryEligibilityDate">
										Your next eligibility date for pantry services: <strong>{{ nextPantryEligibilityDate }}</strong>
									</p>
									<p v-else>
										You are eligible for pantry services today.
									</p>
								</div>
							</div>
						</n-alert>
					</div>
				</div>
			</div>

			<!-- Experience Rating (for repeat visitors) -->
			<div v-if="showRating" class="rating-section">
				<div class="rating-card">
					<h3>Rate Your Experience</h3>
					<p class="rating-subtitle">Please rate your experience with OSDRI services based on past encounters. (Optional)</p>
					
					<div class="rating-stars">
						<n-rate 
							v-model:value="rating" 
							:count="5"
							size="large"
							:show-score="false"
						/>
						<div class="rating-labels">
							<span>Poor</span>
							<span>Excellent</span>
						</div>
					</div>

					<div class="rating-comment">
						<n-input
							v-model:value="ratingComment"
							type="textarea"
							placeholder="Additional comments (optional)"
							:rows="3"
							:maxlength="500"
							show-count
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
					class="confirm-btn"
					@click="handleConfirm"
				>
					<Icon :name="CheckIcon" :size="20" />
					Confirm Visit
				</n-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { NButton, NAlert, NRate, NInput } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'

// Props
const props = defineProps<{
	visitorData: any
	selectedServices: string[]
}>()

// Emits
const emit = defineEmits<{
	confirm: []
	back: []
}>()

// Local state
const rating = ref(0)
const ratingComment = ref('')
const currentTime = ref(new Date().toLocaleString())

// Icons
const BackIcon = 'mdi:arrow-left'
const CheckIcon = 'mdi:check'
const UserIcon = 'mdi:account'
const PhoneIcon = 'mdi:phone'
const TimeIcon = 'mdi:clock'
const InfoIcon = 'mdi:information'

// Services mapping
const servicesMap = {
	pantry: { title: 'Food Pantry', icon: 'mdi:food-variant' },
	clothing: { title: 'Clothing Assistance', icon: 'mdi:tshirt-crew' },
	housing: { title: 'Housing Support', icon: 'mdi:home' },
	employment: { title: 'Employment Services', icon: 'mdi:briefcase' },
	healthcare: { title: 'Healthcare Access', icon: 'mdi:medical-bag' },
	transportation: { title: 'Transportation', icon: 'mdi:car' }
}

// Computed
const showRating = computed(() => {
	// Show rating for visitors who have visited more than twice before
	// This should be replaced with actual API call to check visit history
	return getVisitCount() > 2
})

const showPantryInfo = computed(() => {
	return props.selectedServices.includes('pantry') || hasUsedPantryBefore()
})

const nextPantryEligibilityDate = computed(() => {
	// Mock data - replace with actual API call
	const eligibility = checkPantryEligibility()
	return eligibility.nextDate
})

// Methods
const formatPhone = (phone: string) => {
	if (!phone) return 'N/A'
	if (phone.length === 10) {
		return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6)}`
	}
	return phone
}

const getServiceTitle = (serviceId: string) => {
	return servicesMap[serviceId as keyof typeof servicesMap]?.title || serviceId
}

const getServiceIcon = (serviceId: string) => {
	return servicesMap[serviceId as keyof typeof servicesMap]?.icon || 'mdi:help-circle'
}

const handleConfirm = () => {
	// Submit rating if provided
	if (rating.value > 0) {
		submitRating({
			visitorId: props.visitorData?.id,
			rating: rating.value,
			comment: ratingComment.value,
			date: new Date().toISOString()
		})
	}
	
	emit('confirm')
}

const getVisitCount = () => {
	// Mock data - replace with actual API call
	// This should return the number of previous visits
	return 3 // Mock value for testing
}

const hasUsedPantryBefore = () => {
	// Mock check - replace with actual API call
	const lastPantryVisit = getLastPantryVisit()
	return !!lastPantryVisit
}

const checkPantryEligibility = () => {
	// Mock pantry eligibility check - replace with actual API call
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

const getLastPantryVisit = () => {
	// Mock data - replace with actual API call
	return '2024-01-15' // Mock date for testing
}

const submitRating = async (ratingData: any) => {
	// Mock API call - replace with actual submission
	console.log('Submitting rating:', ratingData)
	await new Promise(resolve => setTimeout(resolve, 500))
}
</script>

<style scoped>
.step4-confirmation {
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
	max-width: 700px;
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

.visit-summary {
	margin-bottom: 30px;
}

.summary-card {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	backdrop-filter: blur(10px);
	padding: 30px;
	text-align: left;
}

.summary-card h3 {
	color: white;
	font-size: 24px;
	margin: 0 0 20px 0;
	text-align: center;
}

.visitor-info {
	margin-bottom: 25px;
}

.info-item {
	display: flex;
	align-items: center;
	gap: 12px;
	margin-bottom: 12px;
	color: white;
	font-size: 16px;
}

.info-item strong {
	color: rgba(255, 255, 255, 0.9);
}

.services-summary {
	margin-bottom: 25px;
}

.services-summary h4 {
	color: white;
	font-size: 18px;
	margin: 0 0 15px 0;
}

.services-list {
	display: flex;
	flex-direction: column;
	gap: 10px;
}

.service-item {
	display: flex;
	align-items: center;
	gap: 12px;
	padding: 12px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 8px;
	color: white;
	font-size: 16px;
}

.pantry-info {
	margin-top: 20px;
}

.pantry-content {
	display: flex;
	align-items: flex-start;
	gap: 12px;
	text-align: left;
}

.pantry-text h4 {
	margin: 0 0 8px 0;
	color: #3b82f6;
}

.pantry-text p {
	margin: 0;
	color: #1e40af;
}

.rating-section {
	margin-bottom: 30px;
}

.rating-card {
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	backdrop-filter: blur(10px);
	padding: 30px;
	text-align: center;
}

.rating-card h3 {
	color: white;
	font-size: 24px;
	margin: 0 0 10px 0;
}

.rating-subtitle {
	color: rgba(255, 255, 255, 0.8);
	font-size: 16px;
	margin: 0 0 25px 0;
}

.rating-stars {
	margin-bottom: 25px;
}

.rating-labels {
	display: flex;
	justify-content: space-between;
	margin-top: 10px;
	color: rgba(255, 255, 255, 0.7);
	font-size: 14px;
}

.rating-comment {
	max-width: 400px;
	margin: 0 auto;
}

.actions {
	display: flex;
	justify-content: space-between;
	gap: 20px;
}

.back-btn,
.confirm-btn {
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

.confirm-btn {
	background: #18a058;
	color: white;
	border: none;
}

.confirm-btn:hover {
	background: #16a34a;
}

/* Responsive design */
@media (max-width: 768px) {
	.step4-confirmation {
		padding: 20px;
	}

	.title {
		font-size: 28px;
	}

	.subtitle {
		font-size: 16px;
	}

	.summary-card,
	.rating-card {
		padding: 20px;
	}

	.summary-card h3,
	.rating-card h3 {
		font-size: 20px;
	}

	.actions {
		flex-direction: column;
		gap: 15px;
	}

	.back-btn,
	.confirm-btn {
		width: 100%;
	}
}

@media (max-width: 480px) {
	.title {
		font-size: 24px;
	}

	.info-item {
		font-size: 14px;
	}

	.service-item {
		font-size: 14px;
		padding: 10px;
	}
}
</style> 