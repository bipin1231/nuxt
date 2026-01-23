<script setup lang="ts">
import ProductAttributesLayout from '../ProductConfigLayout.vue'
import { Plus, Pencil, Trash2 } from 'lucide-vue-next'

definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <ProductAttributesLayout>
    <div class="rounded-lg border border-border/30 bg-card p-6">
   
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h2 class="text-sm font-medium text-foreground">Manage Categories</h2>
        <button
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
              v-for="i in 5"
              :key="i"
              class="group hover:bg-secondary/10 transition-colors"
            >
              <td class="px-5 py-4 text-foreground">Category {{ i }}</td>
              <td class="px-5 py-4 text-right flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  type="button"
                  class="flex items-center justify-center h-7 w-7 rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
                >
                  <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                </button>
                <button
                  type="button"
                  class="flex items-center justify-center h-7 w-7 rounded-md text-destructive hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 class="h-3.5 w-3.5" stroke-width="1.5" />
                </button>
              </td>
            </tr>
          </tbody>
        </table>

        <div class="py-12 text-center" v-if="false">
          <p class="text-sm text-muted-foreground">No categories found.</p>
        </div>
      </div>
    </div>
  </ProductAttributesLayout>
</template>
