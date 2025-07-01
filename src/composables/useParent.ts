import {computed, Ref, ShallowRef,} from "vue";
import {getElSize} from "@/components/utils";

export const useParentSize = (containerRef: ShallowRef<HTMLDivElement | null>, options: {
    enabled: Readonly<Ref<boolean>>
}) => {
    const parent = computed(() => containerRef.value?.parentElement)

    return {
        parentWidth: computed(() => options.enabled && parent.value ? getElSize(parent.value).width : null),
        parentHeight: computed(() => options.enabled && parent.value ? getElSize(parent.value).height : null),
    }
}