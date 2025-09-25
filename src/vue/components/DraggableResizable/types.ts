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

export interface DraggableContainerProps {
    x: Ref<number>;
    y: Ref<number>;
    w: Ref<number>;
    h: Ref<number>;
}

export interface DraggableContainerState {
    container: Ref<HTMLElement | undefined>;
    active: Ref<boolean>;
    dragging: Ref<boolean>;
    resizing: Ref<boolean>;
    handles: Ref<string>;
    id: string
}

export interface DraggableContainerOptions {
    draggable: Ref<boolean>;
    emit: (event: string, ...args: any[]) => void;
    parent: boolean;
    parentWidth: Ref<number>;
    parentHeight: Ref<number>;
}


export interface UseResizeHandleProps {
    width: Ref<number>;
    height: Ref<number>;
    x: Ref<number>;
    y: Ref<number>;
    aspectRatio: Ref<number>;
    parentWidth: Ref<number>;
    parentHeight: Ref<number>;
    minH: Ref<number>;
    minW: Ref<number>;
}

export interface UseResizeHandleState {
    resizing: Ref<boolean>;
    handles: Ref<ResizingHandle[]>;
    resizingHandle: Ref<ResizingHandle>;
    resizingMaxWidth: Ref<number>;
    resizingMaxHeight: Ref<number>;
    resizingMinWidth: Ref<number>;
    resizingMinHeight: Ref<number>;
}

export interface UseResizeHandleMethods {
    setWidth: (val: number) => number;
    setHeight: (val: number) => number;
    setLeft: (val: number) => number;
    setTop: (val: number) => number;
    emit: (event: string, ...args: any[]) => void;
}

export interface UseResizeHandleOptions {
    lockAspectRatio: boolean;
    resizable: boolean;
    parent: boolean;
}
