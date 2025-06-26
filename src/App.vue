<template>
  <div id="app">
    <div>
      x:{{ state.x }}
      <button @click="state.x += 10">+</button>
      <button @click="state.x -= 10">-</button>
    </div>
    <div>
      y:{{ state.y }}
      <button @click="state.y += 10">+</button>
      <button @click="state.y -= 10">-</button>
    </div>
    <div>
      w:{{ state.w }}
      <button @click="state.w += 10">+</button>
      <button @click="state.w -= 10">-</button>
    </div>
    <div>
      h: {{ state.h }}
      <button @click="state.h += 10">+</button>
      <button @click="state.h -= 10">-</button>
    </div>
    <div>active:{{ state.active }}<br/></div>

    <div class="parent">
      <Vue3DraggableResizable
          :initW="40"
          :initH="80"
          v-model:x="state.x"
          v-model:y="state.y"
          v-model:w="state.w"
          v-model:h="state.h"
          v-model:active="state.active"
          :draggable="true"
          :resizable="true"
          :parent="true"
          :disabledX="false"
          :disabledW="false"
          :disabledH="false"
          :disabledY="false"
          :lockAspectRatio="true"
          classNameHandle="my-handle"
          @activated="print('activated')"
          @deactivated="print('deactivated')"
          @drag-start="print('drag-start', $event)"
          @resize-start="print('resize-start', $event)"
          @dragging="print('dragging', $event)"
          @resizing="print('resizing', $event)"
          @drag-end="print('drag-end', $event)"
          @resize-end="print('resize-end', $event)"
      >
        This is a test example
      </Vue3DraggableResizable>
    </div>

    <div class="parent">
      <DraggableResizable :initW="40"
                          :initH="80"
                          v-model:x="state.x"
                          v-model:y="state.y"
                          v-model:w="state.w"
                          v-model:h="state.h"
                          v-model:active="state.active"
                          :draggable="true"
                          :resizable="true"
                          :parent="true"
                          :disabledX="false"
                          :disabledW="false"
                          :disabledH="false"
                          :disabledY="false"
                          :lockAspectRatio="true"
                          @activated="print('activated')"
                          @deactivated="print('deactivated')"
                          @drag-start="print('drag-start', $event)"
                          @resize-start="print('resize-start', $event)"
                          @dragging="print('dragging', $event)"
                          @resizing="print('resizing', $event)"
                          @drag-end="print('drag-end', $event)"
                          @resize-end="print('resize-end', $event)">
        Example ist a test
      </DraggableResizable>
    </div>
  </div>
</template>

<script setup lang="ts">
import Vue3DraggableResizable from "./components/Vue3DraggableResizable";
// import DraggableContainer from "./components/DraggableContainer";
import DraggableResizable from "./components/DraggableResizable/index.vue";
import {reactive} from "vue";

const state = reactive({
  x: 100,
  y: 100,
  h: 100,
  w: 100,
})

const print = (msg: string, event?: Event) => {
  console.log(msg, event ? event : '');
}
</script>

<style scoped>
.parent {
  width: 300px;
  height: 300px;

  /*
    position: absolute;
    top: 100px;
    left: 200px;
  */
  position: relative;
  border: 1px solid #000;
  user-select: none;

  :deep() {
    .vdr-container {
      border-color: #999;
    }
  }
}
</style>
