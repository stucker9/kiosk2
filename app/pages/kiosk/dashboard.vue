<template>
	<div class="kiosk-dashboard">
		<!-- Header -->
		<div class="dashboard-header">
			<h1>Staff Dashboard</h1>
			<div class="dashboard-actions">
				<n-button type="primary" @click="showAddVisitModal = true">
					<Icon :name="PlusIcon" :size="16" class="btn-icon" />
					Add Visit
				</n-button>
				<n-button @click="showRegisterVisitorModal = true">
					<Icon :name="PersonAddIcon" :size="16" class="btn-icon" />
					Register Visitor
				</n-button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="stats-cards">
			<n-card class="stat-card visitors">
				<div class="stat-content">
					<div class="stat-value">{{ visitors.length }}</div>
					<div class="stat-label">Total Visitors</div>
				</div>
				<Icon :name="VisitorsIcon" :size="32" class="stat-icon" />
			</n-card>

			<n-card class="stat-card visits">
				<div class="stat-content">
					<div class="stat-value">{{ visits.length }}</div>
					<div class="stat-label">Total Visits</div>
				</div>
				<Icon :name="VisitsIcon" :size="32" class="stat-icon" />
			</n-card>

			<n-card class="stat-card today-visits">
				<div class="stat-content">
					<div class="stat-value">{{ todayVisitsCount }}</div>
					<div class="stat-label">Today's Visits</div>
				</div>
				<Icon :name="TodayIcon" :size="32" class="stat-icon" />
			</n-card>

			<n-card class="stat-card pantry-visits">
				<div class="stat-content">
					<div class="stat-value">{{ pantryVisitsCount }}</div>
					<div class="stat-label">Pantry Visits</div>
				</div>
				<Icon :name="PantryIcon" :size="32" class="stat-icon" />
			</n-card>
		</div>

		<!-- Tabs -->
		<n-tabs v-model:value="activeTab" type="line" animated>
			<n-tab-pane name="visitors" tab="Visitor Management">
				<VisitorManagement
					:visitors="visitors"
					@view="handleVisitorSelected"
					@edit="handleEditVisitor"
					@delete="handleDeleteVisitor"
				/>
			</n-tab-pane>
			<n-tab-pane name="visits" tab="Visit History">
				<VisitHistory :visits="visits" @edit="handleEditVisit" @delete="handleDeleteVisit" />
			</n-tab-pane>
			<n-tab-pane name="admin" tab="Administrative">
				<AdminPanel @export-data="handleExportData" />
			</n-tab-pane>
		</n-tabs>

		<!-- Add Visit Modal -->
		<n-modal
			v-model:show="showAddVisitModal"
			preset="card"
			title="Add Visit"
			style="max-width: 500px; width: 95%"
			:bordered="false"
		>
			<AddVisitForm :visitors="visitors" @submit="handleAddVisit" @cancel="showAddVisitModal = false" />
		</n-modal>

		<!-- Register Visitor Modal -->
		<n-modal
			v-model:show="showRegisterVisitorModal"
			preset="card"
			title="Register New Visitor"
			style="max-width: 450px; width: 95%"
			:bordered="false"
		>
			<RegisterVisitorForm @submit="handleRegisterVisitor" @cancel="showRegisterVisitorModal = false" />
		</n-modal>

		<!-- Edit Visitor Modal -->
		<n-modal
			v-model:show="showEditVisitorModal"
			preset="card"
			title="Edit Visitor"
			style="max-width: 450px; width: 95%"
			:bordered="false"
		>
			<EditVisitorForm
				:visitor="selectedVisitor"
				@submit="handleUpdateVisitor"
				@cancel="showEditVisitorModal = false"
			/>
		</n-modal>

		<!-- Confirm Delete Visitor Modal -->
		<ConfirmDeleteModal
			:show="showDeleteVisitorModal"
			@confirm="handleDeleteVisitorConfirm"
			@cancel="cancelDeleteVisitor"
		>
			<template #default>
				<p>Are you sure you want to delete this visitor? This will also delete all associated visits.</p>
			</template>
		</ConfirmDeleteModal>

		<!-- Confirm Delete Visit Modal -->
		<ConfirmDeleteModal :show="showDeleteVisitModal" @confirm="confirmDeleteVisit" @cancel="cancelDeleteVisit">
			<template #default>
				<p>Are you sure you want to delete this visit?</p>
			</template>
		</ConfirmDeleteModal>
	</div>
</template>

