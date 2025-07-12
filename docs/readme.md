<p align="center"><img src="https://github.com/a7650/vue3-draggable-resizable/blob/main/docs/logo.png" alt="logo"></p>

<h1 align="center">Vue3DraggableResizable</h1>
<div align="center">

[![npm version](https://badge.fury.io/js/vue3-draggable-resizable.svg)](https://www.npmjs.com/package/vue3-draggable-resizable)
[![Software License](https://img.shields.io/badge/license-MIT-brightgreen.svg?style=flat-square)](LICENSE.md)
[![npm](https://img.shields.io/npm/dt/vue3-draggable-resizable.svg?style=flat-square)](https://www.npmjs.com/package/vue3-draggable-resizable)
[![vue version](https://img.shields.io/badge/vue_version->=3-brightgreen.svg?style=flat-square)](https://github.com/a7650/vue3-draggable-resizable)

</div>

> [Vue3 Component] A component for dragging and resizing, with support for conflict detection, element snapping and alignment, and real-time reference lines.

## Table of Contents

- [Features](#features)
- [Usage](#usage)
    - [Component Props](#props)
    - [Component Events](#events)
    - [Using the Snapping Feature](#using-the-snapping-feature)

### Features

- Supports dragging and resizing, which can be individually enabled or disabled.
- Custom resize handles (eight directions available for resizing, can be individually defined).
- Restrict dragging and resizing within the parent node.
- Custom class names for the component.
- Class names for resize handles can also be customized.
- Element snapping and alignment.
- Real-time reference lines.
- Custom reference lines.
- Built with Vue3 and TypeScript.

### Usage

```bash
$ npm install vue3-draggable-resizable
```

Register the component using the use method.

```js
// >main.js
import { createApp } from 'vue'
import App from './App.vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
// Default styles need to be imported
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

// You will get a global component named Vue3DraggableResizable
createApp(App)
    .use(Vue3DraggableResizable)
    .mount('#app')
```

Alternatively, you can use it within a single component.

```js
// >component.js
import { defineComponent } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
// Default styles need to be imported
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'

export default defineComponent({
  components: { Vue3DraggableResizable }
  // ...other
})
```

Here is an example using vue-template syntax.

```js
<template>
  <div id="app">
    <div class="parent">
      <Vue3DraggableResizable
        :initW="110"
        :initH="120"
        v-model:x="x"
        v-model:y="y"
        v-model:w="w"
        v-model:h="h"
        v-model:active="active"
        :draggable="true"
        :resizable="true"
        @activated="print('activated')"
        @deactivated="print('deactivated')"
        @drag-start="print('drag-start')"
        @resize-start="print('resize-start')"
        @dragging="print('dragging')"
        @resizing="print('resizing')"
        @drag-end="print('drag-end')"
        @resize-end="print('resize-end')"
      >
        This is a test example
      </Vue3DraggableResizable>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'
import Vue3DraggableResizable from 'vue3-draggable-resizable'
//default styles
import 'vue3-draggable-resizable/dist/Vue3DraggableResizable.css'
export default defineComponent({
  components: { Vue3DraggableResizable },
  data() {
    return {
      x: 100,
      y: 100,
      h: 100,
      w: 100,
      active: false
    }
  },
  methods: {
    print(val) {
      console.log(val)
    }
  }
})
</script>
<style>
.parent {
  width: 200px;
  height: 200px;
  position: absolute;
  top: 100px;
  left: 100px;
  border: 1px solid #000;
  user-select: none;
}
</style>
```

Props
initW
type: Number
default: null

Sets the initial width (in px).

```vue
<Vue3DraggableResizable :initW="100" />
```

initH
type: Number
default: null

Sets the initial height (in px).
