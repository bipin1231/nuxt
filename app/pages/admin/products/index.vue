<script setup lang="ts">
import { ref, watch,reactive } from 'vue'
import { useRoute, useRouter } from '#imports'
import AdminHeader from '~/components/admin/AdminHeader.vue'
import { Plus, Pencil, Trash2, Search, X } from 'lucide-vue-next'
import { toast } from 'vue-sonner'
import ProductVariantForm from '~/components/admin/ProductVariantForm.vue'

definePageMeta({ layout: 'admin' })
type ProductVariantForm={
  sizeId:number,
  sellingPrice:number,
  costPrice:number,
  stock:number
}

const addProductVaraintsForm =reactive({
   sizeId:null,
  sellingPrice:null,
  costPrice:null,
  stock:null


})
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
  console.log("selectedsizes",selectedSizes.value);
  
}
const selectBrand = (brand: any) => {
  selectedBrand.value = brand
  isBrandDropDownOpen.value = false

}
// search
const searchQuery = ref((route.query.search as string) || '')
watch(searchQuery, (value) => {
  router.replace({ query: { ...route.query, search: value || undefined } })
})


// products
const { data: products,refresh } = await useFetch('/api/admin/products',{
    query:{
      search:searchQuery
    }
  })




// popup state
const showVariants = ref(false)
const selectedProduct = ref<any>(null)

// variants state
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
    toast.error('Failed to fetch variants', e)
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
// close popup
const closeVariants = () => {
  showVariants.value = false
  selectedProduct.value = null
  variants.value = []
}


// Product Edit 
const showEditProductVariant = ref(false)
const editingProduct = ref<any>(null)

const showAddProductVariant = ref(false)

const openAddProductVaraints=()=>{
  console.log("selected product",selectedProduct.value);
  
  showAddProductVariant.value=true
}
const closeAddProductVaraints=()=>{
  showAddProductVariant.value=false
}




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
    console.log(error);
    
    toast.error("error"+error)
  }
}
const addProductVaraints = async () => {

console.log(editingProduct.value);

  console.log(selectedSizes.value?.id);



  const payload={
    productId:selectedProduct.value?.id,
    sizeId:selectedSizes.value?.id,
    sellingPrice:addProductVaraintsForm?.sellingPrice,
    costPrice:addProductVaraintsForm?.costPrice,
    stock:addProductVaraintsForm?.stock,
  }
  console.log("payload",payload);
  
  try{
  const res=await $fetch(`/api/admin/productVariants`, {
    method: 'POST',
    body: payload,
  })
  toast.success('Updated successfully')

    // closeEditProductVariants()
    // await fetchVariants()
}catch (err: any) {
  toast.error(err.data?.statusMessage)
}
}


const handleProductDelete=async ()=>{
  // const res=await $fetch(`/api/admin/products/${deleteModel.itemToDelete.id}`,{
  //   method:"DELETE"
  // })
  deleteModel.label=null,
deleteModel.itemToDelete=null
deleteModel.showDeleteModal=false
  refresh()
}
fetch


const deleteModel = reactive<{
  label: string | null
  showDeleteModal: boolean
  itemToDelete: any

  type: 'product' | 'variant' | null
}>({
  label: null,
  showDeleteModal: false,
  itemToDelete: null,
  type: null,
  
})

const openDeleteConfirmationModel = ({ label, itemToDelete, type }) => {
  deleteModel.label = label
  deleteModel.itemToDelete = itemToDelete
  deleteModel.type = type
  deleteModel.showDeleteModal = true

}
const closeDeleteConfirmationModel=()=>{
  deleteModel.label = null
  deleteModel.itemToDelete = null
  deleteModel.type = null
  deleteModel.showDeleteModal = false
}

const handleDelete = async () => {
  try {
    if (deleteModel.type === 'product') {
      await $fetch(`/api/admin/products/${deleteModel.itemToDelete.id}`, {
        method: 'DELETE',
      })
      toast.success('Product deleted')
      await refresh()
    }

    if (deleteModel.type === 'variant') {
      await $fetch(`/api/admin/productVariants/${deleteModel.itemToDelete.id}`, {
        method: 'DELETE',
      })
      toast.success('Variant deleted')
      await fetchVariants()
    }
  } catch (err: any) {
    toast.error(err.data?.statusMessage || 'Delete failed')
  } finally {
    deleteModel.showDeleteModal = false
    deleteModel.itemToDelete = null
    deleteModel.label = null
    deleteModel.type = null
  }
}


const handleProductVaraintDelete=async (id)=>{

  

  // const res=await $fetch(`/api/admin/productVariants/${id}`,{
  //   method:"DELETE"
  // })
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
              <th class="px-5 py-3 text-right text-xs font-normal text-muted-foreground">
                <span class="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          <tbody class="divide-y divide-border/30">
            <tr
              v-for="product in products"
              :key="product.id"
              class="group cursor-pointer hover:bg-secondary/30"
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
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    @click.stop="handleProductEdit(product.id)"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                         @click.stop="openDeleteConfirmationModel({
    label: 'Product',
    itemToDelete: product,
    type: 'product'
  })"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 class="h-3.5 w-3.5 text-destructive" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <MoreHorizontal class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
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
          <div class="flex gap-3">
       <button
       @click="openAddProductVaraints"
          class="flex items-center gap-2 rounded-lg bg-foreground px-3.5 py-1.5 text-xs text-background hover:opacity-90"
        >
          <Plus class="h-3.5 w-3.5" />
          Add product variants
        </button>
          <button @click="closeVariants">
            <X class="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
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
              <tr class="group" v-for="variant in variants" :key="variant.id">
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



               <td class=" py-2 text-right">
                <div class="flex items-center justify-end gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                  <button
                    type="button"
                    @click="openEditProductVariants(variant)"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <Pencil class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
  @click="openDeleteConfirmationModel({
    label: 'Product Variant',
    itemToDelete: variant,
    type: 'variant'
  })"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <Trash2 class="h-3.5 w-3.5 text-destructive" stroke-width="1.5" />
                  </button>
                  <button
                    type="button"
                    class="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
                  >
                    <MoreHorizontal class="h-3.5 w-3.5" stroke-width="1.5" />
                  </button>
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


   <ProductVariantForm
   label="Edit"
   :productVar="editingProduct"
   :openForm="showEditProductVariant"
   :sizes="sizes"
   :selectedSizes="selectedSizes"
   @selectItem="selectSizes"
   @closeForm="closeEditProductVariants"
   @handleSubmit="updateProductVaraints"
   />

   <ProductVariantForm
   label="Add"
   :productVar="addProductVaraintsForm"
   :openForm="showAddProductVariant"
   :sizes="sizes"
   :selectedSizes="selectedSizes"
   @selectItem="selectSizes"
   @closeForm="closeAddProductVaraints"
   @handleSubmit="addProductVaraints"
   />

   <DeleteConfirmationModal
   :showDeleteModal="deleteModel.showDeleteModal"
   :label="deleteModel.label"
   :itemToDelete="deleteModel.itemToDelete"
@handleDelete="handleDelete"
@cancelModal="closeDeleteConfirmationModel"
   />



  </div>
</template>