<script setup lang="ts">
import { NButton, NCard, NModal, NTabPane, NTabs } from "naive-ui"
import { computed, onMounted, ref } from "vue"
import ConfirmDeleteModal from "@/components/common/ConfirmDeleteModal.vue"
import Icon from "@/components/common/Icon.vue"
import AddVisitForm from "@/components/staff/AddVisitForm.vue"
import AdminPanel from "@/components/staff/AdminPanel.vue"
import EditVisitorForm from "@/components/staff/EditVisitorForm.vue"
import RegisterVisitorForm from "@/components/staff/RegisterVisitorForm.vue"
import VisitHistory from "@/components/staff/VisitHistory.vue"
import VisitorManagement from "@/components/staff/VisitorManagement.vue"

definePageMeta({
	// Remove the middleware reference as it doesn't exist
	meta: {
		requiresAuth: true,
		requiredRoles: ["admin", "staff"]
	}
})

// State
const activeTab = ref("visitors")
const showAddVisitModal = ref(false)
const showRegisterVisitorModal = ref(false)
const showEditVisitorModal = ref(false)
const selectedVisitor = ref(null)

// Custom delete modal state
const showDeleteVisitorModal = ref(false)
const pendingVisitorId = ref<number | null>(null)
const showDeleteVisitModal = ref(false)
const pendingVisitId = ref<number | null>(null)

// Mock data - replace with actual API calls
interface Visitor {
	id: number
	name: string
	phone: string
	lastVisit: string
	totalVisits: number
}

interface Visit {
	id: number
	visitorId: number
	visitorName: string
	phone: string
	checkInTime: string
	services: string[]
	notes: string
}

const visitors = ref<Visitor[]>([
	{ id: 1, name: "John Doe", phone: "555-1234", lastVisit: "2024-01-15", totalVisits: 5 },
	{ id: 2, name: "Jane Smith", phone: "555-5678", lastVisit: "2024-01-14", totalVisits: 3 },
	{ id: 3, name: "Bob Johnson", phone: "555-9012", lastVisit: "2024-01-13", totalVisits: 8 }
])

const visits = ref<Visit[]>([
	{
		id: 1,
		visitorId: 1,
		visitorName: "John Doe",
		phone: "555-1234",
		checkInTime: "2024-01-15 09:30",
		services: ["pantry", "clothing"],
		notes: "Requested winter clothes"
	},
	{
		id: 2,
		visitorId: 2,
		visitorName: "Jane Smith",
		phone: "555-5678",
		checkInTime: "2024-01-14 14:15",
		services: ["housing"],
		notes: "Looking for temporary housing assistance"
	},
	{
		id: 3,
		visitorId: 3,
		visitorName: "Bob Johnson",
		phone: "555-9012",
		checkInTime: "2024-01-13 11:45",
		services: ["pantry"],
		notes: ""
	}
])

// Computed values for stats
const today = computed(() => {
	const date = new Date()
	return date.toISOString().split("T")[0]
})

function formatDate(dateString: string | undefined): string {
	if (!dateString) return "N/A"
	return new Date(dateString).toLocaleString()
}

const todayVisitsCount = computed(() => {
	return visits.value.filter(v => {
		if (!v.checkInTime) return false
		return formatDate(v.checkInTime).startsWith(today.value)
	}).length
})

const pantryVisitsCount = computed(() => {
	return visits.value.filter(v => v.services.includes("pantry")).length
})

// Icons
const PlusIcon = "carbon:add"
const PersonAddIcon = "carbon:user-avatar-filled-add"
const VisitorsIcon = "mdi:account-group"
const VisitsIcon = "mdi:clipboard-text-clock"
const TodayIcon = "mdi:calendar-today"
const PantryIcon = "mdi:food-apple"

// Event handlers
function handleVisitorSelected(visitor: any) {
	selectedVisitor.value = visitor
	// Implement view visitor details functionality
}

function handleEditVisitor(visitor: any) {
	selectedVisitor.value = visitor
	showEditVisitorModal.value = true
}

function handleDeleteVisitor(visitorId: number) {
	pendingVisitorId.value = visitorId
	showDeleteVisitorModal.value = true
}

async function handleDeleteVisitorConfirm() {
	if (pendingVisitorId.value !== null) {
		visitors.value = visitors.value.filter(visitor => visitor.id !== pendingVisitorId.value)
		visits.value = visits.value.filter(visit => visit.visitorId !== pendingVisitorId.value)
		pendingVisitorId.value = null
	}
	showDeleteVisitorModal.value = false
}

function cancelDeleteVisitor() {
	pendingVisitorId.value = null
	showDeleteVisitorModal.value = false
}

