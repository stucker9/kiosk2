<template>
	<n-card class="settings settings-responsive" style="max-width: 100%; width: 100%; margin: 0 auto; box-sizing: border-box;">
		<n-form ref="refForm" :label-width="80" :model="formValue" :rules="formRules">
			<div class="title">General</div>
			<div class="flex flex-col justify-between md:flex-row md:gap-4">
				<n-form-item label="Username" path="username" class="basis-1/2">
					<n-input v-model:value="formValue.username" placeholder="Type username">
						<template #prefix>@</template>
					</n-input>
				</n-form-item>
				<n-form-item label="Email" path="email" class="basis-1/2">
					<n-input v-model:value="formValue.email" placeholder="Type email" />
				</n-form-item>
			</div>
			<div class="title">Profile</div>
			<n-form-item label="Fullname" path="name">
				<n-input v-model:value="formValue.name" placeholder="Type Fullname" />
			</n-form-item>
			<div class="flex flex-col justify-between md:flex-row md:gap-4">
				<n-form-item label="Location" path="location" class="basis-1/2">
					<n-input v-model:value="formValue.location" placeholder="Type location" />
				</n-form-item>
				<n-form-item label="Website" path="website" class="basis-1/2">
					<n-input v-model:value="formValue.website" placeholder="Type website" />
				</n-form-item>
			</div>
			<n-form-item label="Bio" path="bio">
				<n-input v-model:value="formValue.bio" type="textarea" placeholder="Type bio" />
			</n-form-item>
			<div class="title">Social</div>
			<div class="flex flex-col justify-between md:flex-row md:gap-4">
				<n-form-item label="Twitter" path="twitter" class="basis-1/3">
					<n-input v-model:value="formValue.twitter" placeholder="Type twitter" />
				</n-form-item>
				<n-form-item label="Facebook" path="facebook" class="basis-1/3">
					<n-input v-model:value="formValue.facebook" placeholder="Type facebook" />
				</n-form-item>
				<n-form-item label="Google" path="google" class="basis-1/3">
					<n-input v-model:value="formValue.google" placeholder="Type google" />
				</n-form-item>
			</div>
			<div class="flex flex-col justify-between md:flex-row md:gap-4">
				<n-form-item label="Instagram" path="instagram" class="basis-1/3">
					<n-input v-model:value="formValue.instagram" placeholder="Type instagram" />
				</n-form-item>
				<n-form-item label="Github" path="github" class="basis-1/3">
					<n-input v-model:value="formValue.github" placeholder="Type github" />
				</n-form-item>
				<n-form-item label="Threads" path="threads" class="basis-1/3">
					<n-input v-model:value="formValue.threads" placeholder="Type threads" />
				</n-form-item>
			</div>

			<!-- Layout Preferences Section -->
			<hr class="settings-divider" />
			<div class="title">Layout Preferences</div>
			<div class="settings-compact-card">
				<!-- Primary Color Picker -->
				<div class="ls-section ls-color-selection">
					<div class="ls-label">Primary color</div>
					<div class="color-picker-box">
						<n-color-picker
							v-if="theme === ThemeNameEnum.Dark"
							v-model:value="darkColor"
							:modes="['hex']"
							:show-alpha="false"
						/>
						<n-color-picker v-else v-model:value="lightColor" :modes="['hex']" :show-alpha="false" />
					</div>
					<div class="palette mt-3 flex justify-around">
						<n-button v-for="color of palette" :key="color.light" text @click="setPrimary(color)">
							<template #icon>
								<Icon :color="theme === ThemeNameEnum.Dark ? color.dark : color.light" :size="24" :name="ColorIcon" />
							</template>
						</n-button>
					</div>
				</div>

				<!-- Theme Selection -->
				<div class="ls-section ls-theme-selection">
					<div class="ls-label">Theme</div>
					<div class="flex items-center gap-2">
						<div class="basis-1/2">
							<n-button
								class="w-full!"
								:type="theme === ThemeNameEnum.Light ? 'primary' : 'default'"
								@click="theme = ThemeNameEnum.Light"
							>
								<template #icon>
									<Icon v-if="theme === ThemeNameEnum.Light" :name="LightIcon" />
									<Icon v-else :name="LightOutlineIcon" />
								</template>
								Light
							</n-button>
						</div>
						<div class="basis-1/2">
							<n-button
								class="w-full!"
								:type="theme === ThemeNameEnum.Dark ? 'primary' : 'default'"
								@click="theme = ThemeNameEnum.Dark"
							>
								<template #icon>
									<Icon v-if="theme === ThemeNameEnum.Dark" :name="DarkIcon" />
									<Icon v-else :name="DarkOutlineIcon" />
								</template>
								Dark
							</n-button>
						</div>
					</div>
				</div>

				<!-- Font Family Selection -->
				<div class="ls-section ls-font-family-selection">
					<div class="ls-label">Font Family</div>
					<div class="ls-input flex justify-between">
						<n-select v-model:value="fontFamilyKey" :options="fontFamilyOptions" @update:value="onFontFamilyChange" />
					</div>
				</div>

				<!-- Navbar Layout Selection -->
				<div class="ls-section ls-nav-selection">
					<div class="ls-label">
						Navbar
						<span v-if="isMobileView" class="px-1 opacity-50">desktop only</span>
					</div>
					<div class="flex items-center gap-2">
						<div class="basis-1/2">
							<n-button
								class="w-full!"
								:type="layout === Layout.VerticalNav ? 'primary' : 'default'"
								:disabled="isMobileView"
								@click="layout = Layout.VerticalNav"
							>
								Vertical
							</n-button>
						</div>
						<div class="basis-1/2">
							<n-button
								class="w-full!"
								:type="layout === Layout.HorizontalNav ? 'primary' : 'default'"
								:disabled="isMobileView"
								@click="layout = Layout.HorizontalNav"
							>
								Horizontal
							</n-button>
						</div>
					</div>
				</div>

				<!-- Boxed, Toolbar Boxed, Footer Visibility -->
				<div class="ls-section ls-boxed-selection">
					<div class="flex flex-col gap-3">
						<div class="flex items-center justify-between">
							<div class="switch-label">
								View boxed
								<span v-if="isMobileView" class="px-1 opacity-50">desktop only</span>
							</div>
							<n-switch v-model:value="boxed" :disabled="isMobileView" size="small" />
						</div>
						<div class="flex items-center justify-between">
							<div class="switch-label">
								Toolbar boxed
								<span v-if="isMobileView" class="px-1 opacity-50">desktop only</span>
							</div>
							<n-switch v-model:value="toolbarBoxed" :disabled="!boxed || isMobileView" size="small" />
						</div>
						<div class="flex items-center justify-between">
							<div class="switch-label">Footer visible</div>
							<n-switch v-model:value="footerShown" size="small" />
						</div>
					</div>
				</div>

				<!-- Router Transition -->
				<div class="ls-section ls-transition-selection">
					<div class="ls-label">Router transition</div>
					<div class="ls-input flex justify-between">
						<n-select v-model:value="routerTransition" :options="transitionOptions" />
					</div>
				</div>

				<!-- Restore Defaults -->
				<div class="ls-section ls-reset-selection items-center">
					<n-button class="mb-3! w-full!" strong secondary type="primary" @click="reset()">
						Restore default layout
					</n-button>
				</div>
				<n-form-item>
					<n-popover v-model:show="showSaved" placement="top" trigger="manual">
						<template #trigger>
							<n-button type="primary" @click="saveAll">Save</n-button>
						</template>
						<span>Settings saved!</span>
					</n-popover>
				</n-form-item>
			</div>
			<!-- end settings-compact-card -->
		</n-form>
	</n-card>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import {
	NButton,
	NCard,
	NColorPicker,
	NForm,
	NFormItem,
	NInput,
	NPopover,
	NSelect,
	NSwitch,
	useOsTheme
} from "naive-ui"
import { computed, ref } from "vue"
import { Layout, RouterTransition, ThemeNameEnum } from "~~/types/theme.d"
import Icon from "@/components/common/Icon.vue"
import { useThemeStore } from "@/stores/theme"

