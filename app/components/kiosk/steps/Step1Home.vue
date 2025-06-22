<template>
	<div class="step1-home">
		<div class="content">
			<!-- Logo/Branding -->
			<div class="branding">
				<Icon :name="LogoIcon" :size="120" class="logo" />
				<h1 class="title">Welcome to OSDRI</h1>
				<p class="subtitle">Operation Stand Down Rhode Island</p>
			</div>

			<!-- Main Action Button -->
			<div class="main-action">
				<n-button
					size="large"
					type="primary"
					class="checkin-btn"
					@click="$emit('next')"
				>
					<div class="btn-content">
						<Icon :name="TouchIcon" :size="48" />
						<span class="btn-text">Tap to Check In</span>
					</div>
				</n-button>
			</div>

			<!-- Privacy Notice Button -->
			<div class="privacy-section">
				<n-button
					text
					type="info"
					class="privacy-btn"
					@click="$emit('privacy-notice')"
				>
					<Icon :name="InfoIcon" :size="20" />
					<span>Privacy Notice</span>
				</n-button>
			</div>

			<!-- Footer -->
			<div class="footer">
				<p class="footer-text">For assistance, please ask a staff member</p>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { NButton } from 'naive-ui'
import Icon from '@/components/common/Icon.vue'

// Emit events
defineEmits<{
	next: []
	'privacy-notice': []
}>()
// Icons
const LogoIcon = 'healthicons--military-worker'
const TouchIcon = 'mdi:hand-pointing-up'
const InfoIcon = 'mdi:information-outline'
</script>

<style scoped>
.step1-home {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	padding: 40px;
}

.content {
	text-align: center;
	max-width: 600px;
	width: 100%;
}

.branding {
	margin-bottom: 60px;
}

.logo {
	color: white;
	margin-bottom: 20px;
}

.title {
	font-size: 48px;
	font-weight: bold;
	color: white;
	margin: 0 0 10px 0;
	text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
}

.subtitle {
	font-size: 24px;
	color: rgba(255, 255, 255, 0.9);
	margin: 0;
	text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

.main-action {
	margin-bottom: 60px;
}

.checkin-btn {
	width: 400px;
	height: 200px;
	font-size: 32px;
	font-weight: bold;
	border-radius: 20px;
	box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
	transition: all 0.3s ease;
}

.checkin-btn:hover {
	transform: translateY(-4px);
	box-shadow: 0 12px 40px rgba(0, 0, 0, 0.4);
}

.btn-content {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 16px;
}

.btn-text {
	font-size: 28px;
	font-weight: bold;
}

.privacy-section {
	margin-bottom: 40px;
}

.privacy-btn {
	color: rgba(255, 255, 255, 0.8);
	font-size: 18px;
	padding: 12px 24px;
	border-radius: 25px;
	transition: all 0.3s ease;
}

.privacy-btn:hover {
	color: white;
	background-color: rgba(255, 255, 255, 0.1);
}

.footer {
	margin-top: 40px;
}

.footer-text {
	color: rgba(255, 255, 255, 0.7);
	font-size: 16px;
	margin: 0;
}

/* Responsive design */
@media (max-width: 768px) {
	.step1-home {
		padding: 20px;
	}

	.title {
		font-size: 36px;
	}

	.subtitle {
		font-size: 20px;
	}

	.checkin-btn {
		width: 300px;
		height: 150px;
	}

	.btn-text {
		font-size: 24px;
	}

	.privacy-btn {
		font-size: 16px;
	}
}

@media (max-width: 480px) {
	.title {
		font-size: 28px;
	}

	.subtitle {
		font-size: 18px;
	}

	.checkin-btn {
		width: 250px;
		height: 120px;
	}

	.btn-text {
		font-size: 20px;
	}
}
</style>