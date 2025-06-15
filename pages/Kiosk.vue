<template>
	<div class="page p-4">
		<NMessageProvider>
			<NCard title="Kiosk" class="mx-auto w-full max-w-3xl">
				<NSpace vertical>
					<NText>Search and filter the Visitors data table below:</NText>
					<NInput
						v-model:value="search"
						placeholder="Search by name, phone, or date"
						clearable
						:style="{ width: '100%' }"
					/>
					<NSpace>
						<NButton type="primary" @click="() => console.log('Search clicked')">Search</NButton>
						<NButton @click="() => console.log('Reset clicked')">Reset</NButton>
						<NButton type="info" @click="() => console.log('Export clicked')">Export Data</NButton>
					</NSpace>
					<NDataTable
						class="mt-4"
						:title="`Data Table (${filteredRows.length} items)`"
						:columns="columns"
						:data="filteredRows"
						:pagination-options="{ pageSize: 10 }"
						filter-options="filterOptions"
					>
						<template #row="{ row }">
							<tr>
								<td>{{ row.fullname }}</td>
								<td>{{ row.phone }}</td>
								<td>{{ row.lastVisit }}</td>
								<td>{{ row.lastPantryVisit }}</td>
								<td>{{ row.totalVisits }}</td>
							</tr>
						</template>
					</NDataTable>
				</NSpace>
			</NCard>
		</NMessageProvider>
	</div>
</template>

<script setup lang="ts">
import { faker } from "@faker-js/faker"
import { NButton, NCard, NDataTable, NInput, NMessageProvider, NSpace, NSwitch, NText } from "naive-ui"
import { computed, ref } from "vue"

definePageMeta({
	title: "Kiosk",
	auth: true,
	roles: "all"
})

// Reactive state
const inputValue = ref("")
const selectedValue = ref(null)
const switchValue = ref(false)

// Select options
const options = [
	{
		label: "Option 1",
		value: "1"
	},
	{
		label: "Option 2",
		value: "2"
	},
	{
		label: "Option 3",
		value: "3"
	}
]

// DataTable: columns
interface TableRow {
	fullname: string
	phone: string
	lastVisit: string
	lastPantryVisit: string
	totalVisits: number
}
const columns = [
	{
		title: "Full Name",
		key: "fullname",
		resizable: true,
		filter: true,
		sorter: (rowA: TableRow, rowB: TableRow) => rowA.fullname.localeCompare(rowB.fullname)
	},
	{
		title: "Phone Number",
		key: "phone",
		resizable: true,
		filter: true,
		sorter: (rowA: TableRow, rowB: TableRow) => rowA.phone.localeCompare(rowB.phone)
	},
	{
		title: "Last Visit",
		key: "lastVisit",
		resizable: true,
		filter: true,
		sorter: (rowA: TableRow, rowB: TableRow) => new Date(rowA.lastVisit).getTime() - new Date(rowB.lastVisit).getTime()
	},
	{
		title: "Last Pantry Visit",
		key: "lastPantryVisit",
		resizable: true,
		filter: true,
		sorter: (rowA: TableRow, rowB: TableRow) =>
			new Date(rowA.lastPantryVisit).getTime() - new Date(rowB.lastPantryVisit).getTime()
	},
	{
		title: "Total Visits",
		key: "totalVisits",
		resizable: true,
		filter: true,
		sorter: (rowA: TableRow, rowB: TableRow) => rowA.totalVisits - rowB.totalVisits
	}
]

// DataTable: generate 20 rows of fake data
function randomDateInPastYear() {
	const now = new Date()
	const past = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate())
	return faker.date.between({ from: past, to: now }).toISOString().split("T")[0]
}
const rows = ref(
	Array.from({ length: 20 }, () => ({
		fullname: faker.person.fullName(),
		phone: faker.phone.number(),
		lastVisit: randomDateInPastYear(),
		lastPantryVisit: randomDateInPastYear(),
		totalVisits: faker.number.int({ min: 1, max: 30 })
	}))
)

// DataTable: search and filter
const search = ref("")
const filteredRows = computed(() => {
	if (!search.value) return rows.value
	const s = search.value.toLowerCase()
	return rows.value.filter(
		row =>
			row.fullname.toLowerCase().includes(s) ||
			row.phone.toLowerCase().includes(s) ||
			row.lastVisit.toLowerCase().includes(s) ||
			row.lastPantryVisit.toLowerCase().includes(s) ||
			row.totalVisits.toString().includes(s)
	)
})

// DataTable: pagination
const pagination = { pageSize: 10 }

// DataTable: row key
const rowKey = (row: any) => row.fullname + row.phone

// DataTable: filter options (optional, can be extended)
const filterOptions = undefined
</script>

<style scoped>
.page {
	max-width: 1200px;
	margin: 0 auto;
}
</style>
