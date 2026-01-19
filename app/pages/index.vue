<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import type { ProductItem, ProductResponse } from '@/types/product'
import ProductCard from '@/components/ProductCard.vue'
import { useCartStore } from '@/stores/cartStore'

definePageMeta({
  middleware: ['role-redirect']
})


const route = useRoute()
const router = useRouter()

const searchQuery = computed(() => route.query.search as string | undefined)
const title = computed(() => route.query.title as string | undefined)
const order = computed(() => route.query.order as string | undefined)

const sortOrder = ref('')
const limit = ref(20)
const skip = ref(0)
const isAppending = ref(false)

const cartStore = useCartStore()


const buildUrl = () => {
  if (searchQuery.value && title.value && order.value) {
    return `https://dummyjson.com/products/search?q=${searchQuery.value}&sortBy=${title.value}&order=${order.value}&limit=${limit.value}&skip=${skip.value}`
  }

  if (title.value && order.value) {
    return `https://dummyjson.com/products?sortBy=${title.value}&order=${order.value}&limit=${limit.value}&skip=${skip.value}`
  }

  if (searchQuery.value) {
    return `https://dummyjson.com/products/search?q=${searchQuery.value}&limit=${limit.value}&skip=${skip.value}`
  }

  return `https://dummyjson.com/products?limit=${limit.value}&skip=${skip.value}`
}


const {
  data: products,
  pending,
  refresh
} =   useFetch<ProductResponse>(() => {
  return buildUrl().replace(`skip=${skip.value}`, 'skip=0')
}, {
  watch: [searchQuery, title, order],
  default: () => ({
    products: [],
    total: 0
  })
})


watch([searchQuery, title, order], async () => {
  skip.value = 0
  await refresh()
})

const handleLoadMore = async () => {
  if (!products.value) return
  if (products.value.products.length >= products.value.total) return

  isAppending.value = true
  skip.value += limit.value

  const data = await $fetch<ProductResponse>(buildUrl())
    console.log("before appending",products.value);
    console.log("before appending",data);
    
  products.value.products.push(...data.products)

  isAppending.value = false
  console.log("After appending",products.value);
}


const handleSort = () => {
  if (!sortOrder.value) return

  const [t, o] = sortOrder.value.split('-')

  router.push({
    query: {
      ...route.query,
      title: t,
      order: o
    }
  })
}


const addToCart = (product: ProductItem) => {
  cartStore.addToCart(product)
  alert(product.title + ' added to cart')
}
</script>

<template>
  <div class="min-h-screen bg-black text-white">
    <div class="max-w-6xl mx-auto px-4 py-16">

    <h1 class="text-2xl mb-10">Products</h1>

    <div class="flex justify-between mb-6">
      <select v-model="sortOrder" @change="handleSort" class="border px-3 py-2 bg-black text-white">
        <option value="">Sort by</option>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
      </select>
      <p class="text-sm text-gray-400">
        showing {{ products?.products.length }} of {{ products?.total }}
      </p>
    </div>
     <div v-if="pending">Loading products...</div>

    <div  
    v-else
    class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
      <ProductCard
        v-for="product in products?.products"
        :key="product.id"
        :product="product"
        @addToCart="addToCart"
      />
    </div>

    <div class="flex justify-center mt-10">
      <button
        v-if="products && products.products.length < products.total"
        @click="handleLoadMore"
        :disabled="isAppending"
        class="border px-6 py-2"
      >
        {{ isAppending ? 'Loading...' : 'Load More' }}
      </button>

      <p v-else-if="!pending" class="text-sm text-gray-500">No more products available</p>
    </div>


    </div>
  </div>
</template>
