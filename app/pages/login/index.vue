<script lang="ts" setup>
import FormField from '~/components/FormField.vue'
import { ref, reactive, watch } from 'vue'
import PasswordField from '~/components/PasswordField.vue'
import SubmitButton from '~/components/SubmitButton.vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: 'auth'
})
const {fetchUser}=useAuth()

const router = useRouter();

type UserFormData = {

  email: string

  password: string

}

type UserFormError = {

  email?: string

  password?: string
 
}

const userFormData = reactive<UserFormData>({

  email: '',

  password: '',

})

const userFormError = reactive<UserFormError>({

  email: '',

  password: '',
  
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

const validateForm = () => {
 
  if (!emailTest.test(userFormData.email)) userFormError.email = 'Email is invalid'
 
  if (userFormData.password.trim().length < 8)
    userFormError.password = 'Password must be at least 8 characters long'

}

const handleSubmit = async () => {
  validateForm()
  const hasErrors = Object.values(userFormError).some(error => error !== '')
  if (hasErrors) alert('Please fill the form correctly before submitting.')
  try {
    const res = await $fetch('/api/login', {
    method: 'POST',
    body: {
      email: userFormData.email,
      password: userFormData.password
    }
  })

    
   alert('Login success!')
   await fetchUser();
    router.push('/')
  } catch (err: any) {
    alert(err?.data?.message || 'Error')
  }


}


</script>
<template>
  <main class="min-h-screen bg-gray-950 flex items-center justify-center px-4">
    <div class="w-full max-w-md shadow-lg p-6">
      
    
      <button
        @click="router.go(-1)"
        class="text-gray-300 mb-4 hover:text-gray-100 text-sm flex items-center"
      >
        ← Back
      </button>

      <h1 class="text-xl font-semibold text-gray-100 mb-6 text-center">
        Login
      </h1>

      <form
        id="loginForm"
        @submit.prevent="handleSubmit"
        class="space-y-5"
      >
        <FormField
          label="Email"
          placeholder="Enter your email"
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

        <SubmitButton label="Login" />
      </form>


      <p class="text-gray-400 text-sm mt-4 text-center">
        Don't have an account? 
        <NuxtLink
        to="/signup"
        
          class="text-blue-400 hover:underline ml-1"
        >
          Signup
        </NuxtLink>
      </p>
    </div>
  </main>
</template>