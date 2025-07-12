<script setup lang="ts">
import {computed, toRef} from "vue";
import {provideContainer} from "@/components/DraggableContainer/useContainerProvider";

interface Props {
  disabled?: boolean;
  absorbParent?: boolean
  adsorbCols?: number[]
  adsorbRows?: number[]
  referenceLineVisible?: boolean
  referenceLineColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false,
  absorbParent: true,
  referenceLineVisible: true,
  referenceLineColor: '#f00'
})

const {state} = provideContainer({
  disabled: toRef(props, 'disabled'),
  absorbParent: toRef(props, 'absorbParent'),
  adsorbCols: toRef(props, 'adsorbCols'),
  adsorbRows: toRef(props, 'adsorbRows'),
  referenceLineVisible: toRef(props, 'referenceLineVisible'),
  referenceLineColor: toRef(props, 'referenceLineColor')
})

const matchedRows = computed(
    () => (state.matchedLine && state.matchedLine.row) || []
)
const matchedCols = computed(
    () => (state.matchedLine && state.matchedLine.col) || []
)
</script>

<template>
  <div class="draggable-container">
    <slot/>
    <template v-if="referenceLineVisible">
      <div v-for="item in matchedCols" :key="item" class="reference-line" :style="{
        width: '0',
        height: '100%',
        top: '0',
        left: `${item}px`,
        borderLeft: `1px dashed ${referenceLineColor}`,
        position: 'absolute',
      }"/>
      <div v-for="item in matchedRows" :key="item" class="reference-line" :style="{
        width: '100%',
        height: '0',
        top: `${item}px`,
        borderTop: `1px dashed ${referenceLineColor}`,
        position: 'absolute',
      }"/>
    </template>
  </div>
</template>

<style scoped>
.draggable-container {
  border: 1px solid red;
  width: 100%;
  height: 100%;
  position: relative;
}

</style>