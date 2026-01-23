<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Users, Search, MoreHorizontal, Pencil, Trash2, UserPlus, Shield } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
})

const roles = [
  { id: 'admin', name: 'Admin', color: 'text-red-500' },
  { id: 'editor', name: 'Editor', color: 'text-blue-500' },
  { id: 'viewer', name: 'Viewer', color: 'text-green-500' }
]
const {data:users}=useFetch('/api/admin/users');

const route = useRoute()
const router = useRouter()


const searchQuery = ref((route.query.search as string) || '')
const selectedRole = ref<string | null>((route.query.role as string) || null)

// Role change modal
const showRoleModal = ref(false)
const selectedUser = ref<any>(null)
const newRole = ref('')

// Filtered users
const filteredUsers = computed(() => {
  return users.value.filter((user) => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesRole = !selectedRole.value || user.role === selectedRole.value
    return matchesSearch && matchesRole
  })
})


const setRole = (role: string | null) => {
  selectedRole.value = role
  router.replace({ query: { ...route.query, role: role || undefined } })
}

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})

// Open role change modal
const openRoleModal = (user: any) => {
  selectedUser.value = user
  newRole.value = user.role
  showRoleModal.value = true
}

// Change user role
const changeUserRole = () => {
 
}

// Get role badge color
const getRoleColor = (role: string) => {
  return roles.find(r => r.id === role)?.color || 'text-muted-foreground'
}

</script>

<template>
  <div class="min-h-screen bg-background">
   
    <AdminHeader
      title="Users"
      :description="`${users.length} users in your system`"
    >
      <template #actions>
                        <NuxtLink
          to="/admin/users/new"

        >
        <button
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs tracking-wide text-background transition-opacity hover:opacity-90"
        >

          <UserPlus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add user
        </button>
        </NuxtLink>
      </template>
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
            placeholder="Search users..."
            v-model="searchQuery"
            class="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

       
        <div class="flex flex-wrap items-center gap-2">
          <button
            type="button"
            @click="setRole(null)"
            :class="[
              'rounded-full px-3 py-1 text-xs transition-colors',
              selectedRole === null
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            ]"
          >
            All
          </button>

          <button
            v-for="role in roles"
            :key="role.id"
            type="button"
            @click="setRole(role.id)"
            :class="[
              'rounded-full px-3 py-1 text-xs transition-colors',
              selectedRole === role.id
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ role.name }}
          </button>
        </div>
      </div>

      <!-- Users Table -->
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
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                Role
              </th>
              <th class="hidden px-5 py-3 text-right text-xs font-normal text-muted-foreground sm:table-cell">
                Status
              </th>
              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr v-for="user in filteredUsers" :key="user.id" class="group">
              <td class="px-5 py-4">
                <div class="flex items-center gap-3">
                  <div class="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full bg-secondary/30">
                    <img
                      :src="user.avatar"
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

              <td class="px-5 py-4">
                <span :class="`inline-flex items-center gap-1.5 text-xs font-medium capitalize ${getRoleColor(user.role)}`">
                  <Shield class="h-3 w-3" stroke-width="1.5" />
                  {{ user.role }}
                </span>
              </td>

              <td class="hidden px-5 py-4 text-right sm:table-cell">
                <span :class="`text-xs ${user.status === 'active' ? 'text-green-500' : 'text-muted-foreground'}`">
                  {{ user.status === 'active' ? 'Active' : 'Inactive' }}
                </span>
              </td>

              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    @click="openRoleModal(user)"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                    title="Change role"
                  >
                    <Shield class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <MoreHorizontal class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="filteredUsers.length === 0" class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No users found.</p>
        </div>
      </div>
    </div>

    <!-- Role Change Modal -->
    <div
      v-if="showRoleModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      @click.self="showRoleModal = false"
    >
      <div class="w-full max-w-md rounded-lg border border-border/30  bg-white   p-6 shadow-lg">
        <div class="mb-4 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary">
            <Shield class="h-5 w-5 text-foreground" stroke-width="1.5" />
          </div>
          <div>
            <h3 class="text-lg font-medium text-foreground">Change User Role</h3>
            <p class="text-sm text-muted-foreground">Update role for {{ selectedUser?.name }}</p>
          </div>
        </div>

        <div class="space-y-4">
          <div>
            <label class="mb-2 block text-xs text-muted-foreground">Select new role</label>
            <div class="space-y-2">
              <label
                v-for="role in roles"
                :key="role.id"
                class="flex cursor-pointer items-center gap-3 rounded-lg border border-border/30 p-3 transition-colors hover:bg-secondary/50"
                :class="{ 'bg-secondary border-foreground/20': newRole === role.id }"
              >
                <input
                  type="radio"
                  :value="role.id"
                  v-model="newRole"
                  class="h-4 w-4 border-border/50 text-foreground focus:ring-foreground/20"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-foreground">{{ role.name }}</p>
                  <p class="text-xs text-muted-foreground">
                    {{
                      role.id === 'admin' ? 'Full system access' :
                      role.id === 'editor' ? 'Can create and edit content' :
                      'View-only access'
                    }}
                  </p>
                </div>
              </label>
            </div>
          </div>

          <div class="flex gap-2">
            <button
              type="button"
              @click="showRoleModal = false"
              class="flex-1 rounded-lg border border-border/30 bg-secondary px-4 py-2 text-sm text-foreground transition-colors hover:bg-secondary/80"
            >
              Cancel
            </button>
            <button
              type="button"
              @click="changeUserRole"
              class="flex-1 rounded-lg bg-foreground px-4 py-2 text-sm text-background transition-opacity hover:opacity-90"
            >
              Update Role
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>