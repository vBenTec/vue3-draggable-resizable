import {onMounted, onUnmounted, watch, Ref} from "vue";
import {MatchedLine, ReferenceLineMap} from "@/legacy/types";
// Assuming getReferenceLineMap is moved to utils
import {addEvent, removeEvent, getReferenceLineMap} from "@/utils";
import {useContainerProvider} from "@/vue/components/DraggableContainer/useContainerProvider";



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
    id: string
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

    const containerProvider = useContainerProvider()

    const {x, y, w, h} = props;
    const {container, active, dragging, resizing, handles, id} = state;
    const {draggable, emit, parent, parentWidth, parentHeight} = options;

    let lstX = 0;
    let lstY = 0;
    let lstPageX = 0;
    let lstPageY = 0;
    let referenceLineMap: ReferenceLineMap | null = null;

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

        referenceLineMap = null

        containerProvider?.updatePosition(id, {
            x: x.value,
            y: y.value,
            w: w.value,
            h: h.value
        })
        containerProvider?.setMatchedLine(null)
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

        if (referenceLineMap) {
            const widgetSelfLine = {
                col: [newLeft, newLeft + w.value / 2, newLeft + w.value],
                row: [newTop, newTop + h.value / 2, newTop + h.value]
            }
            const matchedLine: unknown = {
                row: widgetSelfLine.row
                    .map((i, index) => {
                        let match = null
                        Object.values(referenceLineMap!.row).forEach((referItem) => {
                            if (i >= referItem.min && i <= referItem.max) {
                                match = referItem.value
                            }
                        })
                        if (match !== null) {
                            if (index === 0) {
                                newTop = match
                            } else if (index === 1) {
                                newTop = Math.floor(match - h.value / 2)
                            } else if (index === 2) {
                                newTop = Math.floor(match - h.value)
                            }
                        }
                        return match
                    })
                    .filter((i) => i !== null),
                col: widgetSelfLine.col
                    .map((i, index) => {
                        let match = null
                        Object.values(referenceLineMap!.col).forEach((referItem) => {
                            if (i >= referItem.min && i <= referItem.max) {
                                match = referItem.value
                            }
                        })
                        if (match !== null) {
                            if (index === 0) {
                                newLeft = match
                            } else if (index === 1) {
                                newLeft = Math.floor(match - w.value / 2)
                            } else if (index === 2) {
                                newLeft = Math.floor(match - w.value)
                            }
                        }
                        return match
                    })
                    .filter((i) => i !== null)
            }
            containerProvider!.setMatchedLine(matchedLine as MatchedLine)
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

        if (containerProvider && !containerProvider.disabled?.value) {
            referenceLineMap = getReferenceLineMap(containerProvider, { parentWidth, parentHeight }, id);
        }

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