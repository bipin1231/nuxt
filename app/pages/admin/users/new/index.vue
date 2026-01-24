<script setup lang="ts">
import { ref, computed,reactive } from 'vue'
import { useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { categories } from '~/lib/store-data'
import { ArrowLeft, Upload, X, ChevronDown, Check } from 'lucide-vue-next'
import { is } from 'drizzle-orm'

definePageMeta({
  layout: 'admin',
})

type UserForm={
  name: string,
  email: string,
  password: string,
  confirmPassword: string,
  role: string,
  avatar: File | null,

}

const userForm=reactive<UserForm>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
  role: 'user',
  avatar: null,
})

const router = useRouter()


const imagePreview = ref<string | null>(null)

const handleImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const file = target.files?.[0]
  if (file) {
    imagePreview.value = URL.createObjectURL(file)
    userForm.avatar = file
  }
}

const removeImage = () => {
   userForm.avatar=null
  imagePreview.value = null
}


const productName = ref('')
const description = ref('')
const price = ref<number | null>(null)
const compareAtPrice = ref<number | null>(null)
const status = ref('Draft')
const category = ref(categories[0]?.id || '')
const tags = ref<string[]>([])
const role = ref('user')


const isOpen = ref(false)
const isLoading = ref(false)

const roleOptions = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
  { value: 'editor', label: 'Editor' }
]

const selectedLabel = computed(() => {
  return roleOptions.find(opt => opt.value === role.value)?.label || 'Select a role'
})

const selectRole = (value: string) => {
  role.value = value
  userForm.role=value
  isOpen.value = false
}

const toggleDropdown = () => {
  isOpen.value = !isOpen.value
}


const goBack = () => {
  router.go(-1)
}

const addUser = async () => {
  console.log({
    name: userForm.name,
    email: userForm.email,
    password: userForm.password,
    confirmPassword: userForm.confirmPassword,
    role: userForm.role,
    avatar: userForm.avatar,
  })
  const formData = new FormData();
  formData.append('name', userForm.name);
  formData.append('email', userForm.email);
  formData.append('password', userForm.password);
  formData.append('confirmPassword', userForm.confirmPassword);
  formData.append('role', userForm.role);
  if (userForm.avatar) {
    formData.append('image', userForm.avatar);
}
 try{
  isLoading.value=true;
  const res=await $fetch('/api/admin/users',{
    method:'POST',
    body:formData,
  });
 
  router.push('/admin/users');
 }catch(error){
  console.error("Error adding user:",error);
 }finally{
  isLoading.value=false;
}
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminHeader
      title="Add new user"
      description="Create a new user for your store"
    />

    <div class="p-6">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-xs tracking-wide text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft class="h-3 w-3" stroke-width="1.5" />
        Back to users
      </button>

      <form @submit.prevent="addUser" class="mt-8 grid gap-8 lg:grid-cols-3">

      
        <div class="lg:col-span-2 space-y-6">
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">User Details</h2>

            <div class="mt-6 space-y-4">
              <div>
                <label class="text-xs text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  placeholder="Enter full name"
                  v-model="userForm.name"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Email</label>
                <input
                  type="email"
                  v-model="userForm.email"
                  placeholder="Enter email"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Password</label>
                <input
                  type="password"
                  v-model="userForm.password"
                  placeholder="Enter password"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Confirm Password</label>
                <input
                  type="password"
                  v-model="userForm.confirmPassword"
                  placeholder="Confirm password"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
                />
              </div>

              <div>
                <label class="text-xs text-muted-foreground">Role</label>
                <div class="relative mt-1.5">
                  <button
                    type="button"
                    @click="toggleDropdown"
                    class="w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-left text-sm flex items-center justify-between"
                  >
                    <span>{{ selectedLabel }}</span>
                    <ChevronDown
                      class="h-4 w-4 text-muted-foreground transition-transform"
                      :class="{ 'rotate-180': isOpen }"
                    />
                  </button>

                  <div
                    v-if="isOpen"
                    class="absolute z-50 mt-2 w-full rounded-lg border border-border/50 bg-white shadow-lg"
                  >
                    <button
                      v-for="option in roleOptions"
                      :key="option.value"
                      type="button"
                      @click="selectRole(option.value)"
                      class="w-full px-4 py-2.5 text-left text-sm hover:bg-muted/50 flex items-center justify-between"
                    >
                      <span>{{ option.label }}</span>
                      <Check v-if="role === option.value" class="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div
                  v-if="isOpen"
                  @click="isOpen = false"
                  class="fixed inset-0 z-40"
                ></div>
              </div>
            </div>
          </div>

          <div class="flex justify-end gap-3">
            <button
              type="button"
              @click="goBack"
              class="rounded-lg border border-border/50 px-6 py-2.5 text-sm"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="rounded-lg bg-foreground px-6 py-2.5 text-sm font-medium text-background"
            >
              {{ isLoading ? 'Creating...' : 'Create User' }}
            </button>
          </div>
        </div>

      
        <div class="space-y-6">
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium text-foreground">Profile Picture</h2>

            <div class="mt-6 flex flex-col items-center gap-4">
              <div class="relative h-32 w-32">
                <div
                  class="h-32 w-32 overflow-hidden rounded-full border border-border/50 bg-muted flex items-center justify-center"
                >
                  <img
                    v-if="imagePreview"
                    :src="imagePreview"
                    class="h-full w-full object-cover"
                  />
                  <Upload v-else class="h-6 w-6 text-muted-foreground" />
                </div>

                <button
                  v-if="imagePreview"
                  type="button"
                  @click="removeImage"
                  class="absolute -right-2 -top-2 rounded-full bg-background p-1 shadow"
                >
                  <X class="h-4 w-4" />
                </button>
              </div>

              <label class="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageChange"
                />
                <span
                  class="inline-flex items-center gap-2 rounded-lg border border-border/50 px-4 py-2 text-xs hover:bg-muted/50"
                >
                  <Upload class="h-4 w-4" />
                  Upload photo
                </span>
              </label>

              <p class="text-xs text-muted-foreground text-center">
                PNG, JPG up to 5MB
              </p>
            </div>
          </div>
        </div>

      </form>
    </div>
  </div>
</template>
