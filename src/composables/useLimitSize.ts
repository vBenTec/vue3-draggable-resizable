import {computed, ComputedRef, Ref} from "vue";

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
    }
) => {
    const limitProps = {
        minWidth: computed(() => sizeValues.resizingMinWidth.value),
        minHeight: computed(() => sizeValues.resizingMinHeight.value),
        maxWidth: computed(() =>
            options.useParent
                ? Math.min(sizeValues.parentWidth.value as number, sizeValues.resizingMaxWidth.value)
                : Infinity
        ),
        maxHeight: computed(() =>
            options.useParent
                ? Math.min(sizeValues.parentHeight.value as number, sizeValues.resizingMaxHeight.value)
                : Infinity
        ),
        minLeft: computed(() => options.useParent ? 0 : -Infinity),
        minTop: computed(() => options.useParent ? 0 : -Infinity),
        maxLeft: computed(() => options.useParent ? sizeValues.parentWidth.value as number - sizeValues.x.value : Infinity),
        maxTop: computed(() => options.useParent ? sizeValues.parentHeight.value as number - sizeValues.height.value : Infinity)
    }

    const limitMethods = {
        setWidth(val: number) {
            if (options.disabledW) return sizeValues.width.value

            sizeValues.width.value = Math.min(
                limitProps.maxWidth.value,
                Math.max(limitProps.minWidth.value, val)
            )

            return sizeValues.width.value
        },
        setHeight(val: number) {
            if (options.disabledH) return sizeValues.height.value

            sizeValues.height.value = Math.min(
                limitProps.maxHeight.value,
                Math.max(limitProps.minHeight.value, val)
            )

            return sizeValues.height.value
        },
        setTop(val: number) {
            if (options.disabledY) {
                return sizeValues.y.value
            }
            sizeValues.y.value = Math.min(
                limitProps.maxTop.value,
                Math.max(limitProps.minTop.value, val)
            )
            return sizeValues.y.value
        },
        setLeft(val: number) {
            if (options.disabledX) return sizeValues.x.value

            sizeValues.x.value = Math.min(
                limitProps.maxLeft.value,
                Math.max(limitProps.minLeft.value, val)
            )

            return sizeValues.x.value
        }
    }
    return {
        ...limitProps,
        ...limitMethods
    }
}