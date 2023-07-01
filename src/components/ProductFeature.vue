<script setup>
  import { ref } from 'vue'
  import EditableText from '../components/EditableText.vue'
  
  const props = defineProps({
    feature: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['featureChanged', 'featureDeleted'])


  const mouseOver = (event) => {
    const hoverIndicators = event.target.parentElement.querySelectorAll('.hover-indicator')
    hoverIndicators.forEach((indicator) => {
      indicator.classList.add('hidden')
    })
  }

  const mouseOut = (event) => {
    const hoverIndicators = event.target.parentElement.querySelectorAll('.hover-indicator')

    hoverIndicators.forEach((indicator) => {
      indicator.classList.remove('hidden')
    })
  }

  const deleteFeature = () => {
    console.log('delete feature', props.feature)
    emit('featureDeleted', props.feature)
  }

</script>

<template>
<div class="product-feature">
  <!-- <div class="hover-area"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
  /> -->
  <div class="columns">
    <span class="material-symbols-outlined hover-indicator">
      drag_indicator
    </span>
    <div class="product-info">
      <div class="feature-key">
      {{ props.feature.key }}
      </div>
    <div class="feature-value">
      <EditableText 
      :initialText="props.feature.value" 
      @textChanged="emit('featureChanged', { key: props.feature.key, value: $event })"
      />
    </div>
    </div>
    <span class="material-symbols-outlined trash-icon" @click="deleteFeature">
      delete
    </span>
  </div>
</div>
</template>

<style scoped>
.product-feature {
  text-align: center;
  cursor: grab;
  position: relative;
  margin-bottom: 2rem;
}

.feature-value {
  font-size: 2.5rem;
  z-index: 10;
}

.columns {
  display: grid;
  grid-template-columns: 3rem 1fr 3rem;
}

.product-info {
  display: flex;
  flex: 1;
  flex-direction: column;
}

.product-info:hover {
}

.hidden {
  visibility:visible !important;
}

.hover-indicator {
  visibility:hidden;
  align-self: center;
}

.hover-area {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.feature-key {
  font-weight: 700;
  font-size: var(--fs--1);
  color: #515E7D;
}

.trash-icon {
  align-self: center;
  cursor: pointer;
  font-size: 1.3rem;
}
</style>
