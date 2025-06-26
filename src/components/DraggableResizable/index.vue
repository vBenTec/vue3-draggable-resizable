<script setup lang="ts">

import {ContainerProvider, GetPositionStore, ResizingHandle, SetMatchedLine, UpdatePosition} from "@/components/types";
import {computed, inject, ref, Ref, toRef} from "vue";
import {
  initDraggableContainer,
  initLimitSizeAndMethods,
  initParent,
  initResizeHandle,
  initState,
  watchProps
} from "@/components/hooks";
import {filterHandles, IDENTITY} from "@/components/utils";

interface Props {
  initW?: number
  initH?: number
  draggable?: boolean
  resizable?: boolean
  disabledX?: boolean
  disabledY?: boolean
  disabledW?: boolean
  disabledH?: boolean
  minWidth?: number
  minHeight?: number
  active?: boolean
  parent?: boolean
  handles?: ResizingHandle[]
  classNameDraggable?: string
  classNameResizable?: string
  classNameDragging?: string
  classNameResizing?: string
  classNameActive?: string
  classNameHandle?: string
  lockAspectRatio?: boolean
}

const props = defineProps<Props>()

const width = defineModel<number>('width')
const height = defineModel<number>('height')
const x = defineModel<number>('x', {default: 0})
const y = defineModel<number>('y', {default: 0})
const active = defineModel<boolean>('active',)

const emit = defineEmits<{
  activated: []
  deactivated: []
  'drag-start': [Event]
  'resize-start': [Event]
  dragging: [Event]
  resizing: [Event]
  'drag-end': [Event]
  'resize-end': [Event]
}>()

const containerProps = initState(props, emit)
const provideIdentity = inject('identity')

let containerProvider: ContainerProvider | null = null
if (provideIdentity === IDENTITY) {
  containerProvider = {
    updatePosition: inject<UpdatePosition>('updatePosition')!,
    getPositionStore: inject<GetPositionStore>('getPositionStore')!,
    disabled: inject<Ref<boolean>>('disabled')!,
    adsorbParent: inject<Ref<boolean>>('adsorbParent')!,
    adsorbCols: inject<number[]>('adsorbCols')!,
    adsorbRows: inject<number[]>('adsorbRows')!,
    setMatchedLine: inject<SetMatchedLine>('setMatchedLine')!
  }
}
const containerRef = ref<HTMLElement>()
const parentSize = initParent(containerRef)
const limitProps = initLimitSizeAndMethods(
    props,
    parentSize,
    containerProps
)

initDraggableContainer(
    containerRef,
    containerProps,
    limitProps,
    toRef(props, 'draggable'),
    emit,
    containerProvider,
    parentSize
)
const resizeHandle = initResizeHandle(
    containerProps,
    limitProps,
    parentSize,
    props,
    emit
)
watchProps(props, limitProps)

const style = computed(() =>
    ({
      width: `${width}px`,
      height: `${height}px`,
      left: `${x}px`,
      top: `${y}px`
    })
)

const handlesFiltered = computed(() =>
    props.resizable ? filterHandles(props.handles) : []
)

const containerClass = computed(() => ({
  // [props.classNameActive]: enabled,
  [classNameDragging]: dragging,
  [classNameResizing]: resizing,
  [classNameDraggable]: draggable,
  [classNameResizable]: resizable
}))
</script>

<template>
  <div ref="container" class="vdr-container" :class="containerClass" :style="style">
    <slot/>
    <div v-for="item in handlesFiltered" class="vdr-handle" :class="`vdt-handle-${item}`"/>
  </div>
</template>

<style scoped>

</style>