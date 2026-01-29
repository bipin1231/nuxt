<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Users, Search, MoreHorizontal, Pencil, Trash2, UserPlus, Shield } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
})

const route = useRoute()

const router = useRouter()



const roles = [
  { id: 'admin', name: 'Admin', color: 'text-red-500' },
  { id: 'editor', name: 'Editor', color: 'text-blue-500' },
  { id: 'viewer', name: 'Viewer', color: 'text-green-500' }
]


const searchQuery = ref((route.query.search as string) || '')



  const {data:users,refresh}=useFetch('/api/admin/customers', {
  query: {
    search: searchQuery,

  }
});









watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})





</script>

<template>
  <div class="min-h-screen bg-background">
   
    <AdminHeader
      title="Customes"
      :description="`${users?.length} customers in your system`"
    >

    </AdminHeader>

    <div class="p-6">
   
      <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
     
        <div class="relative max-w-xs flex-1">
          <Search
            class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
            stroke-width="1.5"
          />
          <input
            type="text"
            placeholder="Search customers..."
            v-model="searchQuery"
            class="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

       

      </div>


      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                User
              </th>
              <th class="hidden px-5 py-3 text-left text-xs font-normal text-muted-foreground md:table-cell">
                Email
              </th>


            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr v-for="user in users" :key="user.id" class="group">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary/30">
                    <img
                      :src="user.avatar || ''"
                      :alt="user.name"
                      class="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-foreground">{{ user.name }}</p>
                    <p class="mt-0.5 text-xs text-muted-foreground md:hidden">
                      {{ user.email }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="hidden px-5 py-4 md:table-cell">
                <span class="text-sm text-muted-foreground">{{ user.email }}</span>
              </td>



            </tr>
          </tbody>
        </table>

        <div v-if="users?.length === 0" class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No users found.</p>
        </div>
      </div>
    </div>





  </div>
</template>