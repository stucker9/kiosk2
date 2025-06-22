import type { MenuMixedOption } from "naive-ui/es/menu/src/interface"
import { useDialog } from "naive-ui"
import { computed, h, ref } from "vue"
import { RouterLink } from "vue-router"
import { renderIcon } from "@/utils"

const BlankIcon = "carbon:document-blank"
const KioskIcon = "carbon:help-desk"
const VisitorIcon = "mdi:tablet-dashboard"
const StaffIcon = "mdi:account-cog"

// eslint-disable-next-line unused-imports/no-unused-vars
export default function getItems(args: { mode: "vertical" | "horizontal"; collapsed: boolean }): MenuMixedOption[] {
	const dialog = useDialog()

	// Function to handle Visitor Kiosk click
	const handleVisitorKioskClick = () => {
		const buttonDisabled = ref(true) // Create reactive ref
		const buttonText = ref("Acknowledged (5)") // Add reactive text

		const d = dialog.create({
			title: "Kiosk Setup Instructions",
			content: () =>
				h("div", { class: "kiosk-instructions" }, [
					h("p", null, "To move the kiosk to a second monitor, follow these steps:"),
					h("ol", null, [
						h("li", null, "Press the Windows key on your keyboard"),
						h("li", null, "Press either the Left or Right arrow key to move the window to the desired monitor"),
						h("li", null, "Once positioned, click the button below to launch the kiosk")
					]),
					h("p", null, "Note: The kiosk will open in a new browser window for best experience.")
				]),
			positiveText: computed(() => buttonText.value),
			positiveButtonProps: computed(() => ({ disabled: buttonDisabled.value })),
			onPositiveClick: () => {
				window.open("/kiosk/visitor", "_blank", "noopener,noreferrer")
				return true
			},
			closable: true, // Change from false to true
			closeOnEsc: true, // Change from false to true
			maskClosable: true // Change from false to true
		})

		// Countdown from 5 to 0
		let countdown = 4
		const interval = setInterval(() => {
			if (countdown > 0) {
				buttonText.value = `Acknowledged (${countdown})`
				countdown--
			} else {
				buttonText.value = "Acknowledged"
				buttonDisabled.value = false
				clearInterval(interval)
			}
		}, 1000)
	}

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
			label: () => "Kiosk",
			key: "kiosk-parent",
			icon: renderIcon(KioskIcon),
			children: [
				{
					label: "Visitor Kiosk",
					key: "kiosk-visitor",
					icon: renderIcon(VisitorIcon),
					onClick: handleVisitorKioskClick
				},
				{
					label: () =>
						h(
							RouterLink,
							{
								to: {
									name: "kiosk-dashboard"
								}
							},
							{ default: () => "Staff Dashboard" }
						),
					key: "kiosk-dashboard", // Changed to match route name
					icon: renderIcon(StaffIcon)
				}
			]
		}
	]
}
