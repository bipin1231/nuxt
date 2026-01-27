<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-vue-next'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()

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
}
const selectBrand = (brand: any) => {
  selectedBrand.value = brand
  isBrandDropDownOpen.value = false

}


/* PRODUCTS */
const { data: products } = await useFetch('/api/admin/products')

/* SEARCH */
const searchQuery = ref((route.query.search as string) || '')

/* POPUP STATE */
const showVariants = ref(false)
const selectedProduct = ref<any>(null)

/* VARIANTS STATE */
const variants = ref<any[]>([])
const loadingVariants = ref(false)

/* OPEN POPUP + FETCH VARIANTS */
const openVariants = async (product: any) => {
  selectedProduct.value = product
  showVariants.value = true
  loadingVariants.value = true

  try {
    const res = await $fetch('/api/admin/productVariants', {
      query: { productId: product.id },
    })
    variants.value = res
  } catch (e) {
    console.error('Failed to fetch variants', e)
    variants.value = []
  } finally {
    loadingVariants.value = false
  }
}

/* CLOSE POPUP */
const closeVariants = () => {
  showVariants.value = false
  selectedProduct.value = null
  variants.value = []
}

/* WATCH SEARCH */
watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})

// Product Edit 
const showEditProduct = ref(false)
const editingProduct = ref<any>(null)

  // images already in DB (string URLs)
const dbImages = ref<string[]>([])

// newly selected files
const newImages = ref<File[]>([])

// DB images user wants to delete
const removedImages = ref<string[]>([])

const openEditProduct = (product: any) => {
  editingProduct.value = { ...product }

  selectedCategory.value = product.category
  selectedBrand.value = product.brand

  // DB images only (string URLs)
  dbImages.value = [...(product.images || [])]

  newImages.value = []
  removedImages.value = []

  showEditProduct.value = true
}

const onNewImagesChange = (e: Event) => {
  const files = Array.from(
    (e.target as HTMLInputElement).files || []
  )
  newImages.value.push(...files)
}

const removeDbImage = (img: string) => {
  dbImages.value = dbImages.value.filter(i => i !== img)
  removedImages.value.push(img)
}

const removeNewImage = (index: number) => {
  newImages.value.splice(index, 1)
}


const closeEditProduct = () => {
  showEditProduct.value = false
  editingProduct.value = null
}
const updateProduct = async () => {

  console.log(selectedCategory.value);
  console.log(selectedBrand.value);
  console.log(editingProduct.value);
  
  // await $fetch(`/api/admin/products/${editingProduct.value.id}`, {
  //   method: 'PUT',
  //   body: editingProduct.value,
  // })
  // closeEditProduct()
  // refresh()
}

const handleProductEdit=(id)=>{
  router.push(`/admin/products/edit/${id}`)
 
}
</script>

