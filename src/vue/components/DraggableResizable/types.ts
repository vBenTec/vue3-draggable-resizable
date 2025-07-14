import {Position, PositionStore, SetMatchedLine} from "@/vue/components/DraggableContainer/types";
import {Ref} from "vue";

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


export interface DraggableResizableProps {
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

export type ReferenceLineMap = Record<
    'col' | 'row',
    {
        [propName: number]: Record<'min' | 'max' | 'value', number>
    }
>

export type HandleEvent = MouseEvent | TouchEvent;

export type UpdatePosition = (id: string, position: Position) => void

export type GetPositionStore = (excludeId?: string) => PositionStore

export interface ContainerProvider {
    updatePosition: UpdatePosition
    getPositionStore: GetPositionStore
    setMatchedLine: SetMatchedLine
    disabled: Ref<boolean>
    adsorbParent: Ref<boolean>
    adsorbCols: Ref<number[]>
    adsorbRows: Ref<number[]>
}

export interface ParentSize {
    parentWidth: Ref<number>
    parentHeight: Ref<number>
}