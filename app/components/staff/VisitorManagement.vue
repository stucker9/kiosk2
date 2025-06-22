<template>
	<div class="visitor-management">
		<!-- Search and Filters -->
		<div class="search-section">
			<div class="search-bar">
				<n-input
					v-model:value="searchQuery"
					placeholder="Search by name or phone number..."
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
					v-model:value="sortBy"
					:options="sortOptions"
					placeholder="Sort by"
					class="filter-select"
				/>
				<n-button text @click="resetFilters">
					<Icon :name="ResetIcon" :size="16" />
					Reset
				</n-button>
			</div>
		</div>

		<!-- Visitors Table -->
		<div class="visitors-table">
			<n-data-table
				:columns="columns"
				:data="filteredVisitors"
				:pagination="pagination"
				:bordered="false"
				:striped="true"
				:row-key="rowKey"
				:max-height="600"
				:scroll-x="1200"
			/>
		</div>

		<!-- Visitor Details Modal -->
		<n-modal v-model:show="showVisitorDetails" preset="card" title="Visitor Details" class="visitor-details-modal" style="max-width: 500px; width: 95%;" :bordered="false">
			<div v-if="selectedVisitor" class="visitor-details">
				<div class="detail-section">
					<h3 class="detail-heading">Basic Information</h3>
					<div class="detail-stack">
						<div class="detail-item">
							<strong>Name:</strong> {{ selectedVisitor.name }}
						</div>
						<div class="detail-item">
							<strong>Phone:</strong> {{ selectedVisitor.phone }}
						</div>
						<div class="detail-item">
							<strong>Total Visits:</strong> {{ selectedVisitor.totalVisits }}
						</div>
						<div class="detail-item">
							<strong>Last Visit:</strong> {{ formatDate(selectedVisitor.lastVisit) }}
						</div>
					</div>
				</div>

				<div class="detail-section">
					<h3 class="detail-heading">Recent Visits</h3>
					<div class="visits-list">
						<div v-for="visit in selectedVisitor.visits" :key="visit.id" class="visit-item">
							<div class="visit-date">{{ formatDate(visit.checkInTime) }}</div>
							<div class="visit-services">
								<n-tag
									v-for="service in visit.services"
									:key="service"
									:type="getServiceType(service)"
									size="small"
								>
									{{ getServiceTitle(service) }}
								</n-tag>
							</div>
							<div v-if="visit.notes" class="visit-notes">
								{{ visit.notes }}
							</div>
						</div>
					</div>
				</div>
			</div>
		</n-modal>
	</div>
</template>

<script setup lang="ts">
import { NButton, NDataTable, NInput, NModal, NSelect, NTag } from 'naive-ui'
import { computed, h, ref } from 'vue'
import Icon from '@/components/common/Icon.vue'

// Props
const props = defineProps<{
	visitors: any[]
}>()

// Emits
const emit = defineEmits<{
	'visitor-selected': [visitor: any]
	'edit-visitor': [visitor: any]
	'delete-visitor': [visitorId: number]
}>()

// State
const searchQuery = ref('')
const sortBy = ref('lastVisit')
const showVisitorDetails = ref(false)
const selectedVisitor = ref(null)

// Icons
const SearchIcon = 'mdi:magnify'
const ResetIcon = 'mdi:refresh'
const EditIcon = 'mdi:pencil'
const DeleteIcon = 'mdi:delete'
const ViewIcon = 'mdi:eye'

// Sort options
const sortOptions = [
	{ label: 'Last Visit', value: 'lastVisit' },
	{ label: 'Name', value: 'name' },
	{ label: 'Total Visits', value: 'totalVisits' },
	{ label: 'Phone', value: 'phone' }
]

// Pagination
const pagination = {
	pageSize: 10,
	showSizePicker: true,
	pageSizes: [10, 20, 50]
}

