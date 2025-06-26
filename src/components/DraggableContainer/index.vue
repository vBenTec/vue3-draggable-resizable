<script setup lang="ts">
import {computed, provide, reactive, toRef} from "vue";
import {
  GetPositionStore,
  MatchedLine,
  Position,
  PositionStore,
  SetMatchedLine,
  UpdatePosition
} from "@/components/types";
import {IDENTITY} from "@/components/utils";

interface Props {
  disabled?: boolean;
  absorbParent?: boolean
  adsorbCols?: number[]
  adsorbRows?: number[]
  referenceLineVisible?: boolean
  referenceLineColor: string
}

const {
  disabled = false,
  absorbParent = true,
  adsorbCols = [],
  adsorbRows = [],
  referenceLineVisible = true,
  referenceLineColor = '#f00'
} = defineProps<Props>()


const positionStore = reactive<PositionStore>({})

const updatePosition: UpdatePosition = (id: string, position: Position) => {
  positionStore[id] = position
}
const getPositionStore: GetPositionStore = (excludeId?: string) => {
  const _positionStore = Object.assign({}, positionStore)
  if (excludeId) {
    delete _positionStore[excludeId]
  }
  return _positionStore
}

const state = reactive<{
  matchedLine: MatchedLine | null
}>({
  matchedLine: null
})

const matchedRows = computed(
    () => (state.matchedLine && state.matchedLine.row) || []
)
const matchedCols = computed(
    () => (state.matchedLine && state.matchedLine.col) || []
)
const setMatchedLine: SetMatchedLine = (
    matchedLine: MatchedLine | null
) => {
  state.matchedLine = matchedLine
}

provide('identity', IDENTITY)
provide('updatePosition', updatePosition)
provide('getPositionStore', getPositionStore)
provide('setMatchedLine', setMatchedLine)
provide('disabled', toRef(disabled))
provide('adsorbParent', toRef(absorbParent))
provide('adsorbCols', adsorbCols )
provide('adsorbRows', adsorbRows )
</script>

<template>
  <div class="draggable-container">
    <slot/>
    <div class="reference-line"></div>
  </div>
</template>

<style scoped>
.draggable-container {
  width: 100%;
  height: 100%;
  position: relative;
}

.reference-line {

}
</style>