import type {ForwardedRef} from 'react';
import React, {forwardRef, useCallback, useMemo, useRef} from 'react';
import type {FlatListProps, FlatList as RNFlatList} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import CONST from '@src/CONST';
import FlatList from '.';

type FlatListWithScrollKeyProps<T> = Omit<FlatListProps<T>, 'data' | 'initialScrollIndex'> & {
    data: T[],
    initialScrollKey?: string | null | undefined;
    keyExtractor: (item: T, index: number) => string;
};

function FlatListWithScrollKey<T>({data, keyExtractor, initialScrollKey, ...props}: FlatListWithScrollKeyProps<T>, ref: ForwardedRef<RNFlatList>) {

    // search data to find index of element to scroll to
    const initialScrollIndex = useMemo(
        () => (data.findIndex((item, index) => keyExtractor(item, index) === initialScrollKey)),
        [initialScrollKey, data, keyExtractor],
    );
    
    const scrollToIndex = useCallback(() => {
        if (!ref || initialScrollIndex === null || initialScrollIndex === -1) {
            return;
        }
        console.info(`scroll to ${initialScrollIndex}`)

        ref.current.scrollToIndex({ animated: true, index: initialScrollIndex })
    }, [initialScrollIndex, ref]);

    const scrollTimeoutRef = useRef<NodeJS.Timeout>(null);

    useFocusEffect(useCallback(() => {
        scrollTimeoutRef.current = setTimeout(() => scrollToIndex(), CONST.ANIMATED_TRANSITION);
        return () => {
            if (!scrollTimeoutRef.current) {
                return;
            }
            clearTimeout(scrollTimeoutRef.current);
        };
    }, [scrollToIndex]));

    // If scroll failed because row not rendered yet, pause and retry
    const onScrollToIndexFailed = useCallback(() => {
        scrollTimeoutRef.current = setTimeout(() => scrollToIndex(), CONST.ANIMATED_TRANSITION);
        return () => {
            if (!scrollTimeoutRef.current) {
                return;
            }
            clearTimeout(scrollTimeoutRef.current);
        };
    },[scrollToIndex]);

    console.info(`FlatListWithScrollKey initialScrollKey = ${initialScrollKey}`);
    return (
        <FlatList
            data={data}
            ref={ref}
            onScrollToIndexFailed={onScrollToIndexFailed}
            // eslint-disable-next-line react/jsx-props-no-spreading
            {...props}
        />
    );
}

export default forwardRef(FlatListWithScrollKey);