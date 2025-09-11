<script setup lang="ts">
import { onMounted } from 'vue'
import { useToast } from 'vue-toastification'
import HelloWorld from './components/HelloWorld.vue'

// Get the toast interface
const toast = useToast()

// Function to fetch ping data
const fetchPing = async () => {
  try {
    const response = await fetch('/api/ping')
    const data = await response.json()
    
    // Show success toast
    toast.success(`Pong received: ${data.pong}`)
  } catch (error) {
    // Show error toast
    toast.error('Failed to fetch ping data')
    console.error('Error fetching ping data:', error)
  }
}

// Fetch ping data when component is mounted
onMounted(() => {
  fetchPing()
})
</script>

<template>
  <div>
    <a href="https://vite.dev" target="_blank">
      <img src="/vite.svg" class="logo" alt="Vite logo" />
    </a>
    <a href="https://vuejs.org/" target="_blank">
      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />
    </a>
  </div>
  <HelloWorld msg="Vite + Vue" />
</template>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
