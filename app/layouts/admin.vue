<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuth } from '@/composables/useAuth'

const router = useRouter()
const route = useRoute()
const { user,logout } = useAuth()


const isSidebarOpen = ref(true)

const menuItems = [
  { title: 'Dashboard', path: '/admin/dashboard' },
  { title: 'Products', path: '/admin/products' },
  { title: 'Orders', path: '/admin/orders' },
  { title: 'Users', path: '/admin/users' },
]


const handleLogout = async() => {
    await logout();


   router.push('/login')
}
</script>

<template>
  <div class="min-h-screen flex bg-black text-white">


    <aside
      class="bg-gray-900 w-64 min-h-screen px-4 py-6"
      :class="{ 'hidden': !isSidebarOpen }"
    >
      <h2 class="text-xl font-bold mb-8">Admin Panel</h2>
      <ul>
        <li
          v-for="item in menuItems"
          :key="item.path"
          class="mb-4 cursor-pointer hover:text-gray-400"
          @click="router.push(item.path)"
        >
          {{ item.title }}
        </li>
      </ul>
      <button
        class="mt-auto bg-red-600 px-4 py-2 rounded hover:bg-red-500"
        @click="handleLogout"
      >
        Logout
      </button>
    </aside>

 
    <div class="flex-1 flex flex-col">
   
      <nav class="bg-gray-800 px-6 py-4 flex justify-between items-center">
        <button
          class="text-white "
          @click="isSidebarOpen = !isSidebarOpen"
        >
          ☰
        </button>
        <div class="text-lg font-semibold">Admin Panel</div>
        <div>Welcome</div>
      </nav>

    
      <main class="flex-1 overflow-y-auto p-6">
        <slot />
      </main>
    </div>

  </div>
</template>