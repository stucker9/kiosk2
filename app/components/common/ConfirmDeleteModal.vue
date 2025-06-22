<template>
	<n-modal
		:show="show"
		preset="dialog"
		title="Confirm Deletion"
		class="confirm-delete-modal"
		style="width: 420px"
		:mask-closable="false"
		position="center"
		@close="emitCancel"
	>
		<div class="confirm-modal-content">
			<slot>
				<p>Are you sure you want to delete this item?</p>
			</slot>
			<div class="confirm-modal-actions">
				<n-button @click="emitCancel">Cancel</n-button>
				<n-button type="error" @click="emitConfirm">Delete</n-button>
			</div>
		</div>
	</n-modal>
</template>

<script setup lang="ts">
import { NButton, NModal } from "naive-ui"
import { defineEmits, defineProps } from "vue"

const props = defineProps({
	show: { type: Boolean, required: true }
})
const emit = defineEmits(["confirm", "cancel"])
function emitConfirm() {
	emit("confirm")
}
function emitCancel() {
	emit("cancel")
}
</script>

<style scoped>
.confirm-delete-modal {
	z-index: 1000;
}
.confirm-modal-content {
	padding: 16px 0;
}
.confirm-modal-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
	margin-top: 20px;
}
:deep(.n-modal-mask) {
	background-color: rgba(0, 0, 0, 0.5);
}
:deep(.n-modal) {
	box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}
</style>
