<script setup lang="ts">
import { ref, computed, reactive } from 'vue'
import { useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import {
  ArrowLeft,
  Upload,
  X,
  ChevronDown,
  Check,
  Image as ImageIcon
} from 'lucide-vue-next'
import DropdownField from '~/components/DropdownField.vue'

definePageMeta({ layout: 'admin' })


const router = useRouter()


const productName = ref('')
const description = ref('')

//category
const isCategoryDropDownOpen = ref(false)
const selectedCategory = ref<any>(null)
 
const isBrandDropDownOpen=ref(false)  
const selectedBrand = ref<any>(null)
const { data: categories } = await useFetch('/api/admin/category')
const { data: sizes } = await useFetch('/api/admin/sizes')
const { data: brands=[]} = await useFetch('/api/admin/brand')

const selectCategory = (cat: any) => {
  selectedCategory.value = cat
  isCategoryDropDownOpen.value = false
  selectedSizes.value = {}
}
const selectBrand = (brand: any) => {
  selectedBrand.value = brand
  isBrandDropDownOpen.value = false

}

// sizes
type SizeInput = {
  sizeId: number | null
  sellingPrice: number | null
  costPrice: number | null
  stock: number | null
}

const selectedSizes = ref<Record<number, SizeInput>>({})

const filteredSizes = computed(() => {
  if (!selectedCategory.value) return []
  return sizes.value?.filter(
    (s: any) => s.categoryId === selectedCategory.value.id
  )
})


const toggleSize = (size: any) => {
  if (selectedSizes.value[size.id]) {
    delete selectedSizes.value[size.id]
  } else {
    selectedSizes.value[size.id] = {
      sizeId: size.id,
      sellingPrice: null,
      costPrice: null,
      stock: null,
    }
  }
}

//images
type ImageItem = {
  file: File
  preview: string
}

const images = ref<ImageItem[]>([])

const addImages = (e: Event) => {
  const files = (e.target as HTMLInputElement).files
  if (!files) return

  Array.from(files).forEach(file => {
    images.value.push({
      file,
      preview: URL.createObjectURL(file),
    })
  })
}

const removeImage = (index: number) => {
  images.value.splice(index, 1)
}

const setThumbnail = (index: number) => {
  const img = images.value.splice(index, 1)[0]
  images.value.unshift(img)
}


//create product
const createProduct = async() => {
  console.log({
    productName: productName.value,
    description: description.value,
    category: selectedCategory.value,
    images: images.value,
    productVariants: selectedSizes.value,
  })
 const formData=new FormData()
 formData.append("title",productName.value)
  formData.append("description",description.value)
  formData.append("categoryId",selectedCategory.value.id)
   formData.append("brandId",selectedBrand.value.id)
    images.value.forEach(img => {
    formData.append('images', img.file)
  })

  formData.append(
    'productVariants',
    JSON.stringify(Object.values(selectedSizes.value))
  )

  const res=await $fetch('/api/admin/products',{
    method:"POST",
    body:formData
  })
}

const goBack = () => router.push('/admin/products')
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminHeader
      title="Add product"
      description="Create a new product for your store"
    />

    <div class="p-6">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft class="h-3 w-3" />
        Back to products
      </button>

      <form
        @submit.prevent="createProduct"
        class="mt-8 grid gap-8 lg:grid-cols-3"
      >
        
        <div class="lg:col-span-2 space-y-6">
       
          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium">Product information</h2>

            <div class="mt-6 space-y-4">
              <div>
                <label class="text-xs text-muted-foreground">Product name</label>
                <input
                  v-model="productName"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm"
                />
              </div>

              <!-- CATEGORY -->
              <!-- <div>
                <label class="text-xs text-muted-foreground">Category</label>
                <div class="relative mt-1.5">
                  <button
                    type="button"
                    @click="isOpen = !isOpen"
                    class="w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-left text-sm flex justify-between"
                  >
                    <span>
                      {{ selectedCategory?.title || 'Select category' }}
                    </span>
                    <ChevronDown
                      class="h-4 w-4 transition-transform"
                      :class="{ 'rotate-180': isOpen }"
                    />
                  </button>

                  <div
                    v-if="isOpen"
                    class="absolute z-50 mt-2 w-full rounded-lg border bg-card shadow"
                  >
                    <button
                      v-for="cat in categories"
                      :key="cat.id"
                      type="button"
                      @click="selectCategory(cat)"
                      class="w-full px-4 py-2 text-sm text-left hover:bg-muted flex justify-between"
                    >
                      {{ cat.title }}
                      <Check
                        v-if="selectedCategory?.id === cat.id"
                        class="h-4 w-4"
                      />
                    </button>
                  </div>
                </div>
              </div> -->
              
                <DropdownField
          label="Category"
          :items="categories"
          :isOpen="isCategoryDropDownOpen"
          :selectedItem="selectedCategory"
         @toggleBrandDropdown="isCategoryDropDownOpen=!isCategoryDropDownOpen" 
         @selectItem="selectCategory"
          />
              
              <!-- SIZES -->
          <div
            v-if="filteredSizes.length"
            class="rounded-lg border border-border/30 bg-card p-6"
          >
            <h2 class="text-sm font-medium">Sizes</h2>

            <div class="mt-4 space-y-4">
              <div
                v-for="size in filteredSizes"
                :key="size.id"
                class="rounded-lg border border-border/50 p-4"
              >
                <label class="flex items-center gap-3">
                  <input
                    type="checkbox"
                    :checked="!!selectedSizes[size.id]"
                    @change="toggleSize(size)"
                  />
                  <span class="font-medium">{{ size.title }}</span>
                </label>

                <div
                  v-if="selectedSizes[size.id]"
                  class="mt-4 grid gap-4 sm:grid-cols-3"
                >
                  <input
                    type="number"
                    placeholder="Selling price"
                    v-model.number="selectedSizes[size.id].sellingPrice"
                    class="rounded-lg border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Cost price"
                    v-model.number="selectedSizes[size.id].costPrice"
                    class="rounded-lg border px-3 py-2 text-sm"
                  />
                  <input
                    type="number"
                    placeholder="Stock"
                    v-model.number="selectedSizes[size.id].stock"
                    class="rounded-lg border px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <DropdownField
          label="Brand"
          :items="brands"
          :isOpen="isBrandDropDownOpen"
          :selectedItem="selectedBrand"
         @toggleBrandDropdown="isBrandDropDownOpen=!isBrandDropDownOpen" 
         @selectItem="selectBrand"
          />

              <div>
                <label class="text-xs text-muted-foreground">Description</label>
                <textarea
                  v-model="description"
                  rows="4"
                  class="mt-1.5 w-full rounded-lg border border-border/50 bg-background px-4 py-2.5 text-sm"
                />
              </div>
            </div>
          </div>


        </div>

     
        <div class="space-y-6">

          <div class="rounded-lg border border-border/30 bg-card p-6">
            <h2 class="text-sm font-medium">Images</h2>

            <div class="mt-4 grid grid-cols-3 gap-3">
              <div
                v-for="(img, i) in images"
                :key="i"
                class="relative group aspect-square rounded-lg overflow-hidden border"
              >
                <img :src="img.preview" class="h-full w-full object-cover" />

                <button
                  type="button"
                  @click="removeImage(i)"
                  class="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                >
                  <X class="h-3 w-3" />
                </button>

                <button
                  v-if="i !== 0"
                  type="button"
                  @click="setThumbnail(i)"
                  class="absolute bottom-1 left-1 text-xs bg-black/70 text-white px-2 py-0.5 rounded"
                >
                  Set thumbnail
                </button>

                <span
                  v-else
                  class="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded"
                >
                  Thumbnail
                </span>
              </div>

              <label
                class="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed"
              >
                <Upload class="h-5 w-5 text-muted-foreground" />
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  class="hidden"
                  @change="addImages"
                />
              </label>
            </div>
          </div>

     
          <button
            type="submit"
            class="w-full rounded-lg bg-foreground py-2.5 text-sm text-background"
          >
            Create product
          </button>

          <button
            type="button"
            @click="goBack"
            class="w-full rounded-lg border py-2.5 text-sm text-muted-foreground"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
