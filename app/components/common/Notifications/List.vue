<template>
	<n-scrollbar class="notifications-list">
		<div
			v-for="item of listSanitized"
			:key="item.id"
			class="item flex"
			:class="[{ pointer: !!item.action }, item.type]"
			@click.stop="item.action ? preformAction(item.id, item.action) : () => {}"
		>
			<div class="icon-box">
				<Icon v-if="item.category === 'message'" :name="MessageIcon" :size="21" />
				<Icon v-else-if="item.category === 'reminder'" :name="CalendarIcon" :size="21" />
				<Icon v-else-if="item.category === 'news'" :name="NewsIcon" :size="21" />
				<Icon v-else-if="item.category === 'alert'" :name="AlertIcon" :size="21" />
				<n-tooltip v-if="!item.read" trigger="hover" class="p-0!" content-class="p-0!" placement="right">
					<template #trigger>
						<div class="read-badge" @click.stop="setRead(item.id)" />
					</template>
					<div class="px-2 py-1 text-sm">Set as read</div>
				</n-tooltip>
			</div>
			<div class="content grow">
				<div class="title">{{ item.title }}</div>
				<div class="description">{{ item.description }}</div>
				<div class="footer flex items-center justify-between">
					<div class="date">{{ item.date }}</div>
					<div v-if="!!item.action" class="action-text">{{ item.actionTitle || "Details" }}</div>
				</div>
			</div>
			<n-tooltip trigger="hover" class="p-0!" content-class="p-0!" placement="left">
				<template #trigger>
					<div class="delete-btn" @click.stop="deleteOne(item.id)">
						<Icon :name="DeleteIcon" :size="14" />
					</div>
				</template>
				<div class="px-2 py-1 text-sm">Delete</div>
			</n-tooltip>
		</div>
		<slot name="last" />
		<n-empty v-if="!list.length" description="There is no notification" class="h-48 justify-center" />
	</n-scrollbar>
</template>

<script lang="ts" setup>
import _take from "lodash/take"
import { NEmpty, NScrollbar, NTooltip } from "naive-ui"
import { computed } from "vue"
import Icon from "@/components/common/Icon.vue"
import { useNotifications } from "@/composables/useNotifications"

const props = defineProps<{
	maxItems?: number
}>()
const DeleteIcon = "carbon:trash-can"
const MessageIcon = "carbon:email"
const CalendarIcon = "carbon:calendar"
const NewsIcon = "fluent:news-24-regular"
const AlertIcon = "mdi:alert-outline"

const list = useNotifications().list

const listSanitized = computed(() => {
	if (props.maxItems) {
		return _take(list.value, props.maxItems)
	}
	return list.value
})

function preformAction(id: string | number, action: () => void) {
	action()
	setRead(id)
}

function setRead(id: string | number) {
	useNotifications().setRead(id)
}

function deleteOne(id: string | number) {
	useNotifications().deleteOne(id)
}
</script>

<style lang="scss" scoped>
.notifications-list {
	.item {
		position: relative;
		padding: 14px 12px;
		gap: 4px;
		transition: background-color 0.2s linear;

		.icon-box {
			width: 45px;
			min-width: 45px;
			display: flex;
			justify-content: center;
			position: relative;

			.n-icon {
				display: flex;
				justify-content: center;
				align-items: center;
				border-radius: 50%;
				width: 42px;
				height: 42px;
				margin-top: 2px;
			}

			.read-badge {
				position: absolute;
				top: 5px;
				left: 0px;
				width: 10px;
				height: 10px;
				border-radius: 50%;
				background-color: var(--primary-color);
				cursor: pointer;
			}
		}

		.content {
			padding: 0 8px;
			font-size: 14px;

			.title {
				font-weight: bold;
			}

			.footer {
				margin-top: 6px;

				.date {
					font-size: 12px;
					opacity: 0.5;
				}
				.action-text {
					font-size: 12px;
				}
			}
		}

		.delete-btn {
			position: absolute;
			top: 8px;
			right: 8px;
			cursor: pointer;
			opacity: 0;

			&:hover {
				color: var(--error-color);
			}
		}

		&.success {
			.icon-box {
				.n-icon {
					background-color: rgba(var(--success-color-rgb) / 0.1);
					color: var(--success-color);
				}
			}
			.action-text {
				color: var(--success-color);
			}
		}
		&.info {
			.icon-box {
				.n-icon {
					background-color: rgba(var(--info-color-rgb) / 0.1);
					color: var(--info-color);
				}
			}
			.action-text {
				color: var(--info-color);
			}
		}
		&.warning {
			.icon-box {
				.n-icon {
					background-color: rgba(var(--warning-color-rgb) / 0.1);
					color: var(--warning-color);
				}
			}
			.action-text {
				color: var(--warning-color);
			}
		}
		&.error {
			.icon-box {
				.n-icon {
					background-color: rgba(var(--error-color-rgb) / 0.1);
					color: var(--error-color);
				}
			}
			.action-text {
				color: var(--error-color);
			}
		}

		&.pointer {
			cursor: pointer;
		}

		&:not(:last-child) {
			border-bottom: 1px solid var(--border-color);
		}

		&:hover {
			background-color: var(--hover-color);

			.delete-btn {
				opacity: 0.5;

				&:hover {
					opacity: 1;
				}
			}
		}
	}
}
</style>
