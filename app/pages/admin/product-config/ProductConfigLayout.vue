<script setup lang="ts">
import { ref } from 'vue'
import { useRouter, useRoute } from '#imports'

const router = useRouter()
const route = useRoute()

const buttons = [
  { name: 'Category', href: '/admin/product-config/category' },
  { name: 'Brand', href: '/admin/product-config/brand' },
  { name: 'Size', href: '/admin/product-config/size' },
]

const navigate = (href: string) => {
  router.push(href)
}

const isActive = (href: string) => route.path === href
</script>

<template>
  <div class="bg-card p-4 rounded-lg flex gap-4 border border-border/30 mb-6">
    <button
      v-for="btn in buttons"
      :key="btn.name"
      @click="navigate(btn.href)"
      :class="[
        'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
        isActive(btn.href) ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80'
      ]"
    >
      {{ btn.name }}
    </button>
  </div>

  <!-- Slot for page content -->
  <slot />
</template>
