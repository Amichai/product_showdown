<script setup>
  import { ref } from 'vue'
  import AddProductDialog from '../components/AddProductDialog.vue'
  
  const props = defineProps({
  })

  const emit = defineEmits(['championAdded'])
  const isAddDialogOpen = ref(false)

  const add = () => {
    isAddDialogOpen.value = true
  }

  const close = () => {
    isAddDialogOpen.value = false
  }

  const championAdded = (champion) => {
    console.log(champion)

    close()
    emit('championAdded', champion)
  }

</script>

<template>
<div class="product-column">
  <AddProductDialog 
    :isOpen="isAddDialogOpen"
    @close="close"
    @championAdded="championAdded"
  />
  <img src="src/assets/AddButton.png" alt="product image" class="product-image" @click="add">
</div>
</template>

<style scoped>
.product-image {
  border: 3px solid white;
  width: 90%;
  border-radius: 0.5rem;
  margin: 1rem 0;
}

.product-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  padding-bottom: 1rem;
  width: 10rem;
}

.button {
  background-color: rgb(74, 99, 102);
  border-radius: 0.4rem;
}

.button:hover {
  background-color: rgba(74, 99, 102, 0.7);
}
</style>
