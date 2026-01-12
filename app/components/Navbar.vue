<script setup lang="ts">

import { ref } from 'vue';
import { useCartStore } from '@/stores/cartStore';
const router = useRouter()
const search = ref('');
const cartStore = useCartStore();




const handleSearch = () => {
  router.push({
    path: '/',
    query: {
      search: search.value,
    },
  });
}


</script>
<template>

  <nav class="bg-black w-full text-white border-b border-gray-900">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">


      <div class="hidden md:flex items-center justify-between">
        <RouterLink to="/">
          <div class="text-xl font-light">STORE</div>
        </RouterLink>

        <form class="flex gap-2" @submit.prevent="handleSearch">
          <input v-model="search" type="text" placeholder="Search products"
            class="flex-1 max-w-md bg-black border border-gray-800 px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-700" />
          <button class="text-xs border border-white px-2 py-1" type="submit">search</button>
        </form>

        <div class="flex items-center gap-8 text-sm">
          <NuxtLink to="/" class="hover:text-gray-400">Products</NuxtLink>
          <NuxtLink to="/cart" class="relative hover:text-gray-400 inline-flex items-center">
            Cart

            <span v-if="cartStore.cart.length > 0"
              class="absolute -top-2 -right-4 text-[10px] bg-white text-black px-1.5 py-0.5 rounded-full leading-none">
              {{ cartStore.cart.length }}
            </span>
          </NuxtLink>
        </div>
      </div>


      <div class="md:hidden">

        <div class="flex items-center justify-between mb-3">
          <NuxtLink to="/">
            <div class="text-lg sm:text-xl font-light">STORE</div>
          </NuxtLink>

          <div class="flex items-center gap-4 sm:gap-6 text-sm">
            <NuxtLink to="/" class="hover:text-gray-400">Products</NuxtLink>
            <NuxtLink to="/cart" class="relative hover:text-gray-400 inline-flex items-center">
              Cart

              <span v-if="cartStore.cart.length > 0"
                class="absolute -top-2 -right-4 text-[10px] bg-white text-black px-1.5 py-0.5 rounded-full leading-none">
                {{ cartStore.cart.length }}
              </span>
            </NuxtLink>
          </div>
        </div>


        <form class="flex gap-2" @submit.prevent="handleSearch">
          <input v-model="search" type="text" placeholder="Search products"
            class="flex-1 bg-black border border-gray-800 px-3 sm:px-4 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-gray-700" />
          <button class="text-xs border border-white px-3 sm:px-4 py-1 whitespace-nowrap" type="submit">search</button>
        </form>
      </div>

    </div>
  </nav>
</template>