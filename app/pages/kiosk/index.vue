<template>
	<div class="kiosk-choice">
		<div class="choice-container">
			<h1>Kiosk Management</h1>
			<p class="subtitle">Select an option to proceed</p>

			<div class="choice-options">
				<NuxtLink to="/kiosk/visitor" class="choice-card visitor">
					<div class="card-content">
						<Icon :name="VisitorIcon" :size="48" class="card-icon" />
						<h2>Start Visitor Kiosk</h2>
						<p>Begin the visitor check-in process in full-screen mode</p>
					</div>
				</NuxtLink>

				<NuxtLink to="/kiosk/dashboard" class="choice-card staff">
					<div class="card-content">
						<Icon :name="StaffIcon" :size="48" class="card-icon" />
						<h2>Staff Dashboard</h2>
						<p>Manage visitors, view history, and access administrative tools</p>
					</div>
				</NuxtLink>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Layout } from "~~/types/theme.d"
import Icon from "@/components/common/Icon.vue"

definePageMeta({
	title: "Kiosk Management",
	auth: true,
	theme: {
		layout: Layout.VerticalNav
	}
})

// Icons
const VisitorIcon = "mdi:tablet-dashboard"
const StaffIcon = "mdi:account-cog"
</script>

<style scoped>
.kiosk-choice {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: calc(100vh - 120px);
	padding: 20px;
}

.choice-container {
	max-width: 900px;
	width: 100%;
	text-align: center;
}

.choice-container h1 {
	font-size: 32px;
	margin-bottom: 10px;
}

.subtitle {
	font-size: 18px;
	color: var(--text-color-secondary);
	margin-bottom: 40px;
}

.choice-options {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 30px;
	margin-top: 30px;
}

.choice-card {
	display: block;
	border-radius: 12px;
	padding: 30px 20px;
	text-align: center;
	color: white;
	text-decoration: none;
	transition: all 0.3s ease;
	height: 250px;
}

.choice-card:hover {
	transform: translateY(-5px);
	box-shadow: 0 10px 20px rgba(0, 0, 0, 0.15);
}

.visitor {
	background: linear-gradient(135deg, #2193b0 0%, #6dd5ed 100%);
}

.staff {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.card-content {
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100%;
}

.card-icon {
	margin-bottom: 20px;
	opacity: 0.9;
}

.choice-card h2 {
	margin: 0 0 10px 0;
	font-size: 24px;
	font-weight: 600;
}

.choice-card p {
	margin: 0;
	font-size: 16px;
	opacity: 0.85;
}

/* Responsive styles */
@media (max-width: 768px) {
	.choice-options {
		grid-template-columns: 1fr;
	}
}
</style>
