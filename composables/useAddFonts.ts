import inter400woff from "@fontsource/inter/files/inter-latin-400-normal.woff"
import inter400woff2 from "@fontsource/inter/files/inter-latin-400-normal.woff2"
import jetbrainsMono400woff from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff"
import jetbrainsMono400woff2 from "@fontsource/jetbrains-mono/files/jetbrains-mono-latin-400-normal.woff2"
import merriweather400woff from "@fontsource/merriweather/files/merriweather-latin-400-normal.woff"
import merriweather400woff2 from "@fontsource/merriweather/files/merriweather-latin-400-normal.woff2"
import "@fontsource/inter/latin.css"
import "@fontsource/merriweather/latin.css"
import "@fontsource/jetbrains-mono/latin.css"

export function useAddFonts() {
	useHead({
		link: [
			{ rel: "preload", as: "font", type: "font/woff", href: inter400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: inter400woff2, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff", href: merriweather400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: merriweather400woff2, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff", href: jetbrainsMono400woff, crossorigin: "anonymous" },
			{ rel: "preload", as: "font", type: "font/woff2", href: jetbrainsMono400woff2, crossorigin: "anonymous" }
		]
	})
}
