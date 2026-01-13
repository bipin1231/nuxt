<script lang="ts" setup>
import FormField from '~/components/FormField.vue'
import { ref, reactive, watch } from 'vue'
import { useRouter } from 'vue-router'
import PasswordField from '~/components/PasswordField.vue'
import SubmitButton from '~/components/SubmitButton.vue'


const router=useRouter()

type UserFormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type UserFormError = {
  name?: string
  email?: string
  password?: string
  confirmPassword?: string
}

const userFormData = reactive<UserFormData>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

const userFormError = reactive<UserFormError>({
  name: '',
  email: '',
  password: '',
  confirmPassword: '',
})

watch(() => userFormData.name, (newName) => {
  if (newName.length < 3) userFormError.name = 'Name must be at least 3 characters long'
  else userFormError.name = ''
})

const emailTest = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
watch(() => userFormData.email, (newEmail) => {
  if (!emailTest.test(newEmail)) userFormError.email = 'Email is invalid'
  else userFormError.email = ''
})


watch(() => userFormData.password, (newPassword) => {
  if (newPassword.length < 8) userFormError.password = 'Password must be at least 8 characters long'
  else userFormError.password = ''
})

watch(() => userFormData.confirmPassword, (newConfirmPassword) => {
  if (newConfirmPassword !== userFormData.password) userFormError.confirmPassword = 'Passwords do not match'
  else userFormError.confirmPassword = ''
})

const validateForm = () => {
  if (userFormData.name.length < 3) userFormError.name = 'Name must be at least 3 characters long'
  if (!emailTest.test(userFormData.email)) userFormError.email = 'Email is invalid'
  if (userFormData.password.trim().length < 8)
    userFormError.password = 'Password must be at least 8 characters long'
  if (userFormData.confirmPassword !== userFormData.password)
    userFormError.confirmPassword = 'Passwords do not match'
}

const handleSubmit = async() => {
  validateForm()
  const hasErrors = Object.values(userFormError).some(error => error !== '')
  if (hasErrors) alert('Please fill the form correctly before submitting.')

  try {
    await $fetch('/api/signup',{
      method:'POST',
      body:userFormData
    })
     alert('Signup success!')
     router.push('/login')
    
  } catch (err: any) {
    alert(err?.data?.message || 'Error')
  }
}
</script>

<template>
  <main class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md shadow-lg p-6">
      <h1 class="text-xl font-semibold text-gray-100 mb-6 text-center">
        Create Account
      </h1>

      <form
        id="signupForm"
        @submit.prevent="handleSubmit"
        class="space-y-5"
      >
        <FormField
          label="Name"
          placeholder="enter your name"
          type="text"
          v-model="userFormData.name"
          :error="userFormError.name"
        />

        <FormField
          label="Email"
          placeholder="enter your email"
          type="text"
          v-model="userFormData.email"
          :error="userFormError.email"
        />



        <PasswordField
          label="Password"
          placeholder="Enter your password"
          type="password"
          v-model="userFormData.password"
          :error="userFormError.password"
        />

        <PasswordField
          label="Confirm Password"
          placeholder="Enter the same password"
          type="password"
          v-model="userFormData.confirmPassword"
          :error="userFormError.confirmPassword"
        />

        <SubmitButton label="Create Account" />
      </form>
    </div>
  </main>
</template>