// Table columns
const columns = [
	{
		title: 'Name',
		key: 'name',
		sorter: (rowA: any, rowB: any) => rowA.name.localeCompare(rowB.name),
		filter: true
	},
	{
		title: 'Phone',
		key: 'phone',
		sorter: (rowA: any, rowB: any) => rowA.phone.localeCompare(rowB.phone),
		filter: true
	},
	{
		title: 'Last Visit',
		key: 'lastVisit',
		sorter: (rowA: any, rowB: any) => new Date(rowA.lastVisit || 0).getTime() - new Date(rowB.lastVisit || 0).getTime(),
		render: (row: any) => formatDate(row.lastVisit)
	},
	{
		title: 'Total Visits',
		key: 'totalVisits',
		sorter: (rowA: any, rowB: any) => rowA.totalVisits - rowB.totalVisits
	},
	{
		title: 'Actions',
		key: 'actions',
		render: (row: any) => {
			return h('div', { class: 'action-buttons' }, [
				h(NButton, {
					size: 'small',
					text: true,
					onClick: () => handleViewVisitor(row)
				}, { default: () => h(Icon, { name: ViewIcon, size: 16 }) }),
				h(NButton, {
					size: 'small',
					text: true,
					onClick: () => handleEditVisitor(row)
				}, { default: () => h(Icon, { name: EditIcon, size: 16 }) }),
				h(NButton, {
					size: 'small',
					text: true,
					type: 'error',
					onClick: () => handleDeleteVisitor(row.id)
				}, { default: () => h(Icon, { name: DeleteIcon, size: 16 }) })
			])
		}
	}
]

// Computed
const filteredVisitors = computed(() => {
	let filtered = [...props.visitors]

	// Search filter
	if (searchQuery.value) {
		const query = searchQuery.value.toLowerCase()
		filtered = filtered.filter(visitor =>
			visitor.name.toLowerCase().includes(query) ||
			visitor.phone.toLowerCase().includes(query)
		)
	}

	// Sort
	filtered.sort((a, b) => {
		switch (sortBy.value) {
			case 'name':
				return a.name.localeCompare(b.name)
			case 'phone':
				return a.phone.localeCompare(b.phone)
			case 'totalVisits':
				return b.totalVisits - a.totalVisits
			case 'lastVisit':
			default:
				return new Date(b.lastVisit || 0).getTime() - new Date(a.lastVisit || 0).getTime()
		}
	})

	return filtered
})

// Methods
const rowKey = (row: any) => row.id

function resetFilters() {
	searchQuery.value = ''
	sortBy.value = 'lastVisit'
}

function handleViewVisitor(visitor: any) {
	selectedVisitor.value = visitor
	showVisitorDetails.value = true
	emit('visitor-selected', visitor)
}

function handleEditVisitor(visitor: any) {
	emit('edit-visitor', visitor)
}

function handleDeleteVisitor(visitorId: number) {
	emit('delete-visitor', visitorId)
}

function formatDate(date: string | null) {
	if (!date) return 'Never'
	return new Date(date).toLocaleDateString()
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
.visitor-management {
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

.visitors-table {
	background: white;
	border-radius: 8px;
	overflow: hidden;
	box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.action-buttons {
	display: flex;
	gap: 8px;
	justify-content: center;
}

.visitor-details-modal {
	max-width: 500px;
}

.visitor-details {
	text-align: left;
	color: var(--text-color, #eaeaea);
}

.detail-section {
	margin-bottom: 30px;
}

.detail-heading {
	margin: 0 0 15px 0;
	color: var(--primary-color, #36ad47);
	font-size: 18px;
	font-weight: 600;
}

.detail-stack {
	display: flex;
	flex-direction: column;
	gap: 12px;
}

.detail-item {
	padding: 12px;
	background: var(--card-color, #1f1f1f);
	color: var(--text-color, #eaeaea);
	border-radius: 6px;
	border: 1px solid var(--border-color, #333);
}

.visits-list {
	max-height: 300px;
	overflow-y: auto;
}

.visit-item {
	padding: 15px;
	border: 1px solid #e0e0e0;
	border-radius: 6px;
	margin-bottom: 10px;
}

.visit-date {
	font-weight: bold;
	margin-bottom: 8px;
	color: var(--text-color, #eaeaea);
}

.visit-services {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	margin-bottom: 8px;
}

.visit-notes {
	font-style: italic;
	color: var(--text-secondary-color, #bbbbbb);
	font-size: 14px;
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
		justify-content: space-between;
	}

	.filter-select {
		width: 120px;
	}

	.detail-stack {
		gap: 10px;
	}

	.action-buttons {
		flex-direction: column;
		gap: 4px;
	}
}
</style>