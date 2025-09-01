<template>
  <div class="page">
    <h1>this is a example.</h1>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, defineProps, defineEmits, defineExpose } from 'vue';
const props = defineProps({});
const emit = defineEmits([]);

onMounted(() => {});

defineExpose({});
</script>

<style scoped>
.page {
  
}
</style>