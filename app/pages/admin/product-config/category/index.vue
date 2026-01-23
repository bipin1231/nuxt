<script setup lang="ts">
import ProductAttributesLayout from '../ProductConfigLayout.vue'
import { ref, computed } from 'vue'
import { Plus, Pencil, Trash2, X } from 'lucide-vue-next'

// Modal state
const showModal = ref(false)
const isEditMode = ref(false)
const editingCategory = ref<number | null>(null)

// Form fields
const categoryName = ref('')
const error = ref('')

// Sample categories 
const categories = ref([
  { id: 1, name: 'Category 1' },
  { id: 2, name: 'Category 2' },
  { id: 3, name: 'Category 3' },
])

// Open modal
const openAddModal = () => {
  isEditMode.value = false
  categoryName.value = ''
  error.value = ''
  showModal.value = true
}

const openEditModal = (category: { id: number; name: string }) => {
  isEditMode.value = true
  editingCategory.value = category.id
  categoryName.value = category.name
  error.value = ''
  showModal.value = true
}

// Save category
const saveCategory = () => {
  if (!categoryName.value.trim()) {
    error.value = 'Category name is required.'
    return
  }

  if (isEditMode.value && editingCategory.value !== null) {
    // Update category
    const index = categories.value.findIndex(c => c.id === editingCategory.value)
    if (index !== -1) categories.value[index].name = categoryName.value
  } else {
    // Add new category
    const newId = categories.value.length
      ? Math.max(...categories.value.map(c => c.id)) + 1
      : 1
    categories.value.push({ id: newId, name: categoryName.value })
  }

  // Close modal and reset
  showModal.value = false
  categoryName.value = ''
  error.value = ''
}

// Cancel modal
const cancelModal = () => {
  showModal.value = false
  categoryName.value = ''
  error.value = ''
}
</script>

<template>
  <ProductAttributesLayout>
   
    <div class="rounded-lg border border-border/30 bg-card p-6">
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 class="text-sm font-medium text-foreground">Manage Categories</h2>
        <button
          @click="openAddModal"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background transition-opacity hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
          Add Category
        </button>
      </div>

   
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead class="bg-background/50">
            <tr class="border-b border-border/30 text-muted-foreground">
              <th class="px-5 py-3 text-left">Category Name</th>
              <th class="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr
              v-for="category in categories"
              :key="category.id"
              class="group hover:bg-secondary/10 transition-colors"
            >
              <td class="px-5 py-4 text-foreground">{{ category.name }}</td>
              <td
                class="px-5 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <button
                  @click="openEditModal(category)"
                  type="button"
                  class="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                </button>
                <button
                  @click="categories.value = categories.value.filter(c => c.id !== category.id)"
                  type="button"
                  class="flex items-center justify-center h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="categories.length === 0" class="py-12 text-center">
          <p class="text-sm text-muted-foreground">No categories found.</p>
        </div>
      </div>
    </div>


    <div
      v-if="showModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="bg-card rounded-lg p-6 w-full max-w-sm relative shadow-lg">
       
        <button
          @click="cancelModal"
          class="absolute top-3 right-3 text-muted-foreground hover:text-foreground transition-colors"
        >
          <X class="h-4 w-4" />
        </button>

        <h3 class="text-sm font-medium text-foreground mb-4">
          {{ isEditMode ? 'Edit Category' : 'Add Category' }}
        </h3>

        <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Category Name
        </label>
        <input
          id="category"
          type="text"
          v-model="categoryName"
          placeholder="Enter category name"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />

        
        <p v-if="error" class="text-xs text-destructive mb-2">{{ error }}</p>

        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="cancelModal"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveCategory"
            class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
            {{ isEditMode ? 'Update' : 'Add' }}
          </button>
        </div>
      </div>
    </div>
  </ProductAttributesLayout>
</template>
