import type { Layout } from "~~/types/theme.d"
import type { RouteMetaAuth } from "@/types/auth.d"
import "vue-router"

// To ensure it is treated as a module, add at least one `export` statement
export {}

declare module "vue-router" {
	interface RouteMeta extends RouteMetaAuth {
		title?: string
		theme?: {
			layout?: Layout
			boxed?: { enabled?: boolean }
			padded?: { enabled?: boolean }
		}
		skipPin?: boolean
	}
}