const formValue = ref({
	username: "sigmund67",
	email: "sigmund67@gmail.com",
	name: "Margie Dibbert",
	location: "New York No. 1 Lake Park",
	bio: "",
	website: "",
	twitter: "",
	facebook: "",
	google: "",
	instagram: "",
	threads: "",
	github: ""
})

const refForm = ref()

const formRules = {
	username: {
		required: true,
		message: "Please input username",
		trigger: "blur"
	},
	email: {
		required: true,
		message: "Please input email",
		trigger: "blur"
	}
}

// Layout Settings Logic
const themeStore = useThemeStore()
const { width: winWidth } = useWindowSize()
const isMobileView = computed<boolean>(() => winWidth.value < 700)
const transitionOptions = [
	{ label: "Fade", value: "fade" },
	{ label: "FadeUp", value: "fade-up" },
	{ label: "FadeBottom", value: "fade-bottom" },
	{ label: "FadeLeft", value: "fade-left" },
	{ label: "FadeRight", value: "fade-right" }
]
const layout = computed({
	get: () => themeStore.layout,
	set: val => themeStore.setLayout(val)
})
const routerTransition = computed({
	get: () => themeStore.routerTransition,
	set: val => themeStore.setRouterTransition(val)
})
const theme = computed({
	get: () => themeStore.themeName,
	set: val => themeStore.setTheme(val)
})
const darkColor = computed({
	get: () => themeStore.darkPrimaryColor,
	set: val => themeStore.setColor(ThemeNameEnum.Dark, "primary", val)
})
const lightColor = computed({
	get: () => themeStore.lightPrimaryColor,
	set: val => themeStore.setColor(ThemeNameEnum.Light, "primary", val)
})
const boxed = computed({
	get: () => themeStore.isBoxed,
	set: val => themeStore.setBoxed(val)
})
const toolbarBoxed = computed({
	get: () => themeStore.isToolbarBoxed,
	set: val => themeStore.setToolbarBoxed(val)
})
const footerShown = computed({
	get: () => themeStore.isFooterShown,
	set: val => themeStore.setFooterShow(val)
})
const palette = ref([
	{ light: "#00B27B", dark: "#00E19B" },
	{ light: "#6267FF", dark: "#6267FF" },
	{ light: "#FF61C9", dark: "#FF61C9" },
	{ light: "#FFB600", dark: "#FFB600" },
	{ light: "#FF0000", dark: "#FF0000" }
])
const fontFamilyOptions = [
	{ label: "Sans Serif", value: "default" },
	{ label: "Serif", value: "display" },
	{ label: "Monospace", value: "mono" }
]
const fontFamilyKey = computed({
	get: () => themeStore.currentFontFamilyKey,
	set: val => themeStore.setFontFamily(val)
})
function onFontFamilyChange(value: string) {
	if (value === "default" || value === "display" || value === "mono") {
		themeStore.setFontFamily(value as "default" | "display" | "mono")
		// Force update CSS variables
		themeStore.setCssGlobalVars()
	}
}
function setPrimary(color: { light: string; dark: string }) {
	themeStore.setColor(ThemeNameEnum.Dark, "primary", color.dark)
	themeStore.setColor(ThemeNameEnum.Light, "primary", color.light)
}
function reset() {
	themeStore.setColor(ThemeNameEnum.Dark, "primary", "#00E19B")
	themeStore.setColor(ThemeNameEnum.Light, "primary", "#00B27B")
	themeStore.setTheme(useOsTheme().value === "dark" ? ThemeNameEnum.Dark : ThemeNameEnum.Light)
	themeStore.setLayout(Layout.VerticalNav)
	themeStore.setRouterTransition(RouterTransition.FadeUp)
	themeStore.setBoxed(true)
	themeStore.setToolbarBoxed(true)
	themeStore.setFooterShow(true)
}
const showSaved = ref(false)
function saveAll() {
	// TODO: Add API call or logic to persist profile info and layout settings
	// Example: await api.saveUserSettings({ ...formValue.value, ...layoutSettings })
	// For now, just log for demonstration
	console.log("Saving profile:", formValue.value)
	console.log("Saving layout:", {
		theme: theme.value,
		darkColor: darkColor.value,
		lightColor: lightColor.value,
		layout: layout.value,
		routerTransition: routerTransition.value,
		boxed: boxed.value,
		toolbarBoxed: toolbarBoxed.value,
		footerShown: footerShown.value,
		fontFamilyKey: fontFamilyKey.value
	})
	showSaved.value = true
	setTimeout(() => {
		showSaved.value = false
	}, 2000)
}

