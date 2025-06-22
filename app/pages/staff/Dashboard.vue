<template>
	<div class="staff-dashboard">
		<!-- Header -->
		<div class="dashboard-header">
			<h1>Staff Dashboard</h1>
			<div class="header-actions">
				<n-button type="primary" @click="showAddVisitModal = true">
					<Icon :name="AddIcon" :size="16" />
					Add Visit
				</n-button>
				<n-button type="info" @click="showRegisterVisitorModal = true">
					<Icon :name="UserAddIcon" :size="16" />
					Register Visitor
				</n-button>
			</div>
		</div>

		<!-- Stats Cards -->
		<div class="stats-grid">
			<n-card class="stat-card">
				<div class="stat-content">
					<Icon :name="VisitorsIcon" :size="32" class="stat-icon" />
					<div class="stat-info">
						<h3>{{ totalVisitors }}</h3>
						<p>Total Visitors</p>
					</div>
				</div>
			</n-card>
			<n-card class="stat-card">
				<div class="stat-content">
					<Icon :name="VisitsIcon" :size="32" class="stat-icon" />
					<div class="stat-info">
						<h3>{{ totalVisits }}</h3>
						<p>Total Visits</p>
					</div>
				</div>
			</n-card>
			<n-card class="stat-card">
				<div class="stat-content">
					<Icon :name="TodayIcon" :size="32" class="stat-icon" />
					<div class="stat-info">
						<h3>{{ todayVisits }}</h3>
						<p>Today's Visits</p>
					</div>
				</div>
			</n-card>
			<n-card class="stat-card">
				<div class="stat-content">
					<Icon :name="PantryIcon" :size="32" class="stat-icon" />
					<div class="stat-info">
						<h3>{{ pantryVisits }}</h3>
						<p>Pantry Visits</p>
					</div>
				</div>
			</n-card>
		</div>

		<!-- Main Content Tabs -->
		<n-tabs v-model:value="activeTab" type="line" animated>
			<n-tab-pane name="visitors" tab="Visitor Management">
				<VisitorManagement
					:visitors="visitors"
					@visitor-selected="handleVisitorSelected"
					@edit-visitor="handleEditVisitor"
					@delete-visitor="handleDeleteVisitor"
				/>
			</n-tab-pane>
			<n-tab-pane name="visits" tab="Visit History">
				<VisitHistory :visits="visits" @edit-visit="handleEditVisit" @delete-visit="handleDeleteVisit" />
			</n-tab-pane>
			<n-tab-pane name="admin" tab="Administrative">
				<AdminPanel :stats="stats" @export-data="handleExportData" />
			</n-tab-pane>
		</n-tabs>

		<!-- Add Visit Modal -->
		<n-modal v-model:show="showAddVisitModal" preset="card" title="Add Visit" class="add-visit-modal">
			<AddVisitForm :visitors="visitors" @submit="handleAddVisit" @cancel="showAddVisitModal = false" />
		</n-modal>

		<!-- Register Visitor Modal -->
		<n-modal
			v-model:show="showRegisterVisitorModal"
			preset="card"
			title="Register New Visitor"
			class="register-visitor-modal"
		>
			<RegisterVisitorForm @submit="handleRegisterVisitor" @cancel="showRegisterVisitorModal = false" />
		</n-modal>

		<!-- Edit Visitor Modal -->
		<n-modal v-model:show="showEditVisitorModal" preset="card" title="Edit Visitor" class="edit-visitor-modal">
			<EditVisitorForm
				:visitor="selectedVisitor"
				@submit="handleUpdateVisitor"
				@cancel="showEditVisitorModal = false"
			/>
		</n-modal>

		<!-- Confirm Delete Visitor Modal -->
		<ConfirmDeleteModal :show="showDeleteVisitorModal" @confirm="confirmDeleteVisitor" @cancel="cancelDeleteVisitor">
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
	title: "Staff Dashboard",
	auth: true,
	roles: ["admin", "staff"]
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
const visitors = ref([
	{ id: 1, name: "John Doe", phone: "555-1234", lastVisit: "2024-01-15", totalVisits: 5 },
	{ id: 2, name: "Jane Smith", phone: "555-5678", lastVisit: "2024-01-14", totalVisits: 3 },
	{ id: 3, name: "Bob Johnson", phone: "555-9012", lastVisit: "2024-01-13", totalVisits: 8 }
])

const visits = ref([
	{
		id: 1,
		visitorName: "John Doe",
		phone: "555-1234",
		checkInTime: "2024-01-15 09:30",
		services: ["pantry", "clothing"],
		notes: ""
	},
	{
		id: 2,
		visitorName: "Jane Smith",
		phone: "555-5678",
		checkInTime: "2024-01-14 14:20",
		services: ["housing"],
		notes: "Follow up needed"
	},
	{
		id: 3,
		visitorName: "Bob Johnson",
		phone: "555-9012",
		checkInTime: "2024-01-13 11:15",
		services: ["pantry"],
		notes: ""
	}
])

