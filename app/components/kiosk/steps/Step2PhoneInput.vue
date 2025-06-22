<template>
	<div class="step2-phone">
		<div class="content">
			<!-- Header -->
			<div class="header">
				<h1 class="title">Enter Your Phone Number</h1>
				<p class="subtitle">Please enter the phone number you used when you first registered</p>
			</div>

			<!-- Phone Number Display -->
			<div class="phone-display">
				<div class="phone-input">
					<span class="phone-prefix">+1</span>
					<span class="phone-number">{{ formattedPhoneNumber }}</span>
					<span v-if="showCursor" class="cursor">|</span>
				</div>
			</div>

			<!-- Dialpad -->
			<div class="dialpad">
				<div v-for="(row, rowIndex) in dialpadLayout" :key="rowIndex" class="dialpad-row">
					<n-button
						v-for="button in row"
						:key="button.value"
						class="dialpad-btn"
						:disabled="button.disabled"
						@click="handleDialpadClick(button)"
					>
						<div class="btn-content">
							<span class="btn-number">{{ button.label }}</span>
							<span v-if="button.letters" class="btn-letters">{{ button.letters }}</span>
						</div>
					</n-button>
				</div>
			</div>

			<!-- Action Buttons -->
			<div class="actions">
				<n-button size="large" class="back-btn" @click="$emit('back')">
					<Icon :name="BackIcon" :size="20" />
					Back
				</n-button>

				<n-button
					size="large"
					type="primary"
					class="submit-btn"
					:disabled="phoneNumber.length < 10"
					@click="$emit('next')"
				>
					Continue
					<Icon :name="NextIcon" :size="20" />
				</n-button>
			</div>

			<!-- Clear Button -->
			<div class="clear-section">
				<n-button text type="error" class="clear-btn" :disabled="phoneNumber.length === 0" @click="clearPhoneNumber">
					<Icon :name="ClearIcon" :size="16" />
					Clear
				</n-button>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { NButton } from "naive-ui"
import { computed, onMounted, onUnmounted, ref, watch } from "vue"
import Icon from "@/components/common/Icon.vue"

// Props
const props = defineProps<{
	phoneNumber: string
}>()

// Emits
const emit = defineEmits<{
	"phone-updated": [value: string]
	next: []
	back: []
}>()

// Local state
const localPhoneNumber = ref(props.phoneNumber)
const showCursor = ref(true)

// Icons
const BackIcon = "mdi:arrow-left"
const NextIcon = "mdi:arrow-right"
const ClearIcon = "mdi:close"

// Dialpad layout
const dialpadLayout = [
	[
		{ value: "1", label: "1", letters: "" },
		{ value: "2", label: "2", letters: "ABC" },
		{ value: "3", label: "3", letters: "DEF" }
	],
	[
		{ value: "4", label: "4", letters: "GHI" },
		{ value: "5", label: "5", letters: "JKL" },
		{ value: "6", label: "6", letters: "MNO" }
	],
	[
		{ value: "7", label: "7", letters: "PQRS" },
		{ value: "8", label: "8", letters: "TUV" },
		{ value: "9", label: "9", letters: "WXYZ" }
	],
	[
		{ value: "*", label: "*", letters: "", disabled: true },
		{ value: "0", label: "0", letters: "+" },
		{ value: "#", label: "#", letters: "", disabled: true }
	]
]

// Computed
const formattedPhoneNumber = computed(() => {
	const phone = localPhoneNumber.value
	if (phone.length === 0) return ""
	if (phone.length <= 3) return phone
	if (phone.length <= 6) return `(${phone.slice(0, 3)}) ${phone.slice(3)}`
	return `(${phone.slice(0, 3)}) ${phone.slice(3, 6)}-${phone.slice(6, 10)}`
})

// Methods
function handleDialpadClick(button: any) {
	if (button.disabled || localPhoneNumber.value.length >= 10) return

	localPhoneNumber.value += button.value
	emit("phone-updated", localPhoneNumber.value)
}

function clearPhoneNumber() {
	localPhoneNumber.value = ""
	emit("phone-updated", "")
}

// Cursor animation
let cursorInterval: NodeJS.Timeout
function startCursorAnimation() {
	cursorInterval = setInterval(() => {
		showCursor.value = !showCursor.value
	}, 200)
}

function stopCursorAnimation() {
	if (cursorInterval) {
		clearInterval(cursorInterval)
	}
}

// Watch for prop changes
watch(
	() => props.phoneNumber,
	newValue => {
		localPhoneNumber.value = newValue
	}
)

// Lifecycle
onMounted(() => {
	startCursorAnimation()
})

onUnmounted(() => {
	stopCursorAnimation()
})
</script>

<style scoped>
.step2-phone {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
}

.content {
	text-align: center;
	max-width: 500px;
	width: 100%;
}

.header {
	margin-bottom: 40px;
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

.phone-display {
	margin-bottom: 40px;
	padding: 20px;
	background: rgba(255, 255, 255, 0.1);
	border-radius: 15px;
	backdrop-filter: blur(10px);
}

.phone-input {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	font-size: 32px;
	font-weight: bold;
	color: white;
	min-height: 50px;
}

.phone-prefix {
	color: rgba(255, 255, 255, 0.7);
}

.phone-number {
	letter-spacing: 2px;
}

.cursor {
	color: white;
	animation: blink 1s infinite;
}

@keyframes blink {
	0%,
	50% {
		opacity: 1;
	}
	51%,
	100% {
		opacity: 0;
	}
}

.dialpad {
	margin-bottom: 40px;
}

.dialpad-row {
	display: flex;
	justify-content: center;
	gap: 15px;
	margin-bottom: 15px;
}

.dialpad-btn {
	width: 80px;
	height: 80px;
	border-radius: 50%;
	font-size: 24px;
	font-weight: bold;
	background: rgba(255, 255, 255, 0.9);
	border: none;
	box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
	transition: all 0.2s ease;
}

.dialpad-btn:hover:not(:disabled) {
	transform: translateY(-2px);
	box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
	background: white;
}

.dialpad-btn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

.btn-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 2px;
}

.btn-number {
	font-size: 24px;
	font-weight: bold;
	color: #333;
}

.btn-letters {
	font-size: 10px;
	color: #666;
	font-weight: normal;
}

.actions {
	display: flex;
	justify-content: space-between;
	gap: 20px;
	margin-bottom: 20px;
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

.clear-section {
	text-align: center;
}

.clear-btn {
	color: rgba(255, 255, 255, 0.7);
	font-size: 16px;
	padding: 8px 16px;
	border-radius: 20px;
	transition: all 0.3s ease;
}

.clear-btn:hover:not(:disabled) {
	color: white;
	background-color: rgba(255, 255, 255, 0.1);
}

.clear-btn:disabled {
	opacity: 0.3;
	cursor: not-allowed;
}

/* Responsive design */
@media (max-width: 768px) {
	.step2-phone {
		padding: 20px;
	}

	.title {
		font-size: 28px;
	}

	.subtitle {
		font-size: 16px;
	}

	.phone-input {
		font-size: 24px;
	}

	.dialpad-btn {
		width: 70px;
		height: 70px;
	}

	.btn-number {
		font-size: 20px;
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

	.phone-input {
		font-size: 20px;
	}

	.dialpad-btn {
		width: 60px;
		height: 60px;
	}

	.btn-number {
		font-size: 18px;
	}
}
</style>