const SettingsIcon = "carbon:settings-adjust"
const CloseIcon = "carbon:close"
const LightIcon = "ion:sunny"
const DarkIcon = "ion:moon"
const LightOutlineIcon = "ion:sunny-outline"
const DarkOutlineIcon = "ion:moon-outline"
const ColorIcon = "carbon:circle-solid"
</script>

<style lang="scss" scoped>
.settings-responsive {
	max-width: 950px;
	margin: 40px auto;
	padding: 32px 24px;
}
.settings-divider {
	margin: 32px 0 24px 0;
	border: none;
	border-top: 1.5px solid var(--border-color, #e0e0e0);
}
.settings {
	.title {
		font-size: 20px;
		margin-bottom: 20px;

		&:not(:first-child) {
			margin-top: 20px;
		}
	}
}

.settings-compact-card {
	max-width: 600px;
	margin: 0 auto 8px auto;
	background: var(--n-color, #232323);
	border-radius: 12px;
	padding: 18px 14px 10px 14px;
	box-shadow: 0 2px 8px 0 rgba(0, 0, 0, 0.03);
	// Visually compact, but not affecting outer width
}
.settings-compact-card .ls-section {
	margin-bottom: 10px;
	padding: 0;
}
.settings-compact-card .ls-label {
	margin-bottom: 2px;
	font-size: 14px;
	font-weight: 500;
}
.settings-compact-card .n-input,
.settings-compact-card .n-select {
	min-height: 28px;
	font-size: 13px;
	padding: 2px 8px;
}
.settings-compact-card .n-button {
	min-height: 28px;
	font-size: 13px;
	padding: 2px 10px;
}
.settings-compact-card .n-switch {
	--n-height: 18px;
}
.settings-compact-card .palette {
	margin-top: 6px;
}
</style>
