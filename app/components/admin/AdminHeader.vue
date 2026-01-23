<script setup lang="ts">

import { Search, Bell } from 'lucide-vue-next'

interface AdminHeaderProps {
  title: string
  description?: string
  actions?: any
}

const props = defineProps<AdminHeaderProps>()
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-border/30 px-6">

    <div>
      <h1 class="text-sm font-medium text-foreground">{{ props.title }}</h1>
      <p v-if="props.description" class="text-xs text-muted-foreground">{{ props.description }}</p>
    </div>

   
    <div class="flex items-center gap-4">
    
      <slot name="actions">
       
      </slot>

      <div class="flex items-center gap-2">
     
        <button
          type="button"
          class="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Search class="h-4 w-4" stroke-width="1.5" />
        </button>

     
        <button
          type="button"
          class="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
        >
          <Bell class="h-4 w-4" stroke-width="1.5" />
          <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>
      </div>
    </div>
  </header>
</template>
