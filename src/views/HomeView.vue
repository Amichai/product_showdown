<script setup>
  import { ref, computed, onMounted } from 'vue'
  import LoadingDialog from '../components/LoadingDialog.vue'
  import Header from '../components/Header.vue'
  import EditableText from '../components/EditableText.vue'
  import ProductColumn from '../components/ProductColumn.vue'
  import EmptyProductColumn from '../components/EmptyProductColumn.vue'
  import { queryShowdown, updateShowdown } from '../apiHelper.js';

  const productColumns = ref([])
  const showdownName = ref('Untitled Showdown')

  onMounted(async () => {
    console.log(props.guid)

    const productBattle = await queryShowdown(props.guid)
    const table = productBattle.table.S

    productColumns.value = JSON.parse(decodeURIComponent(table))
    showdownName.value = decodeURIComponent(productBattle.showdownName.S)
    featureOrder.value = JSON.parse(decodeURIComponent(productBattle.featureOrder.S))

    console.log(showdownName.value)
  })

  const featureOrder = ref(['Price', 'Size', 'Color', 'Material'])
  const isLoading = ref(false)

  const props = defineProps({
    guid: {
      type: String,
      required: false
    }
  })

  const showdownNameUpdated = (val) => {
    console.log('showdownNameUpdated', val)
    updateShowdown(props.guid, val, productColumns.value, featureOrder.value)
  }

  const emit = defineEmits([])

  const orderChanged = (ord) => {
    featureOrder.value = ord
    updateShowdown(props.guid, showdownName.value, productColumns.value, featureOrder.value)
  }

  const featureChanged = () => {
    updateShowdown(props.guid, showdownName.value, productColumns.value, featureOrder.value)
  }
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
        <EditableText :initialText="showdownName" 
          @textChanged="showdownNameUpdated"
        />
      </div>
      <div class="product-columns">
        <div 
          v-for="features, index in productColumns" :key="index">
            <ProductColumn
              :features="features"
              :rowOrder="featureOrder"
              @orderChanged="orderChanged"
              @featureChanged="featureChanged"
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
