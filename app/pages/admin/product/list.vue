<script setup lang="ts">
definePageMeta({
  layout: 'admin',
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
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-4">Products</h1>

    <div v-if="products.length === 0" class="text-gray-500">
      No products found
    </div>

    <div v-else class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="w-full border-collapse">
        <thead class="bg-gray-100 text-left">
          <tr>
            <th class="p-3 border-b">#</th>
            <th class="p-3 border-b">Image</th>
            <th class="p-3 border-b">Title</th>
            <th class="p-3 border-b">Price</th>
            <th class="p-3 border-b text-center">Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="(product, index) in products"
            :key="index"
            class="hover:bg-gray-50"
          >
            <td class="p-3 border-b">
              {{ index + 1 }}
            </td>

            <td class="p-3 border-b">
              <img
                :src="product.thumbnail"
                alt="product"
                class="w-16 h-16 object-cover rounded"
              />
            </td>

            <td class="p-3 border-b font-medium">
              {{ product.title }}
            </td>

            <td class="p-3 border-b">
              Rs. {{ product.price }}
            </td>

            <td class="p-3 border-b text-center space-x-2">
              <button
            
              @click="handleEdit(index)"
                class="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Edit
              </button>


              
              <button
                class="px-3 py-1 text-sm bg-red-500 text-white rounded hover:bg-red-600"
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

