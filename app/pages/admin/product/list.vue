<script setup lang="ts">
definePageMeta({
  layout: 'admin',
    middleware: ['admin']
})

import { ref } from 'vue'
import { useRouter } from 'vue-router'
const router=useRouter()

interface Product {
  title: string
  price: number
  thumbnail: string
}

const products = ref<Product[]>([])
const isEditing=ref<boolean>(false) 

const fetchProduct = async () => {
  try {
    const { data } = await useFetch<Product[]>('/api/product')
    products.value = data.value || []
  } catch (error) {
    console.error(error)
  }
}

fetchProduct()
const handleEdit=(index)=>{

      router.push({
    path: `/admin/product/edit/${index}`,
  
  });
    console.log(index);
  
   
    

}
</script>


<template>
  <div class="min-h-screen bg-zinc-950 p-6">
    
    <h1 class="text-2xl font-semibold text-white mb-6">
      Products
    </h1>

    <div
      v-if="products.length === 0"
      class="text-zinc-400 bg-zinc-900 border border-zinc-800 rounded-lg p-6 text-center"
    >
      No products found
    </div>

   
    <div
      v-else
      class="overflow-x-auto rounded-xl bg-zinc-900 border border-zinc-800 shadow-lg"
    >
      <table class="w-full border-collapse text-sm text-zinc-300">
        
    
        <thead class="bg-zinc-800 text-zinc-400 uppercase text-xs">
          <tr>
            <th class="p-4 border-b border-zinc-800">#</th>
            <th class="p-4 border-b border-zinc-800">Image</th>
            <th class="p-4 border-b border-zinc-800">Title</th>
            <th class="p-4 border-b border-zinc-800">Price</th>
            <th class="p-4 border-b border-zinc-800 text-center">Actions</th>
          </tr>
        </thead>

     
        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="index"
            class="hover:bg-zinc-800/60 transition"
          >
            <td class="p-4 border-b border-zinc-800">
              {{ index + 1 }}
            </td>

            <td class="p-4 border-b border-zinc-800">
              <img
                :src="product.thumbnail"
                alt="product"
                class="w-14 h-14 rounded-lg object-cover border border-zinc-700"
              />
            </td>

            <td class="p-4 border-b border-zinc-800 font-medium text-white">
              {{ product.title }}
            </td>

            <td class="p-4 border-b border-zinc-800">
              Rs. {{ product.price }}
            </td>

            <td class="p-4 border-b border-zinc-800 text-center space-x-2">
              <button
                @click="handleEdit(index)"
                class="px-3 py-1.5 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Edit
              </button>

              <button
                class="px-3 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition"
              >
                Delete
              </button>
            </td>
          </tr>
        </tbody>

      </table>
    </div>
  </div>
</template>


