import React, {useCallback} from 'react';
// eslint-disable-next-line no-restricted-imports
import type {ScrollView as RNScrollView} from 'react-native';
import ScrollView from '@components/ScrollView';
import useThemeStyles from '@hooks/useThemeStyles';
import type {DraggableListProps} from './types';
import useDraggableInPortal from './useDraggableInPortal';
import Droppable from './Droppable';
import Draggable from './Draggable';

import {
    DndContext, 
    closestCenter,
    PointerSensor,
    useSensor,
    UniqueIdentifier,
  } from '@dnd-kit/core';
  import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
  } from '@dnd-kit/sortable';
  
type ReorderParams<T> = {
    list: T[];
    startIndex: number;
    endIndex: number;
};

/**
 * Reorders a list by moving an item from a start index to an end index.
 */
const reorder = <T,>({list, startIndex, endIndex}: ReorderParams<T>): T[] => {
    const result = [...list];
    const [removed] = result.splice(startIndex, 1);

    if (removed) {
        result.splice(endIndex, 0, removed);
    }

    return result;
};

function DraggableList<T>(
    {
        data = [],
        renderItem,
        keyExtractor,
        onDragEnd: onDragEndCallback,
        renderClone,
        shouldUsePortal = false,
        // eslint-disable-next-line @typescript-eslint/naming-convention
        ListFooterComponent,
    }: DraggableListProps<T>,
    ref: React.ForwardedRef<RNScrollView>,
) {
    const styles = useThemeStyles();
    /**
     * Function to be called when the user finishes dragging an item
     * It will reorder the list and call the callback function
     * to notify the parent component about the change
     */
    const onDragEnd: any = useCallback(
        (result : any) => {

            console.warn(`onDragEnd result keys = ${JSON.stringify(Object.keys(result))}`)
            // [Warning] onDragEnd result keys = ["activatorEvent","active","collisions","delta","over"]

            // If user dropped the item outside of the list
            if (!result.destination) {
                return;
            }

            const reorderedItems = reorder({
                list: data,
                startIndex: result.source.index,
                endIndex: result.destination.index,
            });

            onDragEndCallback?.({data: reorderedItems});
        },
        [data, onDragEndCallback],
    );


    const renderDraggable = useDraggableInPortal({shouldUsePortal});

    const dragItems = data.map((item, index) =>  {
            const key = keyExtractor(item, index);
            return <Draggable
                id={key}
            >
                <div>
                    {renderItem({
                        item,
                        getIndex: () => index,
                        isActive: false,        // TODO - need to set this
                        drag: () => {},
                    })}
                </div>
             </Draggable>
        }
    
    );
    
    const itemIds = data.map((item, index) =>  { return keyExtractor(item, index) });

    const sensors = [useSensor(PointerSensor, {
        activationConstraint: {
          distance: 5
        }
      })];

    return (
        <ScrollView
            ref={ref}
            style={styles.flex1}
            contentContainerStyle={styles.flex1}
        >
            <DndContext 
                onDragEnd={onDragEnd} 
                sensors={sensors} 
                collisionDetection={closestCenter}
            >

            <SortableContext 
                items={itemIds}
                strategy={verticalListSortingStrategy}
            >
                
            </SortableContext>
            </DndContext>
            {ListFooterComponent}
        </ScrollView>
    );
}

DraggableList.displayName = 'DraggableList';

export default React.forwardRef(DraggableList);
