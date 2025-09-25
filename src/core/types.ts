export type ResizingHandle =
    | 'tl'
    | 'tm'
    | 'tr'
    | 'ml'
    | 'mr'
    | 'bl'
    | 'bm'
    | 'br'
    | ''

export interface Position {
    x: number
    y: number
    w: number
    h: number
}

export type PositionStore = Record<string, Position>

export interface ReferenceLineMap {
    col: {
        [propName: number]: {
            min: number
            max: number
            value: number
        }
    }
    row: {
        [propName: number]: {
            min: number
            max: number
            value: number
        }
    }
}

export interface MatchedLine {
    row?: number
    col?: number
}

export type HandleEvent = MouseEvent | TouchEvent

export interface DraggableOptions {
    draggable?: boolean
    resizable?: boolean
    disabledX?: boolean
    disabledY?: boolean
    disabledW?: boolean
    disabledH?: boolean
    minW?: number
    minH?: number
    maxW?: number
    maxH?: number
    parent?: boolean
    handles?: ResizingHandle[]
    lockAspectRatio?: boolean
}

export interface ContainerOptions {
    disabled?: boolean
    adsorbParent?: boolean
    adsorbCols?: number[]
    adsorbRows?: number[]
}

export interface SizeLimits {
    minWidth: number
    minHeight: number
    maxWidth: number
    maxHeight: number
    minLeft: number
    minTop: number
    maxLeft: number
    maxTop: number
}
