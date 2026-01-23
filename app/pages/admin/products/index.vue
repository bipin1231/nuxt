<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import  AdminHeader  from '~/components/admin/AdminHeader.vue'
import { products, categories } from '~/lib/store-data'
import { Plus, MoreHorizontal, Pencil, Trash2, Search } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
})
// Router & query params
const route = useRoute()
const router = useRouter()

// Search query and category filter
const searchQuery = ref((route.query.search as string) || '')
const selectedCategory = ref<string | null>((route.query.category as string) || null)

// Filtered products
const filteredProducts = computed(() => {
  return products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.value.toLowerCase())
    const matchesCategory = !selectedCategory.value || product.category === selectedCategory.value
    return matchesSearch && matchesCategory
  })
})

// Update query params when filters change
const setCategory = (category: string | null) => {
  selectedCategory.value = category
  router.replace({ query: { ...route.query, category: category || undefined } })
}

watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})
</script>

<template>
  <div class="min-h-screen bg-background">
    <!-- Admin Header -->
    <AdminHeader
      title="Products"
      :description="`${products.length} products in your catalog`"
    >
      <template #actions>
        <NuxtLink
          to="/admin/products/new"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs tracking-wide text-background transition-opacity hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add product
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
            placeholder="Search products..."
            v-model="searchQuery"
            class="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-4 text-sm placeholder:text-muted-foreground/50 focus:border-foreground/20 focus:outline-none focus:ring-1 focus:ring-foreground/10"
          />
        </div>

        <!-- Category Filter -->
        <div class="flex flex-wrap items-center gap-2">
          <button
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
          </button>

          <button
            v-for="category in categories"
            :key="category.id"
            type="button"
            @click="setCategory(category.id)"
            :class="[
              'rounded-full px-3 py-1 text-xs transition-colors',
              selectedCategory === category.id
                ? 'bg-foreground text-background'
                : 'bg-secondary text-muted-foreground hover:text-foreground'
            ]"
          >
            {{ category.name }}
          </button>
        </div>
      </div>

      <!-- Products Table -->
      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs font-normal text-muted-foreground">
                Product
              </th>
              <th class="hidden px-5 py-3 text-left text-xs font-normal text-muted-foreground sm:table-cell">
                Category
              </th>
              <th class="hidden px-5 py-3 text-right text-xs font-normal text-muted-foreground md:table-cell">
                Price
              </th>
              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                Status
              </th>
              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr v-for="product in filteredProducts" :key="product.id" class="group">
              <td class="px-5 py-4">
                <div class="flex items-center gap-4">
                  <div class="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-md bg-secondary/30">
                    <img
                      :src="product.image || '/placeholder.svg'"
                      :alt="product.name"
                      class="object-cover h-full w-full"
                    />
                  </div>
                  <div>
                    <p class="text-sm text-foreground">{{ product.name }}</p>
                    <p class="mt-0.5 line-clamp-1 text-xs text-muted-foreground md:hidden">
                      ${{ product.price }} - {{ product.category }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="hidden px-5 py-4 sm:table-cell">
                <span class="text-sm capitalize text-muted-foreground">{{ product.category }}</span>
              </td>

              <td class="hidden px-5 py-4 text-right md:table-cell">
                <span class="text-sm tabular-nums text-foreground">${{ product.price }}</span>
              </td>

              <td class="px-5 py-4 text-right">
                <span :class="`text-xs ${product.new ? 'text-accent' : 'text-muted-foreground'}`">
                  {{ product.new ? 'New' : 'Active' }}
                </span>
              </td>

              <td class="px-5 py-4 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
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

        <div v-if="filteredProducts.length === 0" class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No products found.</p>
        </div>
      </div>
    </div>
  </div>
</template>
