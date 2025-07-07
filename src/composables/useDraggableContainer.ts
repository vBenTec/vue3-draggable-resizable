import {onMounted, onUnmounted, watch, Ref} from "vue";
import {addEvent, removeEvent} from "@/components/utils";
import {MatchedLine, ReferenceLineMap} from "@/components/types";

const DOWN_HANDLES: (keyof HTMLElementEventMap)[] = ['mousedown', 'touchstart'];
const UP_HANDLES: (keyof HTMLElementEventMap)[] = ['mouseup', 'touchend'];
const MOVE_HANDLES: (keyof HTMLElementEventMap)[] = ['mousemove', 'touchmove'];

type HandleEvent = MouseEvent | TouchEvent;

function getPosition(e: HandleEvent) {
    if ('touches' in e) {
        return [e.touches[0].pageX, e.touches[0].pageY];
    } else {
        return [e.pageX, e.pageY];
    }
}

interface DraggableContainerProps {
    x: Ref<number>;
    y: Ref<number>;
    w: Ref<number>;
    h: Ref<number>;
}

interface DraggableContainerState {
    container: Ref<HTMLElement | undefined>;
    active: Ref<boolean>;
    dragging: Ref<boolean>;
    resizing: Ref<boolean>;
    handles: Ref<string>;
}

interface DraggableContainerOptions {
    draggable: Ref<boolean>;
    emit: (event: string, ...args: any[]) => void;
    parent: boolean;
    parentWidth: Ref<number>;
    parentHeight: Ref<number>;
}

export const useDraggableContainer = (
    props: DraggableContainerProps,
    state: DraggableContainerState,
    options: DraggableContainerOptions
) => {
    const {x, y, w, h} = props;
    const {container, active, dragging, resizing, handles} = state;
    const {draggable, emit, parent, parentWidth, parentHeight} = options;

    let lstX = 0;
    let lstY = 0;
    let lstPageX = 0;
    let lstPageY = 0;
    const referenceLineMap: ReferenceLineMap | null = null;

    const documentElement = document.documentElement;

    const _unselect = (e: HandleEvent) => {
        const target = e.target;
        if (!container.value?.contains(target as Node)) {
            active.value = false;
        }
    };

    const handleUp = () => {
        dragging.value = false;
        removeEvent(documentElement, UP_HANDLES, handleUp);
        removeEvent(documentElement, MOVE_HANDLES, handleDrag);
    };

    const handleDrag = (e: MouseEvent) => {
        e.preventDefault();
        if (!dragging.value) return;

        const [pageX, pageY] = getPosition(e);
        const deltaX = pageX - lstPageX;
        const deltaY = pageY - lstPageY;

        let newLeft = lstX + deltaX;
        let newTop = lstY + deltaY;

        if (parent) {
            const maxLeft = parentWidth.value - w.value;
            const maxTop = parentHeight.value - h.value;
            newLeft = Math.min(maxLeft, Math.max(0, newLeft));
            newTop = Math.min(maxTop, Math.max(0, newTop));
        }

        x.value = newLeft;
        y.value = newTop;
        emit('dragging', {x: newLeft, y: newTop});
    };

    const handleDown = (e: HandleEvent) => {
        if (!draggable.value) return;

        active.value = true;
        dragging.value = true;
        lstX = x.value;
        lstY = y.value;
        [lstPageX, lstPageY] = getPosition(e);

        addEvent(documentElement, MOVE_HANDLES, handleDrag);
        addEvent(documentElement, UP_HANDLES, handleUp);
    };

    watch(dragging, (cur, pre) => {
        if (!pre && cur) {
            emit('drag-start', {x: x.value, y: y.value});
        } else if (pre && !cur) {
            emit('drag-end', {x: x.value, y: y.value});
        }
    });

    onMounted(() => {
        const el = container.value;
        if (!el) return;
        addEvent(documentElement, DOWN_HANDLES, _unselect);
        addEvent(el, DOWN_HANDLES, handleDown);
    });

    onUnmounted(() => {
        const el = container.value;
        if (!el) return;
        removeEvent(documentElement, DOWN_HANDLES, _unselect);
        removeEvent(documentElement, UP_HANDLES, handleUp);
        removeEvent(documentElement, MOVE_HANDLES, handleDrag);
        removeEvent(el, DOWN_HANDLES, handleDown);
    });

    return {container};
};