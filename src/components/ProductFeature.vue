<script setup>
  import { ref } from 'vue'
  import EditableText from '../components/EditableText.vue'
  
  const props = defineProps({
    feature: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits(['featureChanged'])


  const mouseOver = (event) => {
    const dragIndicator = event.target.parentElement.querySelector('.drag-indicator')
    dragIndicator?.classList?.add('hidden')
  }

  const mouseOut = (event) => {
    const dragIndicator = event.target.parentElement.querySelector('.drag-indicator')

    dragIndicator?.classList?.remove('hidden')
  }

</script>

<template>
<div class="product-feature">
  <div class="hover-area"
    @mouseover="mouseOver"
    @mouseout="mouseOut"
  />
  <div class="columns">
    <span class="material-symbols-outlined drag-indicator">
      drag_indicator
    </span>
    <div class="product-info">
    {{ props.feature.key }}
    <div class="feature-value">
      <EditableText 
      :initialText="props.feature.value" 
      @textChanged="emit('featureChanged', { key: props.feature.key, value: $event })"
      />
    </div>
    </div>
  </div>
</div>
</template>

<style scoped>
.product-feature {
  text-align: center;
  cursor: grab;
  position: relative;
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

.drag-indicator {
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
</style>
