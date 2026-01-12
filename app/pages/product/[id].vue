<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { ProductItem } from '~/types/product'

const route = useRoute()
const router = useRouter()

const productId = computed(() => route.params.id as string)

const { data: product, pending } =  useFetch<ProductItem>(
  () => `https://dummyjson.com/products/${productId.value}`
)
</script>

<template>

  <div class="min-h-screen bg-black text-white">
    <Suspense>
  <template #default>
    <div class="max-w-6xl mx-auto px-8 py-20">
      
      <p @click="router.go(-1)" class="text-sm text-gray-500 mb-12 inline-block cursor-pointer">← Back</p>

      <div v-if="pending" class="text-gray-600 text-sm">Loading...</div>

      <div v-else class="grid grid-cols-2 gap-16">
        <div>
          <NuxtImg
            :src="product?.thumbnail"
            :alt="product?.title"
            class="w-full mb-4 bg-transparent"
          />
        </div>

        <div class="pt-8">
          <h1 class="text-3xl mb-2">{{ product?.title }}</h1>
          <div class="text-2xl mb-8">${{ product?.price }}</div>
          
          <p class="text-sm text-gray-400 mb-8 leading-relaxed">
            {{ product?.description }}
          </p>

          <button class="border border-white px-6 py-3 text-sm mb-12 w-full">
            Add to cart
          </button>

          <div class="border-t border-gray-800 pt-8 space-y-3 text-sm">
            <div class="flex justify-between">
              <span class="text-gray-500">Brand</span>
              <span>{{ product?.brand }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Category</span>
              <span>{{ product?.category }}</span>
            </div>
            <div class="flex justify-between">
              <span class="text-gray-500">Stock</span>
              <span>{{ product?.stock }} units</span>
            </div>
          </div>
        </div>
      </div>
    </div>

   </template>
   

  <template #fallback>
    <p>Loading page ...</p>
  </template>
  
</Suspense>
  </div>
</template>
