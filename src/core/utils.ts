import { HandleEvent } from './types'

export const ALL_HANDLES: string[] = ['tl', 'tm', 'tr', 'ml', 'mr', 'bl', 'bm', 'br']

export const getElSize = (el: Element) => {
    const style = window.getComputedStyle(el)

    return {
        width: parseFloat(style.getPropertyValue('width')),
        height: parseFloat(style.getPropertyValue('height'))
    }
}

const createEventListenerFunction = (
    type: 'addEventListener' | 'removeEventListener'
) => {
    return <K extends keyof HTMLElementEventMap>(
        el: HTMLElement,
        events: K | K[],
        handler: any
    ) => {
        if (!el) return

        if (typeof events === 'string') {
            events = [events]
        }

        events.forEach((e) => el[type](e, handler, {passive: false}))
    }
}

export const addEvent = createEventListenerFunction('addEventListener')
export const removeEvent = createEventListenerFunction('removeEventListener')

export const filterHandles = (handles: string[]) => {
    const result: string[] = []

    if (handles && handles.length > 0) {
        handles.forEach((item) => {
            if (ALL_HANDLES.includes(item) && !result.includes(item)) {
                result.push(item)
            }
        })
    }
    return result
}

export const getPositionFromEvent = (e: HandleEvent) => {
    if ('touches' in e) {
        return [e.touches[0].pageX, e.touches[0].pageY]
    } else {
        return [e.pageX, e.pageY]
    }
}