// Computed
const totalVisitors = computed(() => visitors.value.length)
const totalVisits = computed(() => visits.value.length)
const todayVisits = computed(() => {
	const today = new Date().toDateString()
	return visits.value.filter(visit => new Date(visit.checkInTime).toDateString() === today).length
})
const pantryVisits = computed(() => visits.value.filter(visit => visit.services.includes("pantry")).length)

const stats = computed(() => ({
	totalVisitors: totalVisitors.value,
	totalVisits: totalVisits.value,
	todayVisits: todayVisits.value,
	pantryVisits: pantryVisits.value
}))

// Icons
const AddIcon = "mdi:plus"
const UserAddIcon = "mdi:account-plus"
const VisitorsIcon = "mdi:account-group"
const VisitsIcon = "mdi:calendar-check"
const TodayIcon = "mdi:calendar-today"
const PantryIcon = "mdi:food-variant"

// Event handlers
function handleVisitorSelected(visitor: any) {
	selectedVisitor.value = visitor
	// Could show visitor details modal or navigate to visitor page
}

function handleEditVisitor(visitor: any) {
	selectedVisitor.value = visitor
	showEditVisitorModal.value = true
}

function handleDeleteVisitor(visitorId: number) {
	pendingVisitorId.value = visitorId
	showDeleteVisitorModal.value = true
}

async function confirmDeleteVisitor() {
	if (pendingVisitorId.value !== null) {
		visitors.value = visitors.value.filter(v => v.id !== pendingVisitorId.value)
		visits.value = visits.value.filter(v => v.visitorId !== pendingVisitorId.value)
		pendingVisitorId.value = null
	}
	showDeleteVisitorModal.value = false
}

function cancelDeleteVisitor() {
	pendingVisitorId.value = null
	showDeleteVisitorModal.value = false
}

function handleEditVisit(visit: any) {
	// Implement edit visit functionality
	// console.log("Edit visit:", visit)
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

async function handleAddVisit(visitData: any) {
	// API call to add visit
	const newVisit = {
		id: Date.now(), // Replace with actual ID from API
		...visitData,
		checkInTime: new Date().toISOString()
	}
	visits.value.unshift(newVisit)
	showAddVisitModal.value = false
}

async function handleRegisterVisitor(visitorData: any) {
	// API call to register visitor
	const newVisitor = {
		id: Date.now(), // Replace with actual ID from API
		...visitorData,
		lastVisit: null,
		totalVisits: 0
	}
	visitors.value.push(newVisitor)
	showRegisterVisitorModal.value = false
}

async function handleUpdateVisitor(visitorData: any) {
	// API call to update visitor
	const index = visitors.value.findIndex(v => v.id === visitorData.id)
	if (index !== -1) {
		visitors.value[index] = { ...visitors.value[index], ...visitorData }
	}
	showEditVisitorModal.value = false
}

function handleExportData(exportType: string) {
	// Implement data export functionality
	// console.log("Exporting data:", exportType)
}

function loadDashboardData() {
	// API calls to load visitors, visits, and stats
	// This is currently using mock data
}

onMounted(() => {
	// Load initial data
	loadDashboardData()
})
</script>

<style scoped>
.staff-dashboard {
	padding: 20px;
	max-width: 1400px;
	margin: 0 auto;
}

.dashboard-header {
	display: flex;
	justify-content: space-between;
	align-items: center;
	margin-bottom: 30px;
}

.dashboard-header h1 {
	font-size: 32px;
	font-weight: bold;
	margin: 0;
}

.header-actions {
	display: flex;
	gap: 12px;
}

.stats-grid {
	display: grid;
	grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
	gap: 20px;
	margin-bottom: 30px;
}

.stat-card {
	background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
	color: white;
}

.stat-content {
	display: flex;
	align-items: center;
	gap: 16px;
}

.stat-icon {
	color: rgba(255, 255, 255, 0.8);
}

.stat-info h3 {
	font-size: 32px;
	font-weight: bold;
	margin: 0 0 4px 0;
}

.stat-info p {
	margin: 0;
	opacity: 0.8;
	font-size: 14px;
}

.add-visit-modal,
.register-visitor-modal,
.edit-visitor-modal {
	max-width: 600px;
}

/* Responsive design */
@media (max-width: 768px) {
	.staff-dashboard {
		padding: 15px;
	}

	.dashboard-header {
		flex-direction: column;
		gap: 15px;
		align-items: stretch;
	}

	.dashboard-header h1 {
		font-size: 24px;
		text-align: center;
	}

	.header-actions {
		justify-content: center;
	}

	.stats-grid {
		grid-template-columns: repeat(2, 1fr);
		gap: 15px;
	}

	.stat-info h3 {
		font-size: 24px;
	}
}

@media (max-width: 480px) {
	.stats-grid {
		grid-template-columns: 1fr;
	}

	.header-actions {
		flex-direction: column;
	}
}
</style>
