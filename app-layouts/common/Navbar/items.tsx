import type { MenuMixedOption } from "naive-ui/es/menu/src/interface"
import { h } from "vue"
import { RouterLink } from "vue-router"
import { renderIcon } from "@/utils"

const BlankIcon = "carbon:document-blank"
const KioskIcon = "carbon:help-desk"

// eslint-disable-next-line unused-imports/no-unused-vars
export default function getItems(args: { mode: "vertical" | "horizontal"; collapsed: boolean }): MenuMixedOption[] {
	return [
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "index"
						}
					},
					{ default: () => "Home" }
				),
			key: "index",
			icon: renderIcon(BlankIcon)
		},
		{
			label: () =>
				h(
					RouterLink,
					{
						to: {
							name: "Kiosk"
						}
					},
					{ default: () => "Kiosk" }
				),
			key: "Kiosk",
			icon: renderIcon(KioskIcon)
		}
	]
}
