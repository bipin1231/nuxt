<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from '#imports'
import { products, categories } from '~/lib/store-data'
import { Search } from 'lucide-vue-next'

defineProps<{
  label: string
  modelValue: string
}>()


const router = useRouter()
const route = useRoute()
const emit = defineEmits([

  'update:modelValue'
])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}


const productConfig = [
  { name: 'Category', href: '/admin/product-config/category' },
  { name: 'Brand', href: '/admin/product-config/brand' },
  { name: 'Size', href: '/admin/product-config/size' },
]

const navigate = (href: string) => {
  router.push(href)
}

const isActive = (href: string) => route.path === href



// Search query 
const searchQuery = ref((route.query.search as string) || '')
const selectedProductConfig = ref<string | null>()




const setProductConfig = (config: string | null) => {
  selectedProductConfig.value = config
 
}

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})
</script>

<template>
      <AdminHeader
      title="Product Configuration"
      description="Manage product categories, brands, and sizes."
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
            :placeholder="`Search ${label}...`"
            :value="modelValue"
            @input="onInput"
            class="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

       
        <div class="flex flex-wrap items-center gap-2">
          <!-- <button
            type="button"
            @click="setCategory(null)"
            :class="[
              'rounded-full px-3 py-1 text-xs transition-colors',
              selectedCategory === null
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            ]"
          >
            All
          </button> -->

          <button
            v-for="config in productConfig"
            :key="config.name"
            type="button"
            @click="navigate(config.href)"
            :class="[
              'rounded-full px-3 py-1 text-xs transition-colors',
              isActive(config.href) 
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ config.name }}
          </button>
        </div>
      </div>
     

  <!-- Slot for page content -->
  <slot />
   </div>
</template>
