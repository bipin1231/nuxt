<script setup lang="ts">
import { ChevronDown, Check } from 'lucide-vue-next'

defineProps<{
  defaultValue:string
  label: string
  selectedItem: string
  items: any[]
  isOpen: boolean
}>()

const emit = defineEmits<{
  (e: 'toggleBrandDropdown'): void
  (e: 'selectItem', item: any): void
}>()
</script>

<template>
  <div class="mb-2">
    <label class="text-xs text-muted-foreground">{{ label }}</label>

    <div class="relative">
      <button
        type="button"
        @click="emit('toggleBrandDropdown')"
        class="w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-left text-sm flex justify-between"
      >
        <span>{{ selectedItem?.title || defaultValue || "Select a item" }}</span>
        <ChevronDown
          class="h-4 w-4 transition-transform"
          :class="{ 'rotate-180': isOpen }"
        />
      </button>

      <div
        v-if="isOpen"
        class="absolute z-50 mt-2 w-full rounded-lg border bg-card shadow"
      >
        <button
          v-for="item in items"
          :key="item.id"
          type="button"
          @click="emit('selectItem', item)"
          class="w-full px-4 py-2 text-sm text-left hover:bg-muted flex justify-between"
        >
          {{ item.title }}
          <Check v-if="selectedItem === item.title" class="h-4 w-4" />
        </button>
      </div>
    </div>

    <div
      v-if="isOpen"
      @click="emit('toggleBrandDropdown')"
      class="fixed inset-0 z-40"
    />
  </div>
</template>
