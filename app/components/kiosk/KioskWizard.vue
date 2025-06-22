<template>
	<div class="kiosk-wizard">
		<!-- Step 1: Home Screen -->
		<div v-if="currentStep === 1" class="step-container">
			<Step1Home @next="goToStep(2)" @privacy-notice="showPrivacyNotice = true" />
		</div>

		<!-- Step 2: Phone Number Input -->
		<div v-if="currentStep === 2" class="step-container">
			<Step2PhoneInput
				:phone-number="phoneNumber"
				@phone-updated="phoneNumber = $event"
				@next="handlePhoneSubmit"
				@back="goToStep(1)"
			/>
		</div>

		<!-- Step 3: Services Selection -->
		<div v-if="currentStep === 3" class="step-container">
			<Step3Services
				:selected-services="selectedServices"
				:visitor-data="visitorData"
				@services-updated="selectedServices = $event"
				@next="handleServicesSubmit"
				@back="goToStep(2)"
			/>
		</div>

		<!-- Step 4: Confirmation -->
		<div v-if="currentStep === 4" class="step-container">
			<Step4Confirmation
				:visitor-data="visitorData"
				:selected-services="selectedServices"
				@confirm="handleConfirmation"
				@back="goToStep(3)"
			/>
		</div>

		<!-- Privacy Notice Modal -->
		<n-modal v-model:show="showPrivacyNotice" preset="card" title="Privacy Notice" class="privacy-modal">
			<div class="privacy-content">
				<h3>Privacy Notice</h3>
				<p>
					Your privacy is important to us. This kiosk system collects and stores your information for the purpose of
					providing services and maintaining records of your visits.
				</p>
				<p>
					We use your phone number to identify you and track your service usage. Your information is kept confidential
					and is only used for service metrics, administration purposes, and for providing accurate numbers to our
					grantors.
				</p>
				<p>By using this kiosk, you consent to the collection and use of your information as described above.</p>
			</div>
			<template #footer>
				<n-button type="primary" @click="showPrivacyNotice = false">I Understand</n-button>
			</template>
		</n-modal>

		<!-- Error Modal -->
		<n-modal v-model:show="showErrorModal" preset="card" title="Error" class="error-modal">
			<div class="error-content">
				<h3>{{ errorTitle }}</h3>
				<p>{{ errorMessage }}</p>
				<div v-if="countdown > 0" class="countdown">Resetting in {{ countdown }} seconds...</div>
			</div>
			<template #footer>
				<n-button v-if="countdown === 0" type="primary" @click="resetKiosk">OK</n-button>
			</template>
		</n-modal>

		<!-- Staff Override Modal -->
		<n-modal v-model:show="showStaffOverrideModal" preset="card" title="Staff Request" class="staff-override-modal">
			<div class="staff-override-content">
				<h3>Staff Member Request</h3>
				<p>{{ staffOverrideMessage }}</p>
				<p>Please continue to the next step.</p>
			</div>
			<template #footer>
				<n-button type="primary" @click="handleStaffOverride">Continue</n-button>
			</template>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { NButton, NModal } from "naive-ui"
import { onMounted, ref } from "vue"
import Step1Home from "./steps/Step1Home.vue"
import Step2PhoneInput from "./steps/Step2PhoneInput.vue"
import Step3Services from "./steps/Step3Services.vue"
import Step4Confirmation from "./steps/Step4Confirmation.vue"

// Step management
const currentStep = ref(1)
const phoneNumber = ref("")
const selectedServices = ref<string[]>([])
const visitorData = ref<any>(null)

// Modal states
const showPrivacyNotice = ref(false)
const showErrorModal = ref(false)
const showStaffOverrideModal = ref(false)
const errorTitle = ref("")
const errorMessage = ref("")
const countdown = ref(0)
const staffOverrideMessage = ref("")

// Navigation
function goToStep(step: number) {
	currentStep.value = step
}

