import type { GlobalThemeOverrides, ThemeCommonVars } from "naive-ui"
import type { BuiltInGlobalTheme } from "naive-ui/es/themes/interface"
import type { Layout, RouterTransition } from "@/types/theme.d"
import { useWindowSize } from "@vueuse/core"
import _get from "lodash/get"
import _set from "lodash/set"
import { darkTheme, lightTheme } from "naive-ui"
import { acceptHMRUpdate, defineStore } from "pinia"
import { watch } from "vue"
import { getCssVars, getDefaultState, getThemeOverrides } from "@/theme"
import { ThemeNameEnum } from "@/types/theme.d"

export const useThemeStore = defineStore("theme", {
	state: () => getDefaultState(),
	actions: {
		setLayout(layout: Layout): void {
			this.layout = layout
		},
		setBoxed(boxed: boolean): void {
			this.boxed.enabled = boxed
			this.setCssGlobalVars()
		},
		setFooterShow(show: boolean): void {
			this.footer.show = show
		},
		setToolbarBoxed(boxed: boolean): void {
			this.boxed.toolbar = boxed
			this.setCssGlobalVars()
		},
		setRouterTransition(routerTransition: RouterTransition): void {
			this.routerTransition = routerTransition
		},
		setTheme(themeName: ThemeNameEnum): void {
			this.themeName = themeName
		},
		setThemeLight(): void {
			this.themeName = ThemeNameEnum.Light
		},
		setThemeDark(): void {
			this.themeName = ThemeNameEnum.Dark
		},
		setColor(theme: ThemeNameEnum, colorName: string, color: string): void {
			;(this.colors[theme] as Record<string, string>)[colorName] = color
		},
		toggleTheme(): void {
			if (this.isThemeDark) {
				this.setThemeLight()
			} else {
				this.setThemeDark()
			}
		},
		toggleSidebar(): void {
			this.sidebar.collapsed = !this.sidebar.collapsed
		},
		refreshSidebar(): void {
			// this is useful in context like NUXT
			this.sidebar.collapsed = !this.sidebar.collapsed
			setTimeout(() => {
				this.sidebar.collapsed = !this.sidebar.collapsed
			}, 10)
		},
		openSidebar(): void {
			this.sidebar.collapsed = false
		},
		closeSidebar(): void {
			this.sidebar.collapsed = true
		},
		updateResponsiveVars() {
			for (const key in this.responsive.override) {
				if (_get(this, key) && key in this.responsive.override) {
					_set(
						this,
						key,
						window.innerWidth <= this.responsive.breakpoint
							? this.responsive.override[key as keyof typeof this.responsive.override].mobile
							: this.responsive.override[key as keyof typeof this.responsive.override].desk
					)
				}
			}
		},
		ensureSidebarState() {
			// auto close sidebar on resize
			if (this.sidebar.autoClose) {
				if (!this.sidebar.collapsed && window.innerWidth <= this.sidebar.autoCloseBreakpoint) {
					this.sidebar.collapsed = true
				}
			}
		},
		setDocumentThemeName(val: ThemeNameEnum, old?: ThemeNameEnum) {
			if (document) {
				const html = document.children[0] as HTMLElement
				if (old) {
					html.classList.remove(`theme-${old}`)
				}
				html.classList.add(`theme-${val}`)
			}
		},
		// This function allows you to utilize the values in the style object as variables within your CSS/SCSS code like: var(--bg-default-color)
		setCssGlobalVars() {
			if (document) {
				const html = document.children[0] as HTMLElement
				const body = document.getElementsByTagName("body")?.[0]
				body.classList.remove("direction-rtl")
				body.classList.add("direction-ltr")
				const { style: htmlStyle } = html
				console.warn("ThemeStore: Setting CSS variables:", {
					"font-family": this.style["font-family"],
					"font-family-display": this.style["font-family-display"],
					"font-family-mono": this.style["font-family-mono"],
					"boxed-width": this.style["boxed-width"]
				})
				for (const key in this.style) {
					htmlStyle.setProperty(`--${key}`, this.style[key])
				}
			}
		},
		startWatchers() {
			const { width } = useWindowSize()

			watch([() => this.style], () => {
				this.setCssGlobalVars()
			})

			watch(
				() => this.boxed,
				() => {
					this.setCssGlobalVars()
				},
				{ deep: true }
			)

			watch(width, () => {
				this.updateResponsiveVars()
				this.ensureSidebarState()
			})
		},
		initTheme() {
			this.updateResponsiveVars()
			this.ensureSidebarState()
			this.setCssGlobalVars()
			this.setDocumentThemeName(this.themeName)
			this.startWatchers()
		},
		setFontFamily(fontKey: "default" | "display" | "mono"): void {
			console.warn("ThemeStore: Setting font family to:", fontKey)
			this.fontFamilyKey = fontKey
			// Update the font family values in the state
			if (fontKey === "default") {
				this.fontFamily.default =
					"'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'"
			} else if (fontKey === "display") {
				this.fontFamily.display = "'Merriweather', Georgia, 'Times New Roman', serif"
			} else if (fontKey === "mono") {
				this.fontFamily.mono = "'JetBrains Mono', SFMono-Regular, Menlo, Consolas, Courier, monospace"
			}
			// Force update CSS variables
			this.setCssGlobalVars()
		}
	},
	getters: {
		naiveTheme(state): BuiltInGlobalTheme {
			return state.themeName === ThemeNameEnum.Dark ? darkTheme : lightTheme
		},
		themeOverrides(state): GlobalThemeOverrides {
			return getThemeOverrides(state)
		},
		darkPrimaryColor(state): string {
			return state.colors.dark.primary
		},
		lightPrimaryColor(state): string {
			return state.colors.light.primary
		},
		naiveCommon(): ThemeCommonVars {
			return { ...this.naiveTheme.common, ...this.themeOverrides.common }
		},
		style(state): { [key: string]: string } {
			return getCssVars(state, this)
		},
		isThemeDark(state): boolean {
			return state.themeName === ThemeNameEnum.Dark
		},
		isThemeLight(state): boolean {
			return state.themeName === ThemeNameEnum.Light
		},
		isBoxed(state): boolean {
			return state.boxed.enabled
		},
		isFooterShown(state): boolean {
			return state.footer.show
		},
		isToolbarBoxed(state): boolean {
			return state.boxed.toolbar && state.boxed.enabled
		},
		currentFontFamilyKey(state): string {
			return state.fontFamilyKey
		}
	},
	persist: {
		// use this param to save specific state chunk on localStorage
		pick: [
			"layout",
			"themeName",
			"routerTransition",
			"boxed",
			"sidebar.collapsed",
			"colors",
			"fontFamily",
			"fontFamilyKey",
			"footer.show"
		]
	}
})

if (import.meta.hot) {
	import.meta.hot.accept(acceptHMRUpdate(useThemeStore, import.meta.hot))
}
