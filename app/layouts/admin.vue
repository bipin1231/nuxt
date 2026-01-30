<script setup lang="ts">
import { ref, watch } from 'vue'
import AdminSidebar from '~/components/admin/AdminSidebar.vue'

const sidebarCollapsed = ref(false)

// Dynamic sidebar width
const sidebarWidth = ref('w-56')
watch(sidebarCollapsed, (val) => {
  sidebarWidth.value = val ? 'w-16' : 'w-56'
})
</script>

<template>
  <div class="flex min-h-screen bg-background">

    <AdminSidebar v-model="sidebarCollapsed" />

 
    <main
      :class="[
        'flex-1 transition-all duration-300 ease-in-out',
        sidebarCollapsed ? 'ml-16' : 'ml-56'
      ]"
    >
      <NuxtPage />
    </main>
  </div>
</template>
