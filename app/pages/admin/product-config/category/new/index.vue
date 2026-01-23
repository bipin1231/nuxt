<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from '#imports'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const categoryName = ref('')

// Simple form submission
const saveCategory = () => {
  if (!categoryName.value.trim()) {
    alert('Category name is required')
    return
  }


  console.log('Saving category:', categoryName.value)

  // Reset and navigate back to categories list
  categoryName.value = ''
  router.push('/admin/categories')
}
</script>

<template>
  <div class="min-h-screen bg-background p-6">
    <!-- Header -->
    <div class="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <h1 class="text-lg font-semibold text-foreground">Add Category</h1>
      <button
        @click="router.push('/admin/categories')"
        class="text-xs px-3 py-1.5 rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
      >
        Back to Categories
      </button>
    </div>

    <!-- Form Card -->
    <div class="rounded-lg border border-border/30 bg-card p-6 max-w-md">
      <label class="block text-sm font-medium text-muted-foreground mb-2" for="category">
        Category Name
      </label>
      <input
        id="category"
        type="text"
        v-model="categoryName"
        placeholder="Enter category name..."
        class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-4"
      />

      <button
        @click="saveCategory"
        class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background transition-opacity hover:opacity-90"
      >
        <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
        Save Category
      </button>
    </div>
  </div>
</template>
