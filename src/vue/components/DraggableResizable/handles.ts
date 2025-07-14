import type {ResizingHandle} from '@/vue/components/DraggableResizable/types'

export const ALL_HANDLES: ResizingHandle[] = [
    'tl',
    'tm',
    'tr',
    'ml',
    'mr',
    'bl',
    'bm',
    'br'
]

export const DOWN_HANDLES: (keyof HTMLElementEventMap)[] = ['mousedown', 'touchstart'];

export const UP_HANDLES: (keyof HTMLElementEventMap)[] = ['mouseup', 'touchend'];

export const MOVE_HANDLES: (keyof HTMLElementEventMap)[] = ['mousemove', 'touchmove'];