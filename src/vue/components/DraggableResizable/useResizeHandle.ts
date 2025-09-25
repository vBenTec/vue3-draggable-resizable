import { computed, onUnmounted } from "vue";
import {addEvent, filterHandles, removeEvent, getPositionFromEvent} from "@/utils";
import {
    ResizingHandle,
    UseResizeHandleMethods, UseResizeHandleOptions,
    UseResizeHandleProps,
    UseResizeHandleState
} from "@/vue/components/DraggableResizable/types";
import { calculateResizeDelta } from "@/core/positioning";

type HandleEvent = MouseEvent | TouchEvent;

// const DOWN_HANDLES: (keyof HTMLElementEventMap)[] = ['mousedown', 'touchstart'];
const UP_HANDLES: (keyof HTMLElementEventMap)[] = ['mouseup', 'touchend'];
const MOVE_HANDLES: (keyof HTMLElementEventMap)[] = ['mousemove', 'touchmove'];

const getPosition = (e: HandleEvent) => getPositionFromEvent(e);

export const useResizeHandle = (
    props: UseResizeHandleProps,
    state: UseResizeHandleState,
    methods: UseResizeHandleMethods,
    options: UseResizeHandleOptions
) => {
    const { width, height, x, y, aspectRatio, parentWidth, parentHeight, minH, minW } = props;
    const {
        resizing,
        handles,
        resizingHandle,
        resizingMaxWidth,
        resizingMaxHeight,
        resizingMinWidth,
        resizingMinHeight
    } = state;
    const {  emit } = methods;

    let lstW = 0;
    let lstH = 0;
    let lstX = 0;
    let lstY = 0;
    let lstPageX = 0;
    let lstPageY = 0;
    let tmpAspectRatio = 1;
    let verticalOrientation = '';
    let horizontalOrientation = '';

    const documentElement = document.documentElement;

    const resizeHandleDrag = (e: HandleEvent) => {
        e.preventDefault();
        const [_pageX, _pageY] = getPosition(e);
        let deltaX = _pageX - lstPageX;
        let deltaY = _pageY - lstPageY;

        if (options.lockAspectRatio) {
            const deltas = calculateResizeDelta(
                resizingHandle.value,
                deltaX,
                deltaY,
                tmpAspectRatio,
                true
            );
            deltaX = deltas.deltaX;
            deltaY = deltas.deltaY;
        }

        if (verticalOrientation === 't') {
            const newHeight = Math.max(resizingMinHeight.value, Math.min(lstH - deltaY, resizingMaxHeight.value));
            height.value = newHeight;
            y.value = lstY - (height.value - lstH);
        } else if (verticalOrientation === 'b') {
            const newHeight = Math.max(resizingMinHeight.value, Math.min(lstH + deltaY, resizingMaxHeight.value));
            height.value = newHeight;
        }

        if (horizontalOrientation === 'l') {
            const newWidth = Math.max(resizingMinWidth.value, Math.min(lstW - deltaX, resizingMaxWidth.value));
            width.value = newWidth;
            x.value = lstX - (width.value - lstW);
        } else if (horizontalOrientation === 'r') {
            const newWidth = Math.max(resizingMinWidth.value, Math.min(lstW + deltaX, resizingMaxWidth.value));
            width.value = newWidth;
        }

        emit('resizing', { x: x.value, y: y.value, w: width.value, h: height.value });
    };

    const resizeHandleUp = () => {
        emit('resize-end', { x: x.value, y: y.value, w: width.value, h: height.value });
        resizingHandle.value = '';
        resizing.value = false;
        resizingMaxWidth.value = Infinity;
        resizingMaxHeight.value = Infinity;
        resizingMinWidth.value = minW.value;
        resizingMinHeight.value = minH.value;
        removeEvent(documentElement, MOVE_HANDLES, resizeHandleDrag);
        removeEvent(documentElement, UP_HANDLES, resizeHandleUp);
    };

    const resizeHandleDown = (e: HandleEvent, handleType: ResizingHandle) => {
        if (!options.resizable) return;
        e.stopPropagation();

        resizingHandle.value = handleType;
        resizing.value = true;

        verticalOrientation = handleType[0];
        horizontalOrientation = handleType[1];

        if (aspectRatio.value) {
            if (['tl', 'tm', 'ml', 'bl'].includes(handleType)) {
                verticalOrientation = 't';
                horizontalOrientation = 'l';
            } else {
                verticalOrientation = 'b';
                horizontalOrientation = 'r';
            }
        }

        let minHeight = minH.value;
        let minWidth = minW.value;

        if (minHeight / minWidth > aspectRatio.value) {
            minWidth = minHeight / aspectRatio.value;
        } else {
            minHeight = minWidth * aspectRatio.value;
        }

        resizingMinWidth.value = minWidth;
        resizingMinHeight.value = minHeight;

        if (options.parent) {
            let maxHeight = verticalOrientation === 't' ? y.value + height.value : parentHeight.value - y.value;
            let maxWidth = horizontalOrientation === 'l' ? x.value + width.value : parentWidth.value - x.value;

            if (options.lockAspectRatio) {
                if (maxHeight / maxWidth < aspectRatio.value) {
                    maxWidth = maxHeight / aspectRatio.value;
                } else {
                    maxHeight = maxWidth * aspectRatio.value;
                }
            }
            resizingMaxWidth.value = maxWidth;
            resizingMaxHeight.value = maxHeight;
        }

        lstW = width.value;
        lstH = height.value;
        lstX = x.value;
        lstY = y.value;

        [lstPageX, lstPageY] = getPosition(e);
        tmpAspectRatio = aspectRatio.value;

        emit('resize-start', { x: x.value, y: y.value, w: width.value, h: height.value });
        addEvent(documentElement, MOVE_HANDLES, resizeHandleDrag);
        addEvent(documentElement, UP_HANDLES, resizeHandleUp);
    };

    onUnmounted(() => {
        removeEvent(documentElement, UP_HANDLES, resizeHandleUp);
        removeEvent(documentElement, MOVE_HANDLES, resizeHandleDrag);
    });

    const handlesFiltered = computed(() =>
        options.resizable ? filterHandles(handles.value) : []
    );

    return {
        handlesFiltered,
        resizeHandleDown
    };
};