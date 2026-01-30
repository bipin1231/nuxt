<script setup>
import { toast } from 'vue-sonner';

definePageMeta({
  layout: 'admin',
    middleware: ['admin']
})


</script>

<template>

  <NuxtPage />
</template>
