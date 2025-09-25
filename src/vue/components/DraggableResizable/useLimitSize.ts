import {computed, ComputedRef, Ref} from "vue";
import { calculateSizeLimits, constrainPosition } from "@/core/positioning";
import { DraggableOptions } from "@/core/types";

export const useLimitSize = (
    sizeValues: {
        resizingMinHeight: Ref<number>
        resizingMinWidth: Ref<number>
        resizingMaxHeight: Ref<number>
        resizingMaxWidth: Ref<number>
        parentWidth: ComputedRef<number | null>
        parentHeight: ComputedRef<number | null>
        width: Ref<number>
        height: Ref<number>
        y: Ref<number>
        x: Ref<number>
    },
    options: {
        useParent: boolean
        disabledW: boolean
        disabledH: boolean
        disabledY: boolean
        disabledX: boolean
        minW?: number
        minH?: number
        maxW?: number
        maxH?: number
    }
) => {
    const draggableOptions: DraggableOptions = {
        parent: options.useParent,
        disabledW: options.disabledW,
        disabledH: options.disabledH,
        disabledX: options.disabledX,
        disabledY: options.disabledY,
        minW: options.minW,
        minH: options.minH,
        maxW: options.maxW,
        maxH: options.maxH
    }

    const limitProps = computed(() => calculateSizeLimits(
        draggableOptions,
        sizeValues.parentWidth.value,
        sizeValues.parentHeight.value,
        sizeValues.width.value,
        sizeValues.height.value
    ))

    const limitMethods = {
        setWidth(val: number) {
            if (options.disabledW) return sizeValues.width.value

            const constrained = constrainPosition(
                sizeValues.x.value,
                sizeValues.y.value,
                val,
                sizeValues.height.value,
                limitProps.value,
                draggableOptions
            )

            sizeValues.width.value = constrained.w
            return sizeValues.width.value
        },
        setHeight(val: number) {
            if (options.disabledH) return sizeValues.height.value

            const constrained = constrainPosition(
                sizeValues.x.value,
                sizeValues.y.value,
                sizeValues.width.value,
                val,
                limitProps.value,
                draggableOptions
            )

            sizeValues.height.value = constrained.h
            return sizeValues.height.value
        },
        setTop(val: number) {
            if (options.disabledY) {
                return sizeValues.y.value
            }

            const constrained = constrainPosition(
                sizeValues.x.value,
                val,
                sizeValues.width.value,
                sizeValues.height.value,
                limitProps.value,
                draggableOptions
            )

            sizeValues.y.value = constrained.y
            return sizeValues.y.value
        },
        setLeft(val: number) {
            if (options.disabledX) return sizeValues.x.value

            const constrained = constrainPosition(
                val,
                sizeValues.y.value,
                sizeValues.width.value,
                sizeValues.height.value,
                limitProps.value,
                draggableOptions
            )

            sizeValues.x.value = constrained.x
            return sizeValues.x.value
        }
    }
    return {
        ...limitProps,
        ...limitMethods
    }
}