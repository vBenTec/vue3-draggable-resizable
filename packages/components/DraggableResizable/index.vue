<script setup lang="ts">

import {computed, inject, ref, Ref, toRef, useTemplateRef, onMounted, nextTick, watch, useId} from "vue";
import {useParentSize} from "@/composables/useParent";
import {useResizeHandle} from "@/composables/useResizeHandle";
import {useIdentity} from "@/components/DraggableContainer/useIdentity";
import {DraggableResizableProps} from "@/components/DraggableResizable/types";
import {useLimitSize} from "@/composables/useLimitSize";
import {useDraggableContainer} from "@/composables/useDraggableContainer";
import {ALL_HANDLES} from "@/legacy/Vue3DraggableResizable";
import {ContainerProvider, GetPositionStore, ResizingHandle, SetMatchedLine, UpdatePosition} from "@/legacy/types";
import {filterHandles, IDENTITY} from "@/utils";


const props = withDefaults(defineProps<DraggableResizableProps>(), {
  handles: ALL_HANDLES,
  classNameActive: 'active',
  classNameHandle: 'handle',
  classNameResizing: 'resizing',
  classNameDragging: 'dragging',
  classNameDraggable: 'draggable',
  classNameResizable: 'resizable',
  minW: 20,
  minH: 20,
  parent: false,
  draggable: true,
  resizable: true,
})

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


const width = defineModel<number>('w', {default: (props) => props.initW ?? 0})
const height = defineModel<number>('h', {default: (props) => props.initH ?? 0})
const x = defineModel<number>('x', {default: (props) => props.x ?? 0})
const y = defineModel<number>('y', {default: (props) => props.y ?? 0})

const active = defineModel<boolean>('active', {default: (props) => props.active})

watch(active, (newVal) => {
  if (newVal) {
    emit('activated')
  } else {
    emit('deactivated')
  }
})

const resizingHandle = ref<ResizingHandle>('')
const resizingMaxWidth = ref<number>(Infinity)
const resizingMaxHeight = ref<number>(Infinity)
const resizingMinWidth = ref<number>(props.minW)
const resizingMinHeight = ref<number>(props.minH)

const dragging = ref(false)
const resizing = ref(false)


const aspectRatio = computed(() => height.value / width.value)

const setWidth = (value: number) => {
  width.value = Math.floor(value)
}

const setHeight = (value: number) => {
  height.value = Math.floor(value)
}

const setTop = (value: number) => {
  y.value = Math.floor(value)
}

const setLeft = (value: number) => {
  x.value = Math.floor(value)
}


const provideIdentity = useIdentity()

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

const {parentHeight, parentWidth} = useParentSize(containerRef, {enabled: toRef(props, 'parent')})

// useLimitSize({
//   resizingMinHeight,
//   resizingMinWidth,
//   resizingMaxWidth,
//   resizingMaxHeight,
//   parentWidth,
//   parentHeight,
//   width,
//   height,
//   y,
//   x
// }, {
//   useParent: props.parent,
//   disabledH: props.disabledH,
//   disabledW: props.disabledW,
//   disabledY: props.disabledY,
//   disabledX: props.disabledX,
// })

const {resizeHandleDown} = useResizeHandle(
    {
      width,
      height,
      x,
      y,
      aspectRatio,
      parentHeight,
      parentWidth,
      minH: toRef(props, 'minH'),
      minW: toRef(props, 'minW'),
    },
    {
      resizing,
      resizingHandle,
      handles: toRef(props, 'handles'),
      resizingMaxWidth,
      resizingMinHeight,
      resizingMaxHeight,
      resizingMinWidth,
    },
    {
      setWidth,
      setHeight,
      setTop,
      setLeft,
      emit,
    },
    {
      lockAspectRatio: props.lockAspectRatio,
      resizable: props.resizable,
      parent: parent
    }
)

useDraggableContainer({x, y, w: width, h: height}, {
  container: containerRef,
  active,
  dragging,
  resizing,
  handles: props.handles
}, {
  draggable: toRef(props, 'draggable'),
  emit,
  parent,
  parentWidth,
  parentHeight,
})

const style = computed(() =>
    ({
      width: `${width.value}px`,
      height: `${height.value}px`,
      top: `${y.value}px`,
      left: `${x.value}px`,
    })
)

const handlesFiltered = computed(() =>
    props.resizable ? filterHandles(props.handles) : []
)

const containerClass = computed(() => ({
  [props.classNameActive]: active.value,
  [props.classNameDragging]: dragging.value,
  [props.classNameResizing]: resizing.value,
  [props.classNameDraggable]: props.draggable,
  [props.classNameResizable]: props.resizable
}))

onMounted(() => {
  if (!containerRef.value) return

  containerRef.value.ondragstart = () => false

  if (containerProvider) {
    containerProvider.updatePosition(useId(), {
      x: x.value,
      y: y.value,
      w: width.value,
      h: height.value
    })
  }
})

// defineExpose({
//   containerRef,
//   containerProvider,
//   ...containerProps,
//   ...parentSize,
//   ...limitProps,
//   resizeHandleDown
// })
</script>

<template>
  <div @click="active = true" ref="container" class="vdr-container" :class="containerClass" :style="style">
    <slot/>
    <div v-for="item in handlesFiltered" :key="item" @mousedown.passive="resizeHandleDown($event, item)"
         @touchstart.passive="resizeHandleDown($event, item)" :style="{ display: active ? 'block' : 'none' }"
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