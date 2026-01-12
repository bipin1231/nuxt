<script setup lang="ts">
import type { ProductItem } from '@/types/product';
defineProps<{
  product: ProductItem
}>()

</script>
<template>
      <div
  class="hover:bg-gray-900 p-4 border-2 rounded-3xl border-gray-800"
>
  <RouterLink :to="`/product/${product.id}`">
    <NuxtImg
      :src="product.thumbnail"
      :alt="product.title"
      class="w-full mb-3 bg-transparent object-cover"
    />
    <div class="text-sm mb-1">{{ product.title }}</div>
    <div class="text-sm text-gray-500 mb-2">
      ${{ product.price }}
    </div>
  </RouterLink>

  <button
    @click="$emit('addToCart', product)"
    class="text-xs border border-white px-3 py-1 mt-2"
  >
    Add to cart
  </button>
</div>

</template>