function handleEditVisit(_visit: Visit) {
	// Implement edit visit functionality
	// We'll implement this later
}

function handleDeleteVisit(visitId: number) {
	pendingVisitId.value = visitId
	showDeleteVisitModal.value = true
}

async function confirmDeleteVisit() {
	if (pendingVisitId.value !== null) {
		visits.value = visits.value.filter(v => v.id !== pendingVisitId.value)
		pendingVisitId.value = null
	}
	showDeleteVisitModal.value = false
}

function cancelDeleteVisit() {
	pendingVisitId.value = null
	showDeleteVisitModal.value = false
}

function handleAddVisit(visitData: any) {
	const visitor = visitors.value.find(v => v.id === visitData.visitorId)
	const newVisit: Visit = {
		id: Date.now(),
		visitorId: visitData.visitorId,
		visitorName: visitor ? visitor.name : "",
		phone: visitor ? visitor.phone : "",
		checkInTime: new Date().toISOString().replace("T", " ").substring(0, 16),
		services: visitData.services,
		notes: visitData.notes || ""
	}
	visits.value.unshift(newVisit)
	showAddVisitModal.value = false
}

function handleRegisterVisitor(visitorData: any) {
	const newVisitor: Visitor = {
		id: Date.now(),
		name: visitorData.name,
		phone: visitorData.phone,
		lastVisit: new Date().toISOString().split("T")[0],
		totalVisits: 0
	}
	visitors.value.unshift(newVisitor)
	showRegisterVisitorModal.value = false
}

function handleUpdateVisitor(visitorData: any) {
	const index = visitors.value.findIndex(v => v.id === visitorData.id)
	if (index !== -1) {
		visitors.value[index] = { ...visitors.value[index], ...visitorData }
	}
	showEditVisitorModal.value = false
}

function handleExportData(_exportType: string) {
	// Implement data export functionality
	// This will be implemented later when we connect to real API
}

function loadDashboardData() {
	// Replace with actual API calls to load data
	// This will be implemented when connecting to real API
}

onMounted(() => {
	// Load initial data
	loadDashboardData()
})
</script>

<style scoped>
.kiosk-dashboard {
	width: 100%;
	max-width: 1200px;
	margin: 0 auto;
	padding: 24px;
}

.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 24px;
	flex-wrap: wrap;
	gap: 16px;
}

.dashboard-header h1 {
	font-size: 28px;
	font-weight: 600;
	margin: 0;
	color: #000000;
}

.dashboard-actions {
	display: flex;
	gap: 12px;
}

.btn-icon {
	margin-right: 8px;
}

.stats-cards {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 24px;
}

.stat-card {
	border-radius: 8px;
	display: flex;
	justify-content: space-between;
	align-items: center;
	padding: 8px 20px !important;
}

.stat-content {
	display: flex;
	flex-direction: column;
}

.stat-value {
	font-size: 36px;
	font-weight: 700;
	line-height: 1;
	color: #ffffff;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.stat-label {
	font-size: 16px;
	margin-top: 6px;
	color: #ffffff;
	font-weight: 500;
	text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
}

.stat-icon {
	opacity: 0.9;
	color: #ffffff;
	filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.3));
}

.visitors {
	background: #4338ca;
	border: none;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.visits {
	background: #1e40af;
	border: none;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.today-visits {
	background: #047857;
	border: none;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.pantry-visits {
	background: #b45309;
	border: none;
	box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

/* Improved color contrast for tabs */
:deep(.n-tabs .n-tab-pane) {
	margin-top: 20px;
}

:deep(.n-tabs .n-tab) {
	font-size: 16px;
	padding: 12px 20px;
	color: rgba(0, 0, 0, 0.75);
}

:deep(.n-tabs .n-tab.n-tab--active) {
	color: var(--primary-color, #1d4ed8);
	font-weight: 600;
}

:deep(.n-data-table .n-data-table-th) {
	font-weight: 600;
	background-color: rgba(0, 0, 0, 0.05);
	color: rgba(0, 0, 0, 0.85);
}

:deep(.n-data-table-td) {
	color: rgba(0, 0, 0, 0.85);
}

:deep(.n-modal) {
	max-width: 90vw;
}

:deep(.n-card__content) {
	padding: 12px !important;
}

.action-buttons {
	display: flex;
	gap: 8px;
	justify-content: flex-end;
}

@media (max-width: 768px) {
	.dashboard-header {
		flex-direction: column;
		align-items: flex-start;
	}

	.stats-cards {
		grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
		gap: 16px;
	}
}
</style>
