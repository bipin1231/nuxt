<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from '#imports'
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Users,
  Settings,
  Menu,
  ChevronLeft,
  User2Icon
} from 'lucide-vue-next'

const route = useRoute()


const props = defineProps({
  modelValue: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue'])


const collapsed = computed({
  get: () => props.modelValue,
  set: (val: boolean) => emit('update:modelValue', val),
})

// Toggle function
const toggle = () => {
  collapsed.value = !collapsed.value
}

const navigation = [
  { name: 'Overview', href: '/admin', icon: LayoutDashboard },
  { name: 'Products', href: '/admin/products', icon: Package },
  // { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
  { name: 'Product Config', href: '/admin/product-config/category', icon: ShoppingCart },
  { name: 'Customers', href: '/admin/customers', icon: Users },
  { name: 'Users', href: '/admin/users', icon: User2Icon },
    
  // { name: 'Settings', href: '/admin/settings', icon: Settings },
]

// Check active route
const isActive = (href: string) => {
  if (href === '/admin') return route.path === '/admin'
  return route.path.startsWith(href)
}
</script>

<template>
  <aside
    :class="[
      'fixed top-0 left-0 h-screen flex flex-col border-r border-border/30 bg-sidebar transition-all duration-300 ease-in-out z-50',
      collapsed ? 'w-16' : 'w-56'
    ]"
  >
   
    <div class="flex h-14 items-center justify-between px-3">
      <transition name="fade-slide" mode="out-in">
        <NuxtLink
          v-if="!collapsed"
          key="logo"
          to="/admin"
          class="font-serif text-lg tracking-wide text-foreground"
        >
          Store
        </NuxtLink>
      </transition>

      <button
        class="p-1 rounded hover:bg-sidebar-accent/50 transition-colors"
        @click="toggle"
        :title="collapsed ? 'Expand' : 'Collapse'"
      >
        <component :is="collapsed ? Menu : ChevronLeft" class="h-4 w-4" stroke-width="1.5" />
      </button>
    </div>


    <nav class="flex-1 px-1 py-4 overflow-y-auto">
      <ul class="space-y-1">
        <li v-for="item in navigation" :key="item.name">
          <NuxtLink
            :to="item.href"
            class="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors"
            :class="isActive(item.href)
              ? 'bg-sidebar-accent text-sidebar-foreground'
              : 'text-muted-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-foreground'"
          >
            <component :is="item.icon" class="h-4 w-4" :stroke-width="1.5" />
            <transition name="fade-slide">
              <span v-if="!collapsed" key="label">{{ item.name }}</span>
            </transition>
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>

.fade-slide-enter-active,
.fade-slide-leave-active {
   transition: opacity 0.1s ease, transform 0.1s ease;
 
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateX(-10px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateX(0);
}
</style>
