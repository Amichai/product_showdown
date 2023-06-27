<script setup>
  import { ref, computed } from 'vue'
  import LoadingDialog from '../components/LoadingDialog.vue'
  import Header from '../components/Header.vue'
  import EditableText from '../components/EditableText.vue'
  import ProductColumn from '../components/ProductColumn.vue'
  import EmptyProductColumn from '../components/EmptyProductColumn.vue'

  const productColumns = ref([{ 
    url: 'https://www.codeofbell.com/products/x-type-backpack',
    name: 'Code of Bell X-Type Backpack',
    features: {
      'Material': 'Leather',
      'Color': 'Black',
      'Size': 'Medium',
      'Price': '$1,000',
      'img': 'https://cdn.shopify.com/s/files/1/1971/3525/products/X-TYPE_01-01_a0c5704a-a47b-4e07-823c-b2efc11c403a_1296x.jpg?v=1685538532'
    }
    }])
  const isLoading = ref(false)

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
    <Header />
    <div class="wrapper flow">
      <div class="editable-text">
        <EditableText />
      </div>
      <div class="product-columns">
        <div 
          v-for="column, index in productColumns" :key="index">
            <ProductColumn 
            :productColumn="column" 
            />
        </div>
      <EmptyProductColumn />
      </div>

      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      <br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br><br>
      test
    
    </div>
  </main>

</template>

<style scoped>
  .product-columns {
    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: center;
  }

.editable-text {
  margin-top: 2rem;
  text-align: center;
  font-size: 2.3rem;
}
</style>
