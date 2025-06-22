<script setup lang="ts">
import { useRouter } from "vue-router"

definePageMeta({
	auth: true,
	roles: ["admin", "staff"]
})

const router = useRouter()

// Redirect to staff dashboard
router.replace("/staff/dashboard")
</script>
