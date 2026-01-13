<script lang="ts" setup>
import { ref } from 'vue'

const props = defineProps({
  label: String,
  placeholder: String,
  type: String,
  modelValue: String,
  error: String,
})

const emit = defineEmits(['update:modelValue'])

function onInput(event: Event) {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const showPassword = ref(false)
const passwordType = ref(props.type)

const handleToggle = () => {
  if (passwordType.value === 'password') passwordType.value = 'text'
  else passwordType.value = 'password'

  showPassword.value = !showPassword.value
}
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      :for="label"
      class="text-sm font-medium text-gray-300"
    >
      {{ label }}
    </label>

    <div class="relative">
      <input
        :type="passwordType"
        id="password"
        :placeholder="placeholder"
        @input="onInput"
        class="w-full rounded-md border px-3 py-2 pr-10 text-sm
               bg-gray-900 text-gray-100 placeholder-gray-500
               border-gray-700
               focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
               transition"
        :class="error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : ''"
      />

      <button
        type="button"
        class="absolute inset-y-0 right-2 flex items-center text-gray-400 hover:text-gray-200 transition"
      >
        <svg
          id="eyeOpen"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          @click="handleToggle"
          :style="{ display: showPassword ? 'none' : 'block' }"
        >
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>

        <svg
          id="eyeClosed"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          @click="handleToggle"
          v-show="showPassword"
        >
          <path d="M17.94 17.94L6.06 6.06" />
          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
          <circle cx="12" cy="12" r="3" />
        </svg>
      </button>
    </div>

    <span
      v-if="error"
      id="passwordError"
      class="text-xs text-red-400 mt-1"
    >
      {{ error }}
    </span>
  </div>
</template>
