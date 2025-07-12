import {ResizingHandle} from "@/legacy/types";


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