<template>
  <div class="min-h-screen bg-background">
    <AdminHeader
      title="Products"
      :description="`${products?.length || 0} products in your catalog`"
    >
      <template #actions>
        <NuxtLink
          to="/admin/products/new"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" />
          Add product
        </NuxtLink>
      </template>
    </AdminHeader>

    <div class="p-6">
      <!-- Search -->
      <div class="relative max-w-xs">
        <Search class="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="searchQuery"
          placeholder="Search products..."
          class="w-full rounded-lg border border-border/50 bg-background py-2 pl-9 pr-4 text-sm focus:outline-none"
        />
      </div>

      <!-- PRODUCTS TABLE  -->
      <div class="mt-6 rounded-lg border border-border/30 bg-card">
        <table class="w-full">
          <thead>
            <tr class="border-b border-border/30">
              <th class="px-5 py-3 text-left text-xs text-muted-foreground">Product</th>
              <th class="hidden px-5 py-3 sm:table-cell text-left text-xs text-muted-foreground">
                Category
              </th>
              <th class="hidden px-5 py-3 md:table-cell text-right text-xs text-muted-foreground">
                Brand
              </th>
              <th class="px-5 py-3 text-right text-xs text-muted-foreground">Description</th>
              <th class="px-5 py-3 text-right"></th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr
              v-for="product in products"
              :key="product.id"
              class="cursor-pointer hover:bg-secondary/30"
              @click="openVariants(product)"
            >
              <td class="px-5 py-4">
                <div class="flex items-center gap-4">
                  <img
                    :src="product.thumbnail || '/placeholder.svg'"
                    class="h-10 w-10 rounded-md object-cover"
                  />
                  <div>
                    <p class="text-sm">{{ product.title }}</p>
                    <p class="text-xs text-muted-foreground md:hidden">
                      ${{ product.price }}
                    </p>
                  </div>
                </div>
              </td>

              <td class="hidden px-5 py-4 sm:table-cell text-sm text-muted-foreground">
                {{ product.category }}
              </td>

              <td class="hidden px-5 py-4 md:table-cell text-sm text-muted-foreground text-right">
              {{ product?.brand }}
              </td>

              <td class="px-5 py-4 text-right text-xs text-muted-foreground">
                {{ product?.description }}
              </td>

              <td class="px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <Pencil
                  @click.stop="handleProductEdit(product.id)"
                  class="h-4 w-4 text-muted-foreground" />
                  <Trash2 class="h-4 w-4 text-destructive" />
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- VARIANTS POPUP -->
    <div
      v-if="showVariants"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-3xl rounded-xl bg-card shadow-xl">
        <!-- Header -->
        <div class="flex items-center justify-between border-b px-6 py-4">
          <div>
            <h3 class="text-sm font-medium">
              Variants — {{ selectedProduct?.title }}
            </h3>
            <p class="text-xs text-muted-foreground">
              Product variant details
            </p>
          </div>
          <button @click="closeVariants">
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <!-- Content -->
        <div class="p-6">
          <!-- Loading -->
          <p v-if="loadingVariants" class="text-sm text-muted-foreground">
            Loading variants…
          </p>

          <!-- Table -->
          <table v-else-if="variants.length" class="w-full">
            <thead>
              <tr class="border-b border-border/30">
                <th class="py-2 text-left text-xs text-muted-foreground">Size</th>
                <th class="py-2 text-right text-xs text-muted-foreground">Selling</th>
                <th class="py-2 text-right text-xs text-muted-foreground">Cost</th>
                <th class="py-2 text-right text-xs text-muted-foreground">Stock</th>
              </tr>
            </thead>

            <tbody class="divide-y divide-border/20">
              <tr v-for="variant in variants" :key="variant.id">
                <td class="py-2 text-sm">{{ variant.size }}</td>
                <td class="py-2 text-right text-sm">
                  Rs.{{ variant.sellingPrice }}
                </td>
                <td class="py-2 text-right text-sm text-muted-foreground">
                  Rs.{{ variant.costPrice }}
                </td>
                <td class="py-2 text-right text-sm">
                  {{ variant.stock }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Empty -->
          <p
            v-else
            class="py-6 text-center text-sm text-muted-foreground"
          >
            No variants found for this product
          </p>
        </div>
      </div>
    </div>

    <!-- Edit Product Popup -->
  
    <div
      v-if="showEditProduct"
      @click.self="showEditProduct=!showEditProduct"
 class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-md rounded-xl bg-card shadow-xl border border-border/40 p-6">
        <div class="flex justify-between mb-4">
          <h3 class="text-sm font-medium">Edit Product</h3>
          <button @click="closeEditProduct">
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div class="space-y-4">
           <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Product Name
        </label>
        <input

          type="text"
          v-model="editingProduct.title"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
        <DropdownField
          label="Category"
          :items="categories"
          :isOpen="isCategoryDropDownOpen"
          :selectedItem="selectedCategory"
         @toggleBrandDropdown="isCategoryDropDownOpen=!isCategoryDropDownOpen" 
         @selectItem="selectCategory"
          />
          <DropdownField
          label="Brand"
          :items="brands"
          :isOpen="isBrandDropDownOpen"
          :selectedItem="selectedBrand"
         @toggleBrandDropdown="isBrandDropDownOpen=!isBrandDropDownOpen" 
         @selectItem="selectBrand"
          />
        <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
         Description
        </label>
          <textarea
            v-model="editingProduct.description"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
<!-- IMAGES -->
<div class="rounded-lg border border-border/30 bg-card p-6">
  <h2 class="text-sm font-medium">Images</h2>

  <div class="mt-4 grid grid-cols-3 gap-3">

    <!-- DB IMAGES -->
    <div
      v-for="(img, i) in dbImages"
      :key="'db-' + i"
      class="relative aspect-square rounded-lg overflow-hidden border"
    >
      <img :src="img" class="h-full w-full object-cover" />

      <button
        type="button"
        @click="removeDbImage(img)"
        class="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
      >
        <X class="h-3 w-3" />
      </button>

      <span
        v-if="i === 0"
        class="absolute bottom-1 left-1 text-xs bg-green-600 text-white px-2 py-0.5 rounded"
      >
        Thumbnail
      </span>
    </div>

    <!-- NEW IMAGES -->
    <div
      v-for="(file, i) in newImages"
      :key="'new-' + i"
      class="relative aspect-square rounded-lg overflow-hidden border"
    >
      <img
        :src="URL.createObjectURL(file)"
        class="h-full w-full object-cover"
      />

      <button
        type="button"
        @click="removeNewImage(i)"
        class="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
      >
        <X class="h-3 w-3" />
      </button>
    </div>

    <!-- ADD IMAGE -->
    <label
      class="flex aspect-square cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed"
    >
      <Plus class="h-5 w-5 text-muted-foreground" />
      <input
        type="file"
        multiple
        accept="image/*"
        class="hidden"
        @change="onNewImagesChange"
      />
    </label>
  </div>
</div>


                  <div class="flex justify-end gap-2 mt-4">
          <button
            @click="$emit('cancelModal')"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="updateProduct"
            class="flex items-center gap-2 px-3.5 py-1.5 text-xs rounded-lg bg-foreground text-background transition-opacity hover:opacity-90"
          >
            <Plus class="h-3.5 w-3.5" stroke-width="1.5" />
            Save
          </button>
        </div>

        </div>
      </div>
    </div>


  </div>
</template>
