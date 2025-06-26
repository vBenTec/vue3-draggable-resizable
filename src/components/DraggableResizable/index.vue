<script setup lang="ts">

import {ContainerProvider, GetPositionStore, ResizingHandle, SetMatchedLine, UpdatePosition} from "@/components/types";
import {computed, inject, ref, Ref, toRef, useTemplateRef, onMounted, nextTick} from "vue";
import {
  initDraggableContainer,
  initLimitSizeAndMethods,
  initParent,
  initResizeHandle,
  initState,
  watchProps
} from "@/components/hooks";
import {filterHandles, getElSize, IDENTITY} from "@/components/utils";
import {ALL_HANDLES} from "@/components/Vue3DraggableResizable";

interface Props {
  initW?: number
  initH?: number
  draggable?: boolean
  resizable?: boolean
  disabledX?: boolean
  disabledY?: boolean
  disabledW?: boolean
  disabledH?: boolean
  minW?: number
  minH?: number
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

const {
  handles = ALL_HANDLES,
  classNameActive = 'active',
  classNameHandle = 'handle',
  classNameResizing = 'resizing',
  classNameDragging = 'dragging',
  classNameDraggable = 'draggable',
  classNameResizable = 'resizable',
  minW = 20,
  minH = 20,
  parent = false,
  draggable = true,
  resizable = true,
} = props

const w = defineModel<number>('w', {default: 0})
const h = defineModel<number>('h', {default: 0})
const x = defineModel<number>('x', {default: 0})
const y = defineModel<number>('y', {default: 0})

const active = defineModel<boolean>('active', {default: false})

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
const {dragging, resizing, enable, left, setWidth, setHeight, id, width, height, top} = containerProps

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

const containerRef = useTemplateRef('container')

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

const {resizeHandleDown} = initResizeHandle(
    containerProps,
    limitProps,
    parentSize,
    props,
    emit
)

watchProps(props, limitProps)

const style = computed(() =>
    ({
      width: `${width.value}px`,
      height: `${height.value}px`,
      top: `${top.value}px`,
      left: `${left.value}px`,
    })
)

const handlesFiltered = computed(() =>
    props.resizable ? filterHandles(handles) : []
)

const containerClass = computed(() => ({
  [classNameActive]: enable.value,
  [classNameDragging]: dragging.value,
  [classNameResizing]: resizing.value,
  [classNameDraggable]: props.draggable,
  [classNameResizable]: props.resizable
}))

onMounted(() => {
  if (!containerRef.value) return

  containerRef.value.ondragstart = () => false

  const {width: elWidth, height: elHeight} = getElSize(containerRef.value)

  const initialWidth = !props.initW ? w.value || elWidth : props.initW;
  const initialHeight = !props.initH ? h.value || elHeight : props.initH;

  setWidth(initialWidth  ? initialWidth : minW);
  setHeight(initialHeight   ? initialHeight : minH);

  if (containerProvider) {
    containerProvider.updatePosition(id, {
      x: left.value,
      y: top.value,
      w: width.value,
      h: height.value
    })
  }
})

defineExpose({
  containerRef,
  containerProvider,
  ...containerProps,
  ...parentSize,
  ...limitProps,
  resizeHandleDown
})
</script>

<template>
  <div ref="container" class="vdr-container" :class="containerClass" :style="style">
    <slot/>
    <div v-for="item in handlesFiltered" :key="item" @mousedown.passive="resizeHandleDown($event, item)"
         @touchstart.passive="resizeHandleDown($event, item)" :style="{ display: enable ? 'block' : 'none' }"
         class="vdr-handle"
         :class="[`vdr-handle-${item}`, classNameHandle, `${classNameHandle}-${item}`]"/>
  </div>
</template>

<style scoped>
.vdr-container {
  position: absolute;
  border: 1px solid transparent;
  box-sizing: border-box;
}

.vdr-container.active {
  border-color: #000;
  border-style: dashed;
}

.vdr-container.dragging {
  border-color: #000;
  border-style: solid;
}

.vdr-handle {
  box-sizing: border-box;
  position: absolute;
  width: 7px;
  height: 7px;
  background: #f0f0f0;
  border: 1px solid #333;
}

.vdr-handle-tl {
  top: -4px;
  left: -4px;
  cursor: nw-resize;
}

.vdr-handle-tm {
  top: -4px;
  left: 50%;
  margin-left: -3px;
  cursor: n-resize;
}

.vdr-handle-tr {
  top: -4px;
  right: -4px;
  cursor: ne-resize;
}

.vdr-handle-ml {
  top: 50%;
  margin-top: -3px;
  left: -4px;
  cursor: w-resize;
}

.vdr-handle-mr {
  top: 50%;
  margin-top: -3px;
  right: -4px;
  cursor: e-resize;
}

.vdr-handle-bl {
  bottom: -4px;
  left: -4px;
  cursor: sw-resize;
}

.vdr-handle-bm {
  bottom: -4px;
  left: 50%;
  margin-left: -4px;
  cursor: s-resize;
}

.vdr-handle-br {
  bottom: -4px;
  right: -4px;
  cursor: se-resize;
}
</style>