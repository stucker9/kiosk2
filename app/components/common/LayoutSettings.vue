<template>
	<div class="layout-settings flex items-center justify-center shadow-xl" :class="{ open }">
		<Transition mode="out-in" name="anim">
			<div v-if="!open" key="btn" class="open-btn flex items-center justify-center" @click="open = true">
				<Icon :size="34" :name="SettingsIcon" />
			</div>

			<div v-else key="form" class="ls-form flex flex-col">
				<div class="ls-header flex items-center justify-between">
					<div class="ls-title">Layout settings</div>
					<div class="ls-icon flex items-center">
						<Icon :size="20" :name="CloseIcon" @click="open = false" />
					</div>
				</div>
				<n-scrollbar class="ls-main">
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

					<div class="ls-section ls-font-family-selection">
						<div class="ls-label">Font Family</div>
						<div class="ls-input flex justify-between">
							<n-select v-model:value="fontFamilyKey" :options="fontFamilyOptions" @update:value="onFontFamilyChange" />
						</div>
					</div>

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

					<div class="ls-section ls-transition-selection">
						<div class="ls-label">Router transition</div>
						<div class="ls-input flex justify-between">
							<n-select v-model:value="routerTransition" :options="transitionOptions" />
						</div>
					</div>
					<div class="ls-section ls-reset-selection items-center">
						<n-button class="mb-3! w-full!" strong secondary type="primary" @click="reset()">Restore default</n-button>
					</div>
				</n-scrollbar>
			</div>
		</Transition>
	</div>
</template>

<script setup lang="ts">
import { useWindowSize } from "@vueuse/core"
import { NButton, NColorPicker, NScrollbar, NSelect, NSwitch, useOsTheme } from "naive-ui"
import { computed, ref } from "vue"
import Icon from "@/components/common/Icon.vue"
import { useThemeStore } from "@/stores/theme"
import { Layout, RouterTransition, ThemeNameEnum } from "~~/types/theme.d"

interface ColorPalette {
	light: string
	dark: string
}

type Palette = ColorPalette[]

const SettingsIcon = "carbon:settings-adjust"
const CloseIcon = "carbon:close"
const LightIcon = "ion:sunny"
const DarkIcon = "ion:moon"
const LightOutlineIcon = "ion:sunny-outline"
const DarkOutlineIcon = "ion:moon-outline"
const ColorIcon = "carbon:circle-solid"

const themeStore = useThemeStore()
const { width: winWidth } = useWindowSize()
const isMobileView = computed<boolean>(() => winWidth.value < 700)
const open = ref(false)
const transitionOptions = [
	{
		label: "Fade",
		value: "fade"
	},
	{
		label: "FadeUp",
		value: "fade-up"
	},
	{
		label: "FadeBottom",
		value: "fade-bottom"
	},
	{
		label: "FadeLeft",
		value: "fade-left"
	},
	{
		label: "FadeRight",
		value: "fade-right"
	}
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

const palette = ref<Palette>([
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
	console.log("LayoutSettings: Font family change requested:", value)
	if (value === "default" || value === "display" || value === "mono") {
		console.log("LayoutSettings: Setting font family to:", value)
		themeStore.setFontFamily(value as "default" | "display" | "mono")
		// Force update CSS variables
		themeStore.setCssGlobalVars()
		console.log("LayoutSettings: Current font family after change:", themeStore.currentFontFamilyKey)
		console.log("LayoutSettings: Current font family value:", themeStore.fontFamily.default)
	}
}

function setPrimary(color: ColorPalette) {
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
</script>

<style scoped lang="scss">
.layout-settings {
	position: fixed;
	right: 10px;
	top: 50%;
	width: 50px;
	height: 50px;
	border-radius: 50px;
	background-color: var(--primary-color);
	color: var(--bg-default-color);
	transform: translateY(-50%);
	transition: all 0.3s;
	overflow: hidden;
	border: 1px solid transparent;

	.open-btn {
		cursor: pointer;
		width: 100%;
		height: 100%;
		position: absolute;
		will-change: opacity;
	}
	.ls-form {
		position: absolute;
		height: 100%;
		width: 100%;
		will-change: opacity;

		.ls-header {
			border-bottom: 1px solid var(--border-color);
			font-size: 14px;
			text-transform: uppercase;
			font-weight: 700;
			padding: 10px 14px;
			line-height: 1;
			transition: all 0.3s;

			.ls-icon {
				cursor: pointer;
				opacity: 0.6;

				&:hover {
					opacity: 1;
					color: var(--primary-color);
				}
			}
		}

		.ls-main {
			.ls-section {
				padding: 14px;
				font-size: 12px;
				display: flex;
				flex-direction: column;

				&:not(:last-child) {
					border-bottom: 1px solid var(--border-color);
				}

				.ls-label {
					font-size: 12px;
					margin-bottom: 8px;
					font-weight: 600;
					color: var(--fg-secondary-color);
				}

				&.ls-color-selection {
					.color-picker-box {
						line-height: 0;
						.n-color-picker {
							height: 28px;
							:deep() {
								.n-color-picker-trigger {
									.n-color-picker-trigger__fill {
										left: 5px;
										right: 5px;
										top: 5px;
										bottom: 5px;
										justify-content: flex-start;
										line-height: 0;

										.n-color-picker-checkboard {
											background: transparent;
											&::after {
												background-image: none;
											}

											& ~ div {
												width: 32px;
												border-radius: var(--border-radius-small);
												height: 100%;
											}
										}
										.n-color-picker-trigger__value {
											color: var(--fg-default-color) !important;
											margin-left: 44px;
											font-size: 12px;
											font-weight: 600;
											width: initial !important;
											height: initial !important;
										}
									}
								}
							}
						}
					}
				}

				&.ls-boxed-selection {
					.switch-label {
						font-size: 12px;
						font-weight: 600;
						color: var(--fg-secondary-color);
					}
				}

				&.ls-reset-selection {
					a {
						color: var(--fg-secondary-color);
						text-decoration-color: var(--fg-secondary-color);
					}
				}
			}
		}
	}

	&.open {
		width: 230px;
		height: 680px;
		right: 16px;
		border-radius: var(--border-radius);
		max-height: 90vh;
		max-height: 90svh;
		background-color: var(--bg-default-color);
		color: var(--fg-default-color);
		border-color: var(--border-color);
	}

	.anim-enter-active,
	.anim-leave-active {
		transition:
			opacity 0.1s var(--bezier-ease),
			transform 0.2s var(--bezier-ease);
	}

	.anim-enter-from,
	.anim-leave-to {
		opacity: 0;
		// transform: translateY(1%);
	}
}
</style>
