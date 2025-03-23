import React, {useCallback,useState} from 'react';
// eslint-disable-next-line no-restricted-imports
import type {ScrollView as RNScrollView} from 'react-native';
import ScrollView from '@components/ScrollView';
import useThemeStyles from '@hooks/useThemeStyles';
import type {DraggableListProps} from './types';
import useDraggableInPortal from './useDraggableInPortal';

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
import { SortableItem } from './SortableItem';
  
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
        (event: any) => {
            const {active, over} = event;

            const oldIndex = items.indexOf(active.id);
            const newIndex = items.indexOf(over.id);

            console.warn(`onDragEnd active = ${active.id} over = ${over.id}`)
            console.warn(`onDragEnd oldIndex = ${oldIndex} newIndex = ${newIndex}`)

            if (active.id !== over.id) {
                // TODO - or maybe separate items array & useState is not needed - just regenerate from 'data'?
                setItems((items) => {
                  return arrayMove(items, oldIndex, newIndex);
                });

                // TODO - use arrayMove for this too?
                const reorderedItems = reorder({
                    list: data,
                    startIndex: oldIndex,
                    endIndex: newIndex,
                });
                onDragEndCallback?.({data: reorderedItems});
            }


        },
        [data, onDragEndCallback],
    );


    const renderDraggable = useDraggableInPortal({shouldUsePortal});

    const sortableItems = data.map((item, index) =>  {
            const key = keyExtractor(item, index);
            console.warn(`sortableItems: index=${index} key = ${key}`)
            return <SortableItem
                id={key} key={key}
            >
                <div>
                    {renderItem({
                        item,
                        getIndex: () => index,
                        isActive: false,        // TODO - need to set this
                        drag: () => {},
                    })}
                </div>
             </SortableItem>
        }
    
    );
    
    const [items, setItems] = useState(data.map((item, index) =>  { return keyExtractor(item, index) }));

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
                items={items}
                strategy={verticalListSortingStrategy}
            >
                {sortableItems}
            </SortableContext>
            </DndContext>
            {ListFooterComponent}
        </ScrollView>
    );
}

DraggableList.displayName = 'DraggableList';

export default React.forwardRef(DraggableList);
