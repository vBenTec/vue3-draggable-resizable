import {computed, Ref} from "vue";
import {initParent, initState} from "@/components/hooks";
import {DraggableResizableProps} from "@/components/DraggableResizable/types";

export const useLimitSize = (
    props: DraggableResizableProps,
    parentSize: ReturnType<typeof initParent>,
    containerProps: ReturnType<typeof initState>
) => {
    const {
        width,
        height,
        left,
        top,
        resizingMaxWidth,
        resizingMaxHeight,
        resizingMinWidth,
        resizingMinHeight
    } = containerProps
    const { setWidth, setHeight, setTop, setLeft } = containerProps
    const { parentWidth, parentHeight } = parentSize

    const limitProps = {
        minWidth: computed(() => {
            return resizingMinWidth.value
        }),
        minHeight: computed(() => {
            return resizingMinHeight.value
        }),
        maxWidth: computed(() => {
            let max = Infinity
            if (props.parent) {
                max = Math.min(parentWidth.value, resizingMaxWidth.value)
            }
            return max
        }),
        maxHeight: computed(() => {
            let max = Infinity
            if (props.parent) {
                max = Math.min(parentHeight.value, resizingMaxHeight.value)
            }
            return max
        }),
        minLeft: computed(() => {
            return props.parent ? 0 : -Infinity
        }),
        minTop: computed(() => {
            return props.parent ? 0 : -Infinity
        }),
        maxLeft: computed(() => {
            return props.parent ? parentWidth.value - width.value : Infinity
        }),
        maxTop: computed(() => {
            return props.parent ? parentHeight.value - height.value : Infinity
        })
    }
    const limitMethods = {
        setWidth(val: number) {
            if (props.disabledW) {
                return width.value
            }
            return setWidth(
                Math.min(
                    limitProps.maxWidth.value,
                    Math.max(limitProps.minWidth.value, val)
                )
            )
        },
        setHeight(val: number) {
            if (props.disabledH) {
                return height.value
            }
            return setHeight(
                Math.min(
                    limitProps.maxHeight.value,
                    Math.max(limitProps.minHeight.value, val)
                )
            )
        },
        setTop(val: number) {
            if (props.disabledY) {
                return top.value
            }
            return setTop(
                Math.min(
                    limitProps.maxTop.value,
                    Math.max(limitProps.minTop.value, val)
                )
            )
        },
        setLeft(val: number) {
            if (props.disabledX) {
                return left.value
            }
            return setLeft(
                Math.min(
                    limitProps.maxLeft.value,
                    Math.max(limitProps.minLeft.value, val)
                )
            )
        }
    }
    return {
        ...limitProps,
        ...limitMethods
    }
}