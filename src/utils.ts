import {
    ContainerProvider,
    ParentSize,
    ReferenceLineMap,
    ResizingHandle
} from "@/vue/components/DraggableResizable/types";
import { getReferenceLineMap as getCoreReferenceLineMap } from "@/core/reference-lines";
import { filterHandles as coreFilterHandles } from "@/core/utils";

// Re-export core utilities
export { getElSize, addEvent, removeEvent, getPositionFromEvent } from "@/core/utils";

export function filterHandles(handles: ResizingHandle[]) {
    return coreFilterHandles(handles)
}

export function getReferenceLineMap(
    containerProvider: ContainerProvider,
    parentSize: ParentSize,
    id?: string
) {
    const containerOptions = {
        disabled: containerProvider.disabled.value,
        adsorbParent: containerProvider.adsorbParent?.value ?? false,
        adsorbCols: containerProvider.adsorbCols?.value || [],
        adsorbRows: containerProvider.adsorbRows?.value || []
    }

    const positionStore = containerProvider.getPositionStore(id)

    return getCoreReferenceLineMap(
        containerOptions,
        parentSize.parentWidth.value,
        parentSize.parentHeight.value,
        positionStore,
        id
    )
}
