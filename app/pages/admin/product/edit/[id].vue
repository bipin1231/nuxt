<script setup lang="ts">
import { useRoute } from 'vue-router'

interface Product {
  title: string
  price: number
  thumbnail: string
}

const route = useRoute()
const id = route.params.id as string

const title = ref('')
const price = ref(0)
let image: File | null = null

const handleImageChange = (e: Event) => {
  const target = e.target as HTMLInputElement
  if (target.files) {
    image = target.files[0]
  }
}

// Fetch product and set default values
const { data } = await useFetch<Product>(`/api/product/${id}`)

if (data.value) {
  title.value = data.value.title
  price.value = data.value.price
}

const handleSubmit = async () => {
  const formData = new FormData()
  formData.append('title', title.value)
  formData.append('price', price.value.toString())

  if (image) {
    formData.append('image', image)
  }

  await $fetch(`/api/product/${id}`, {
    method: 'PUT',
    body: formData
  })
}
</script>

<template>
        <form action="" @submit.prevent="handleSubmit">
<input type="text" placeholder="Product title" v-model="title">
<input type="number" placeholder="Product Price" v-model="price">

          <input type="file" @change="handleImageChange" placeholder="Product image" name="" id="">
          <input type="submit" name="" id="">
    </form>
</template>