<template>
	<div class="kiosk-page">
		<KioskWizard />
	</div>
</template>

<script setup lang="ts">
import { Layout } from "~~/types/theme.d"
import KioskWizard from "@/components/kiosk/KioskWizard.vue"

definePageMeta({
	title: "Visitor Kiosk",
	auth: false,
	theme: {
		layout: Layout.Blank
	}
})
</script>

<style scoped>
.kiosk-page {
	width: 100vw;
	height: 100vh;
	overflow: hidden;
}
</style>
