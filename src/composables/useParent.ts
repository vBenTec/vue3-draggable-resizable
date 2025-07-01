import {onMounted, ref, ShallowRef} from "vue";
import {getElSize} from "@/components/utils";

export const useParentSize = (containerRef: ShallowRef<HTMLDivElement | null>) => {
    const parentWidth = ref(0)
    const parentHeight = ref(0)

    onMounted(() => {
        if (!containerRef.value?.parentElement) return

        const {width, height} = getElSize(containerRef.value.parentElement)
        parentWidth.value = width
        parentHeight.value = height

    })
    return {
        parentWidth,
        parentHeight
    }
}