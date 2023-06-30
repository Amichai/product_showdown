<script setup>
  import { ref } from 'vue'
  import EditableText from '../components/EditableText.vue'
  
  const props = defineProps({
    feature: {
      type: Object,
      required: true
    }
  })

  const emit = defineEmits([])


  const mouseOver = (event) => {
    console.log('mouseOver1')
    const dragIndicator = event.target.parentElement.querySelector('.drag-indicator')
    dragIndicator?.classList?.toggle('hidden')
    console.log('mouseOver2')
  }

  const mouseOut = (event) => {
    console.log('mouseOut1')
    const dragIndicator = event.target.parentElement.querySelector('.drag-indicator')

    dragIndicator?.classList?.toggle('hidden')
    console.log('mouseOut2')
  }

</script>

<template>
<div class="product-feature"
  
>
<div class="hover-area"
  @mouseover="mouseOver"
  @mouseout="mouseOut"
>
</div>
  <div class="columns">
      <span class="material-symbols-outlined drag-indicator">
      drag_indicator
      </span>

  <div class="product-info"
  >
    {{ props.feature.key }}
    <div class="feature-value">
      <EditableText :initialText="props.feature.value" />
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
