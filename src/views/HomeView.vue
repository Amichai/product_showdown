<script setup>
import { ref, computed, onMounted } from 'vue'
import LoadingDialog from '../components/LoadingDialog.vue'
import Header from '../components/Header.vue'
import EditableText from '../components/EditableText.vue'
import ProductColumn from '../components/ProductColumn.vue'
import EmptyProductColumn from '../components/EmptyProductColumn.vue'
import { queryShowdown, updateShowdown } from '../apiHelper.js'
import { v4 as uuidv4 } from 'uuid'
import router from '@/router'

const productColumns = ref([])
const showdownName = ref('Untitled Showdown')
const isShowingNewButton = ref(false)

onMounted(async () => {
  console.log(props.guid)


  if(!props.guid) {
    isShowingNewButton.value = true
    return
  } else {
    isShowingNewButton.value = false
  }

  if (props.guid.toLocaleLowerCase() === 'new') {
    const newGuid = uuidv4()
    await updateShowdown(newGuid, showdownName.value, [], [])
    router.push({
      path: `/${newGuid}`
    })

    return
  }

  const productBattle = await queryShowdown(props.guid)
  const table = productBattle.table.S

  productColumns.value = JSON.parse(decodeURIComponent(table))
  showdownName.value = decodeURIComponent(productBattle.showdownName.S)
  featureOrder.value = JSON.parse(decodeURIComponent(productBattle.featureOrder.S))
  ///TOOD: gaurantee uniqueness within featureOrder

  console.log(showdownName.value)
})

const featureOrder = ref([])
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

const featureDeleted = (feature) => {
  // TODO
  // const featureToRemove = featureOrder.value[featureIdx]

  const idx = featureOrder.value.indexOf(feature.key)
  featureOrder.value.splice(idx, 1)

  productColumns.value.forEach((column, idx) => {
    column.features = column.features.filter((f) => {
      return f.id !== feature.id
    })
  })

  updateShowdown(props.guid, showdownName.value, productColumns.value, featureOrder.value)
}

const featureAdded = (feature, targetIdx) => {
  productColumns.value.forEach((column, idx) => {
    if (idx === targetIdx) {
      column.features.push({
        id: column.features.length,
        key: feature.key,
        value: feature.value
      })
    } else {
      column.features.push({
        id: column.features.length,
        key: feature.key,
        value: ''
      })
    }
  })

  featureOrder.value.push(feature.key)

  updateShowdown(props.guid, showdownName.value, productColumns.value, featureOrder.value)
}

const championAdded = (champion) => {
  const newColumn = {
    url: champion.url,
    name: champion.features.name,
    img: champion.imageUrl,
    features: featureOrder.value.map((feature, index) => {
      return {
        id: index,
        key: feature,
        value: ''
      }
    })
  }

  for(const [key, value] of Object.entries(champion.features)) {
    if (key === 'name') {
      continue
    }

    if(featureOrder.value.includes(key)) {
      newColumn.features.forEach((feature) => {
        if (feature.key === key) {
          feature.value = value
        }
      })
    } else {
      for (const column of productColumns.value) {
        column.features.push({
          id: column.features.length,
          key: key,
          value: ''
        })
      }

      newColumn.features.push({
        id: newColumn.features.length,
        key: key,
        value: value
      })

      featureOrder.value.push(key)
    }
  }

  productColumns.value.push(newColumn)

  updateShowdown(props.guid, showdownName.value, productColumns.value, featureOrder.value)
}

const deleteColumn = (idx) => {
  productColumns.value.splice(idx, 1)
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

    <div class="new-showdown" v-if="isShowingNewButton">
      <a href="/new">
      <button role="link" class="button">
          New Showdown
        </button>
      </a>
      </div>

    <div class="wrapper flow">
      <div class="editable-text">
        <EditableText
          v-if="props.guid"
          :initialText="showdownName"
          @textChanged="showdownNameUpdated"
        />
      </div>
      <div class="product-columns">
        <div v-for="(features, index) in productColumns" :key="index">
          <ProductColumn
            :features="features"
            :rowOrder="featureOrder"
            @orderChanged="orderChanged"
            @featureChanged="featureChanged"
            @deleteColumn="() => deleteColumn(index)"
            @featureAdded="(feature) => featureAdded(feature, index)"
            @featureDeleted="featureDeleted"
          />
        </div>
        <EmptyProductColumn v-if="props.guid" @championAdded="championAdded" />
      </div>

      <br /><br /><br /><br /><br />
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

.new-showdown {
  text-align: center;
  margin-top: 6rem;
}
</style>
