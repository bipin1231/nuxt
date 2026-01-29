<script setup lang="ts">
import { ref } from 'vue'
import { Search, Bell, User, LogOut } from 'lucide-vue-next'

interface AdminHeaderProps {
  title: string
  description?: string
  actions?: any
}

const props = defineProps<AdminHeaderProps>()

const showMenu = ref(false)

const toggleMenu = () => {
  showMenu.value = !showMenu.value
}

const logout = () => {
  console.log('logout')
}
</script>

<template>
  <header class="flex h-14 items-center justify-between border-b border-border/30 px-6">

    <div>
      <h1 class="text-sm font-medium text-foreground">
        {{ props.title }}
      </h1>
      <p
        v-if="props.description"
        class="text-xs text-muted-foreground"
      >
        {{ props.description }}
      </p>
    </div>

  
    <div class="flex items-center gap-4">
      <slot name="actions" />

      <div class="flex items-center gap-2">


   
        <button
          class="relative flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition hover:bg-secondary hover:text-foreground"
        >
          <Bell class="h-4 w-4" stroke-width="1.5" />
          <span class="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-accent" />
        </button>

       
        <div class="relative">
          <button
            @click="toggleMenu"
            class="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-xs font-medium text-foreground transition hover:ring-2 hover:ring-border"
          >
            BA
          </button>

          <div
            v-if="showMenu"
            class="absolute right-0 top-10 z-50 w-40 rounded-lg border border-border bg-white shadow-md"
          >
            <button
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <User class="h-4 w-4" />
              Profile
            </button>

            <button
              @click="logout"
              class="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10"
            >
              <LogOut class="h-4 w-4" />
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>