// Phone number submission handler
async function handlePhoneSubmit() {
	try {
		// Simulate API call to check visitor
		const response = await checkVisitor(phoneNumber.value)

		if (response.status === "no-match") {
			showError(
				"Phone Number Not Found",
				"Check phone number. Does not exist or is incorrect. Make sure to use the phone number initially provided. If you do not remember your login, do not provide ID and register again, instead have the staff member look your name up and provide your number or update your number."
			)
			// Alert staff member dashboard
			alertStaffMember(phoneNumber.value)
		} else if (response.status === "flagged-no-serve") {
			showError("Unable to Help", "We are unable to help you at this time. Seek staff member for further assistance.")
			startCountdown(30)
		} else if (response.status === "flagged-staff-override") {
			staffOverrideMessage.value = `${response.staffMember} requests to speak with you after checking in.`
			showStaffOverrideModal.value = true
			visitorData.value = response.visitorData
		} else if (response.status === "success") {
			visitorData.value = response.visitorData
			goToStep(3)
		}
	} catch (error) {
		showError("System Error", "An error occurred. Please try again or contact staff.")
	}
}

// Services submission handler
function handleServicesSubmit() {
	goToStep(4)
}

// Confirmation handler
async function handleConfirmation() {
	try {
		// Submit visit data
		await submitVisit({
			visitorId: visitorData.value.id,
			services: selectedServices.value,
			checkInTime: new Date().toISOString()
		})

		// Reset and return to step 1
		resetKiosk()
	} catch (error) {
		showError("Submission Error", "Failed to submit visit. Please try again.")
	}
}

// Staff override handler
function handleStaffOverride() {
	showStaffOverrideModal.value = false
	setTimeout(() => {
		goToStep(3)
	}, 5000) // 5 second delay as specified
}

// Error handling
function showError(title: string, message: string) {
	errorTitle.value = title
	errorMessage.value = message
	showErrorModal.value = true
}

function startCountdown(seconds: number) {
	countdown.value = seconds
	const interval = setInterval(() => {
		countdown.value--
		if (countdown.value <= 0) {
			clearInterval(interval)
			resetKiosk()
		}
	}, 1000)
}

function resetKiosk() {
	currentStep.value = 1
	phoneNumber.value = ""
	selectedServices.value = []
	visitorData.value = null
	showErrorModal.value = false
	showStaffOverrideModal.value = false
	countdown.value = 0
}

// Mock API functions (replace with actual API calls)
async function checkVisitor(phone: string) {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 1000))

	// Mock responses - replace with actual API logic
	if (phone === "555-0000") {
		return { status: "no-match" }
	} else if (phone === "555-0001") {
		return { status: "flagged-no-serve" }
	} else if (phone === "555-0002") {
		return {
			status: "flagged-staff-override",
			staffMember: "John Smith",
			visitorData: { id: 1, name: "Jane Doe", phone }
		}
	} else {
		return {
			status: "success",
			visitorData: { id: 1, name: "Jane Doe", phone }
		}
	}
}

function alertStaffMember(phone: string) {
	// Implement staff alert system
	console.log("Alerting staff about phone number:", phone)
}

async function submitVisit(visitData: any) {
	// Simulate API delay
	await new Promise(resolve => setTimeout(resolve, 1000))
	console.log("Submitting visit:", visitData)
}

onMounted(() => {
	// Initialize kiosk
})
</script>

<style scoped>
.kiosk-wizard {
	width: 100%;
	height: 100vh;
	display: flex;
	align-items: center;
	justify-content: center;
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.step-container {
	width: 100%;
	max-width: 800px;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}

.privacy-modal,
.error-modal,
.staff-override-modal {
	max-width: 600px;
}

.privacy-content,
.error-content,
.staff-override-content {
	padding: 20px 0;
}

.countdown {
	font-size: 18px;
	font-weight: bold;
	color: #ff4757;
	margin-top: 20px;
	text-align: center;
}
</style>
