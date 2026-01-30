<script setup lang="ts">
import { toast } from 'vue-sonner'
import { ref } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Plus, X, Upload, ArrowLeft } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()
const id = route.params.id


const isCategoryDropDownOpen = ref(false)
const selectedCategory = ref<any>(null)
const isBrandDropDownOpen = ref(false)
const selectedBrand = ref<any>(null)
const { data: categories } = await useFetch('/api/admin/category')
const { data: brands = [] } = await useFetch('/api/admin/brand')
const { data: product } = await useFetch(`/api/admin/products/${id}`)
console.log("product",product);

const selectCategory = (cat: any) => {
  selectedCategory.value = cat
  isCategoryDropDownOpen.value = false

}
const selectBrand = (brand: any) => {
  selectedBrand.value = brand
  isBrandDropDownOpen.value = false

}

let dbImages = ref<string[]>([])
let removedImages = ref<string[]>([])

if (product.value) {
  dbImages.value = [...(product.value?.images || [])]
}


type ImageItem = { file: File; preview: string }
const images = ref<ImageItem[]>([])

// Initially set from DB
const currentThumbnail = ref<string | null>(product.value?.thumbnail || null)


const removeDbImage = (img: string) => {
  dbImages.value = dbImages.value.filter(i => i !== img)
  removedImages.value.push(img)

  // If thumbnail was removed, reset it
  if (currentThumbnail.value === img) {
    currentThumbnail.value = dbImages.value[0]
  }
  if (dbImages.value.length == 0) {
    currentThumbnail.value = images.value?.[0].preview
  }
}


const addImages = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return

  Array.from(files).forEach(file => {
    images.value.push({
      file,
      preview: URL.createObjectURL(file),
    })
  })

  // If no thumbnail, first new image becomes default
  if (!currentThumbnail.value && images.value.length > 0) {
    currentThumbnail.value = images.value[0].preview
  }
}

// Remove new Image
const removeImage = (index: number) => {
  const removed = images.value.splice(index, 1)[0]

  if (currentThumbnail.value === removed.preview) {
    currentThumbnail.value = images.value[0]?.preview || null
  }
}

// Set thumbnail
const setThumbnail = (index: number) => {
  // For new images
  if (images.value[index]) {
    currentThumbnail.value = images.value[index].preview
    // Move thumbnail to first position
    const img = images.value.splice(index, 1)[0]
    images.value.unshift(img)
  }
}

const updateProduct = async () => {

try {
    const formData = new FormData()

  images.value.forEach(img => formData.append('newImages', img.file))


  formData.append('removedImages', JSON.stringify(removedImages.value))
  formData.append('dbImages', JSON.stringify(dbImages.value))

  formData.append('thumbnail', currentThumbnail.value || '')

 
  formData.append('title', product.value.title)
  formData.append('description', product.value.description)
  formData.append('categoryId', selectedCategory.value?.id || '')
  formData.append('brandId', selectedBrand.value?.id || '')

  await $fetch(`/api/admin/products/${id}`, {
    method: 'PUT',
    body: formData,
  })
    toast.success('Product updated successfully')
      router.push('/admin/products')
} catch (error) {
    toast.error(error?.data?.message || 'Failed to update product')
    console.error(error)
}



}
const goBack = () => router.push('/admin/products')
</script>

<template>
  <AdminHeader title="Add product" description="Create a new product for your store" />

  <div class="p-6">
    <button @click="goBack" class="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground">
      <ArrowLeft class="h-3 w-3" />
      Back to products
    </button>
    <form @submit.prevent="updateProduct" class="mt-8 grid gap-8 lg:grid-cols-2">
    
        <div class="rounded-lg border border-border/30 bg-card p-6">
          <h2 class="text-sm font-medium">Edit Product</h2>

          <div class="mt-6 space-y-4">
            <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
              Product Name
            </label>
            <input type="text" v-model="product.title"
              class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2" />

            <DropdownField label="Category" 
            :defaultValue="product?.category"
            :items="categories" 
            :isOpen="isCategoryDropDownOpen"
              :selectedItem="selectedCategory" 
              @toggleBrandDropdown="isCategoryDropDownOpen = !isCategoryDropDownOpen"
              @selectItem="selectCategory" 
              />
            <DropdownField 
             :defaultValue="product?.brand"
            label="Brand" 
            :items="brands" 
            :isOpen="isBrandDropDownOpen" :selectedItem="selectedBrand"
              @toggleBrandDropdown="isBrandDropDownOpen = !isBrandDropDownOpen" @selectItem="selectBrand" />
            <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
              Description
            </label>
            <textarea v-model="product.description"
              class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2" />

          </div>
        </div>


        <div class="space-y-6">

          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium">Images</h2>

              <div class="mt-4 grid grid-cols-3 gap-3">


              <div v-for="img in dbImages" :key="img" class="relative aspect-square rounded-lg overflow-hidden border">
                <img :src="img" class="h-full w-full object-cover" />

                <button type="button" @click="removeDbImage(img)"
                  class="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1">
                  <X class="h-3 w-3" />
                </button>

                <button v-if="currentThumbnail !== img" type="button" @click="currentThumbnail = img"
                                 class="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                  Set thumbnail
                </button>

                <span v-if="currentThumbnail === img"
                  class="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                  Thumbnail
                </span>

              </div>


              <div v-for="(img, i) in images" :key="i"
                class="relative group aspect-square rounded-lg overflow-hidden border">
                <img :src="img.preview" class="h-full w-full object-cover" />

                <button type="button" @click="removeImage(i)"
                  class="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1">
                  <X class="h-3 w-3" />
                </button>

                <button v-if="currentThumbnail !== img.preview" type="button" @click="setThumbnail(i)"
                  class="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded">
                  Set thumbnail
                </button>

                <span v-if="currentThumbnail === img.preview"
                  class="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded">
                  Thumbnail
                </span>

              </div>

              <label
                class="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed">
                <Upload class="h-5 w-5 text-muted-foreground" />
                <input type="file" multiple accept="image/*" class="hidden" @change="addImages" />
              </label>

            </div>
          </div>


          <div class="flex justify-end gap-2 mt-4">
            <button
            @click="goBack"
              class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors">
              Cancel
            </button>
            <button type="submit"
              class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-foreground text-background transition-opacity hover:opacity-90">
              <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
              Save
            </button>
          </div>

        </div>
 

    </form>
  </div>



</template>