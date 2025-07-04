<template>
	<header class="toolbar" :class="{ boxed }">
		<div class="wrap flex items-center gap-3">
			<div class="flex items-center gap-3">
				<div class="logo-box flex cursor-pointer items-center gap-2" @click="openNav()">
					<Logo mini />
					<Icon :size="20" name="carbon:chevron-right" />
				</div>

				<ClientOnly>
					<Breadcrumb class="min-h-12" />
				</ClientOnly>
			</div>

			<div class="flex grow items-center justify-end gap-3">
				<ClientOnly>
					<PinnedPages class="grow" />
				</ClientOnly>

				<PillWrapper>
					<Search />
					<FullscreenSwitch />
					<ThemeSwitch />
					<Notifications />
					<Avatar />
				</PillWrapper>
			</div>
		</div>

		<BlurEffect />
		<div v-if="gradient" :class="`gradient-${gradient}`"></div>
	</header>
</template>

<script lang="ts" setup>
import Icon from "@/components/common/Icon.vue"
import { useLoadingBarSetup } from "@/composables/useLoadingBarSetup"
import { useThemeStore } from "@/stores/theme"
import Logo from "../Logo.vue"
import Avatar from "./Avatar.vue"
import BlurEffect from "./BlurEffect.vue"
import Breadcrumb from "./Breadcrumb.vue"
import FullscreenSwitch from "./FullscreenSwitch.vue"
import Notifications from "./Notifications.vue"
import PillWrapper from "./PillWrapper.vue"
import PinnedPages from "./PinnedPagesV2.vue"
import Search from "./Search.vue"
import ThemeSwitch from "./ThemeSwitch.vue"

const { boxed, gradient } = defineProps<{
	boxed: boolean
	gradient?: "body" | "sidebar"
}>()

const themeStore = useThemeStore()
const openNav = () => themeStore.openSidebar()

useLoadingBarSetup()
</script>

<style lang="scss" scoped>
.toolbar {
	position: sticky;
	top: 0;
	left: 0;
	height: var(--toolbar-height);
	width: 100%;
	max-width: 100%;
	padding: 0 var(--view-padding);
	z-index: 3;
	overflow: hidden;

	.wrap {
		height: var(--toolbar-height);
		overflow: hidden;
		width: 100%;
		max-width: 100%;
		position: relative;
		z-index: 1;

		@media (max-width: 850px) {
			.pinned-pages {
				display: none;
			}
		}

		@media (max-width: 700px) {
			justify-content: space-between;
			.breadcrumb {
				display: none;
			}
		}
	}

	&.boxed {
		padding: 0;
		.wrap {
			padding: 0 var(--view-padding);
			max-width: var(--boxed-width);
			margin: 0 auto;
		}
	}

	.gradient-sidebar {
		position: absolute;
		inset: 0;
		background-color: var(--bg-sidebar-color);
		background: linear-gradient(
			to bottom,
			rgba(var(--bg-sidebar-color-rgb) / 1) 0%,
			rgba(var(--bg-sidebar-color-rgb) / 0.945) 8.6%,
			rgba(var(--bg-sidebar-color-rgb) / 0.888) 16.2%,
			rgba(var(--bg-sidebar-color-rgb) / 0.83) 22.9%,
			rgba(var(--bg-sidebar-color-rgb) / 0.769) 28.9%,
			rgba(var(--bg-sidebar-color-rgb) / 0.707) 34.4%,
			rgba(var(--bg-sidebar-color-rgb) / 0.644) 39.5%,
			rgba(var(--bg-sidebar-color-rgb) / 0.578) 44.5%,
			rgba(var(--bg-sidebar-color-rgb) / 0.511) 49.5%,
			rgba(var(--bg-sidebar-color-rgb) / 0.443) 54.7%,
			rgba(var(--bg-sidebar-color-rgb) / 0.373) 60.3%,
			rgba(var(--bg-sidebar-color-rgb) / 0.301) 66.4%,
			rgba(var(--bg-sidebar-color-rgb) / 0.228) 73.3%,
			rgba(var(--bg-sidebar-color-rgb) / 0.153) 81%,
			rgba(var(--bg-sidebar-color-rgb) / 0.077) 89.9%,
			rgba(var(--bg-sidebar-color-rgb) / 0) 100%
		);
	}
	.gradient-body {
		position: absolute;
		inset: 0;
		background-color: var(--bg-body-color);
		background: linear-gradient(
			to bottom,
			rgba(var(--bg-body-color-rgb) / 1) 0%,
			rgba(var(--bg-body-color-rgb) / 0.738) 19%,
			rgba(var(--bg-body-color-rgb) / 0.541) 34%,
			rgba(var(--bg-body-color-rgb) / 0.382) 47%,
			rgba(var(--bg-body-color-rgb) / 0.278) 56.5%,
			rgba(var(--bg-body-color-rgb) / 0.194) 65%,
			rgba(var(--bg-body-color-rgb) / 0.126) 73%,
			rgba(var(--bg-body-color-rgb) / 0.075) 80.2%,
			rgba(var(--bg-body-color-rgb) / 0.042) 86.1%,
			rgba(var(--bg-body-color-rgb) / 0.021) 91%,
			rgba(var(--bg-body-color-rgb) / 0.008) 95.2%,
			rgba(var(--bg-body-color-rgb) / 0.002) 98.2%,
			rgba(var(--bg-body-color-rgb) / 0) 100%
		);
	}
}
</style>
