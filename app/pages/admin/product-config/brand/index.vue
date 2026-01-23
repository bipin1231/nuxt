<script setup lang="ts">
import ProductAttributesLayout from '../ProductConfigLayout.vue'
definePageMeta({
  layout: 'admin',
})
</script>

<template>
  <ProductAttributesLayout>
    <div class="rounded-lg border border-border/30 bg-card p-6">
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-sm font-medium text-foreground">Manage Categories</h2>
        <button class="px-3 py-1.5 bg-foreground text-background rounded-lg text-xs hover:opacity-90 transition-opacity">
          Add Category
        </button>
      </div>

      <table class="w-full text-sm">
        <thead>
          <tr class="border-b border-border/30 text-muted-foreground">
            <th class="px-4 py-2 text-left">Category Name</th>
            <th class="px-4 py-2 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-border/30">
          <tr v-for="i in 5" :key="i" class="hover:bg-secondary/20">
            <td class="px-4 py-2">Category {{ i }}</td>
            <td class="px-4 py-2 text-right">
              <button class="px-2 py-1 text-xs bg-secondary rounded hover:bg-foreground hover:text-background transition-colors">Edit</button>
              <button class="px-2 py-1 text-xs bg-destructive/10 text-destructive rounded hover:bg-destructive hover:text-background transition-colors">Delete</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </ProductAttributesLayout>
</template>
