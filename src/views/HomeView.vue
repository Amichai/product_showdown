<script setup>
  import { ref, computed } from 'vue'
  import LoadingDialog from '../components/LoadingDialog.vue'

  const productLinks = ref([{ url: '' }])
  const isLoading = ref(false)
  const allLinksSet = ref(false)

  const addProductLink = () => {
    productLinks.value.push({ url: ''})
    allLinksSet.value = false
  }
  

  const onUrlChanged = () => {
    allLinksSet.value = productLinks.value.filter(val => !val.url).length === 0
  }

  const canAddLink = computed(() => {
    return allLinksSet.value && productLinks.value.length < 5;
  })

  const props = defineProps({
  })

  const emit = defineEmits([])
</script>

<template>
    <LoadingDialog :isOpen="isLoading">
    <div class="lds-hourglass"></div>
    <div>
      <i> AI happening</i>
      <br />
      (this could take a minute 😴)
    </div>
  </LoadingDialog>
  <main>
    <div class="wrapper flow">
      <h1>Product Battle ⚔️</h1>
      <div v-for="(link, idx) in productLinks" :key="idx" class="product-link">
        {{ idx }}.
        <input
          type="text"
          class="input"
          v-focus
          :placeholder="`Product link ${idx + 1}`"
          v-model="productLinks[idx].url"
          @input="onUrlChanged"
        />

        <a class="delete-link">
          <span class="material-symbols-outlined">
            delete
          </span>
        </a>

      </div>
     

      <div class="add-link">
        <a @click="addProductLink" :disabled="!canAddLink">
          <span class="material-symbols-outlined plus-icon">
            add_circle
          </span>
        </a>
      </div>
      <button class="button" @click="battleClick">
        Battle!
      </button>
    
    </div>
  </main>

</template>

<style scoped>
  .plus-icon {
    font-size: 4rem;
    padding-top: 0.18rem;
  }

.add-link {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.product-link {
  display: flex;
  gap: 0.8rem;
  align-items: center;
}

.delete-link {
  align-self: end;
}
</style>
