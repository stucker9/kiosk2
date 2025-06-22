<template>
	<div class="visit-history">
		<!-- Search and Filters -->
		<div class="search-section">
			<div class="search-bar">
				<n-input
					v-model:value="searchQuery"
					placeholder="Search visits by name, phone, or services..."
					clearable
					class="search-input"
				>
					<template #prefix>
						<Icon :name="SearchIcon" :size="16" />
					</template>
				</n-input>
			</div>
			<div class="filters">
				<n-select
					v-model:value="serviceFilter"
					:options="serviceOptions"
					placeholder="Filter by service"
					clearable
					class="filter-select"
				/>
				<n-date-picker
					v-model:value="dateRange"
					type="daterange"
					placeholder="Date range"
					class="date-filter"
				/>
				<n-button text @click="resetFilters">
					<Icon :name="ResetIcon" :size="16" />
					Reset
				</n-button>
			</div>
		</div>

		<!-- Visits Table -->
		<div class="visits-table">
			<n-data-table
				:columns="columns"
				:data="filteredVisits"
				:pagination="pagination"
				:bordered="false"
				:striped="true"
				:row-key="rowKey"
				:max-height="600"
				:scroll-x="1200"
			/>
		</div>
	</div>
</template>

<script setup lang="ts">
import { NButton, NDataTable, NDatePicker, NInput, NSelect, NTag } from 'naive-ui'
import { computed, h, ref } from 'vue'
import Icon from '@/components/common/Icon.vue'

// Props
const props = defineProps<{
	visits: any[]
}>()

// Emits
const emit = defineEmits<{
	'edit-visit': [visit: any]
	'delete-visit': [visitId: number]
}>()

// State
const searchQuery = ref('')
const serviceFilter = ref(null)
const dateRange = ref(null)

// Icons
const SearchIcon = 'mdi:magnify'
const ResetIcon = 'mdi:refresh'
const EditIcon = 'mdi:pencil'
const DeleteIcon = 'mdi:delete'

// Service options
const serviceOptions = [
	{ label: 'Food Pantry', value: 'pantry' },
	{ label: 'Clothing', value: 'clothing' },
	{ label: 'Housing', value: 'housing' },
	{ label: 'Employment', value: 'employment' },
	{ label: 'Healthcare', value: 'healthcare' },
	{ label: 'Transportation', value: 'transportation' }
]

// Pagination
const pagination = {
	pageSize: 15,
	showSizePicker: true,
	pageSizes: [15, 30, 50, 100]
}

// Table columns
const columns = [
	{
		title: 'Visitor',
		key: 'visitorName',
		sorter: (rowA: any, rowB: any) => rowA.visitorName.localeCompare(rowB.visitorName),
		filter: true
	},
	{
		title: 'Phone',
		key: 'phone',
		sorter: (rowA: any, rowB: any) => rowA.phone.localeCompare(rowB.phone),
		filter: true
	},
	{
		title: 'Check-in Time',
		key: 'checkInTime',
		sorter: (rowA: any, rowB: any) => new Date(rowA.checkInTime).getTime() - new Date(rowB.checkInTime).getTime(),
		render: (row: any) => formatDateTime(row.checkInTime)
	},
	{
		title: 'Services',
		key: 'services',
		render: (row: any) => {
			return h('div', { class: 'services-tags' }, row.services.map((service: string) =>
					h(NTag, {
						type: getServiceType(service),
						size: 'small',
						style: { marginRight: '4px', marginBottom: '4px' }
					}, { default: () => getServiceTitle(service) })
				))
		}
	},
	{
		title: 'Notes',
		key: 'notes',
		render: (row: any) => row.notes || '-'
	},
	{
		title: 'Actions',
		key: 'actions',
		render: (row: any) => {
			return h('div', { class: 'action-buttons' }, [
				h(NButton, {
					size: 'small',
					text: true,
					onClick: () => handleEditVisit(row)
				}, { default: () => h(Icon, { name: EditIcon, size: 16 }) }),
				h(NButton, {
					size: 'small',
					text: true,
					type: 'error',
					onClick: () => handleDeleteVisit(row.id)
				}, { default: () => h(Icon, { name: DeleteIcon, size: 16 }) })
			])
		}
	}
]

// Computed
const filteredVisits = computed(() => {
	let filtered = [...props.visits]

	// Search filter
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		filtered = filtered.filter(visit =>
			visit.visitorName.toLowerCase().includes(query) ||
			visit.phone.toLowerCase().includes(query) ||
			visit.services.some((service: string) =>
				getServiceTitle(service).toLowerCase().includes(query)
			) ||
			(visit.notes && visit.notes.toLowerCase().includes(query))
		)
	}

	// Service filter
	if (serviceFilter.value) {
		filtered = filtered.filter(visit =>
			visit.services.includes(serviceFilter.value)
		)
	}

	// Date range filter
	if (dateRange.value && dateRange.value.length === 2) {
		const [startDate, endDate] = dateRange.value
		filtered = filtered.filter(visit => {
			const visitDate = new Date(visit.checkInTime)
			return visitDate >= startDate && visitDate <= endDate
		})
	}

	// Sort by check-in time (newest first)
	filtered.sort((a, b) => new Date(b.checkInTime).getTime() - new Date(a.checkInTime).getTime())

	return filtered
})

// Methods
const rowKey = (row: any) => row.id

function resetFilters() {
	searchQuery.value = ''
	serviceFilter.value = null
	dateRange.value = null
}

function handleEditVisit(visit: any) {
	emit('edit-visit', visit)
}

function handleDeleteVisit(visitId: number) {
	emit('delete-visit', visitId)
}

function formatDateTime(dateTime: string) {
	return new Date(dateTime).toLocaleString()
}

function getServiceType(service: string) {
	const serviceTypes: { [key: string]: string } = {
		pantry: 'success',
		clothing: 'info',
		housing: 'warning',
		employment: 'primary',
		healthcare: 'error',
		transportation: 'default'
	}
	return serviceTypes[service] || 'default'
}

function getServiceTitle(service: string) {
	const serviceTitles: { [key: string]: string } = {
		pantry: 'Food Pantry',
		clothing: 'Clothing',
		housing: 'Housing',
		employment: 'Employment',
		healthcare: 'Healthcare',
		transportation: 'Transportation'
	}
	return serviceTitles[service] || service
}
</script>

<style scoped>
.visit-history {
	width: 100%;
}

.search-section {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 20px;
	gap: 20px;
}

.search-bar {
	flex: 1;
	max-width: 400px;
}

.search-input {
	width: 100%;
}

.filters {
	display: flex;
	align-items: center;
	gap: 12px;
}

.filter-select {
	width: 150px;
}

.date-filter {
	width: 200px;
}

.visits-table {
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.services-tags {
	display: flex;
	flex-wrap: wrap;
	gap: 4px;
}

.action-buttons {
	display: flex;
	gap: 8px;
	justify-content: center;
}

/* Responsive design */
@media (max-width: 768px) {
	.search-section {
		flex-direction: column;
		align-items: stretch;
		gap: 15px;
	}

	.search-bar {
		max-width: none;
	}

	.filters {
		flex-wrap: wrap;
		gap: 10px;
	}

	.filter-select,
	.date-filter {
		width: 100%;
	}

	.action-buttons {
		flex-direction: column;
		gap: 4px;
	}
}
</style>