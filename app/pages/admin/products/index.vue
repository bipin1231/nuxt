<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'

definePageMeta({ layout: 'admin' })

const route = useRoute()
const router = useRouter()

const isSizesDropDownOpen = ref(false)
const selectedSizes = ref<any>(null)
 
const isBrandDropDownOpen=ref(false)  
const selectedBrand = ref<any>(null)
const { data: categories } = await useFetch('/api/admin/category')
const { data: sizes } = await useFetch('/api/admin/sizes')
const { data: brands=[]} = await useFetch('/api/admin/brand')

const selectSizes = (cat: any) => {
  selectedSizes.value = cat
  isSizesDropDownOpen.value = false
}
const selectBrand = (brand: any) => {
  selectedBrand.value = brand
  isBrandDropDownOpen.value = false

}


/* PRODUCTS */
const { data: products,refresh } = await useFetch('/api/admin/products')

/* SEARCH */
const searchQuery = ref((route.query.search as string) || '')

/* POPUP STATE */
const showVariants = ref(false)
const selectedProduct = ref<any>(null)

/* VARIANTS STATE */
const variants = ref<any[]>([])
const loadingVariants = ref(false)
const fetchVariants = async () => {
  if (!selectedProduct.value) return

  loadingVariants.value = true
  try {
    const res = await $fetch('/api/admin/productVariants', {
      query: { productId: selectedProduct.value.id },
    })
    variants.value = res
  } catch (e) {
    console.error('Failed to fetch variants', e)
    variants.value = []
  } finally {
    loadingVariants.value = false
  }
}


const openVariants = async (product: any) => {
  selectedProduct.value = product
  showVariants.value = true
  await fetchVariants()
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
const showEditProductVariant = ref(false)
const editingProduct = ref<any>(null)



const openEditProductVariants = (productVariants: any) => {
  editingProduct.value = { ...productVariants }

  selectedSizes.value = productVariants.size
 

  showEditProductVariant.value = true
}



const closeEditProductVariants = () => {
  showEditProductVariant.value = false
  editingProduct.value = null
}
const updateProductVaraints = async () => {

console.log(editingProduct.value);

  console.log(selectedSizes.value?.id);

  const payload={
    sizeId:selectedSizes.value?.id,
    sellingPrice:editingProduct.value.sellingPrice,
    costPrice:editingProduct.value.costPrice,
    stock:editingProduct.value.stock,
  }
  
  try{
  const res=await $fetch(`/api/admin/productVariants/${editingProduct.value.id}`, {
    method: 'PUT',
    body: payload,
  })
  toast.success('Updated successfully')

    closeEditProductVariants()
    await fetchVariants()
  }catch(error){
    toast.error("error",error)
  }


  
  // closeEditProductVariants()
  // refresh()
}
const handleProductDelete=async (id)=>{
  const res=await $fetch(`/api/admin/products/${id}`,{
    method:"DELETE"
  })
  refresh()
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
                  <Trash2 
                    @click.stop="handleProductDelete(product.id)"
                  class="h-4 w-4 text-destructive" />
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
                              <td class="px-5 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <Pencil
                  @click="openEditProductVariants(variant)"
                  class="h-4 w-4 text-muted-foreground" />
                  <Trash2 
                   
                  class="h-4 w-4 text-destructive" />
                </div>
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
      v-if="showEditProductVariant"
      @click.self="closeEditProductVariants"
 class="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
    >
      <div class="w-full max-w-md rounded-xl bg-card shadow-xl border border-border/40 p-6">
        <div class="flex justify-between mb-4">
          <h3 class="text-sm font-medium">Edit Product</h3>
          <button @click="closeEditProductVariants">
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>

        <div class="space-y-4">

        <DropdownField
          label="Sizes"
          :items="sizes"
          :defaultValue="editingProduct.size"
          :isOpen="isSizesDropDownOpen"
          :selectedItem="selectedSizes"
         @toggleBrandDropdown="isSizesDropDownOpen=!isSizesDropDownOpen" 
         @selectItem="selectSizes"
          />

        <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Selling Price
        </label>
        <input

          type="number"
          v-model="editingProduct.sellingPrice"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
                   <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
          Cost Price
        </label>
        <input

          type="number"
          v-model="editingProduct.costPrice"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />
           <label class="block text-xs font-medium text-muted-foreground mb-1" for="category">
         Stock
        </label>
        <input

          type="number"
          v-model="editingProduct.stock"
          class="w-full rounded-lg border border-border/50 bg-background py-2 px-4 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-1 focus:ring-foreground/10 focus:border-foreground/20 mb-2"
        />




        <div class="flex justify-end gap-2 mt-4">
          <button
            @click="showEditProductVariant=!showEditProductVariant"
            class="px-3 py-1.5 text-xs rounded-lg bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="updateProductVaraints"
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
