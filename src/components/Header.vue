<script setup>
  import { ref } from 'vue'
  
  const props = defineProps({
  })

  const emit = defineEmits([])
</script>

<template>
  <div class="heading">
    <div class="site-name">
      <a href="/" class="home-link">
        SHOWDOWN
      </a>
    </div>
    <div>
    <button class="button">
      <span class="material-symbols-outlined">
        share
        </span>
        <span class="share-button">
          Share
        </span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.heading {
  background: black;
  color: white;

  position: sticky;
  top: 0;
  font-size: 2.5rem;
  font-weight: 700;
  line-height: 2rem;
  letter-spacing: 0em;
  text-align: left;
  padding: 0.8rem 1rem 0.5rem 1rem;

  display: flex;
  justify-content: space-between;
}

.share-button {
  vertical-align: center;
  font-family: 'Sen', sans-serif;
  font-weight: 700;
}

.material-symbols-outlined {
  vertical-align: bottom;
}

.site-name {
  font-family: 'Righteous', cursive;
}

.home-link {
  color: white;
  text-decoration: none;
}
</style>
