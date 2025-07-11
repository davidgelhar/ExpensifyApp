import type {ImageStyle} from 'expo-image';
import type {StyleProp, TextStyle, ViewStyle} from 'react-native';
import type {ValueOf} from 'type-fest';
import type {DropdownOption} from '@components/ButtonWithDropdownMenu/types';
import type DotLottieAnimation from '@components/LottieAnimations/types';
import type SearchRowSkeleton from '@components/Skeletons/SearchRowSkeleton';
import type TableRowSkeleton from '@components/Skeletons/TableRowSkeleton';
import type CONST from '@src/CONST';
import type IconAsset from '@src/types/utils/IconAsset';

type ValidSkeletons = typeof SearchRowSkeleton | typeof TableRowSkeleton;
type MediaTypes = ValueOf<typeof CONST.EMPTY_STATE_MEDIA>;
type EmptyStateButton = {
    buttonText?: string;
    buttonAction?: () => void;
    success?: boolean;
    icon?: IconAsset;
    isDisabled?: boolean;
    style?: StyleProp<ViewStyle>;
    dropDownOptions?: Array<DropdownOption<ValueOf<{readonly CREATE_NEW_EXPENSE: 'createNewExpense'; readonly ADD_UNREPORTED_EXPENSE: 'addUnreportedExpense'}>>>;
};

type SharedProps<T> = {
    SkeletonComponent?: ValidSkeletons;
    title: string;
    titleStyles?: StyleProp<TextStyle>;
    subtitle?: string;
    children?: React.ReactNode;
    buttons?: EmptyStateButton[];
    containerStyles?: StyleProp<ViewStyle>;
    cardStyles?: StyleProp<ViewStyle>;
    cardContentStyles?: StyleProp<ViewStyle>;
    headerStyles?: StyleProp<ViewStyle>;
    headerMediaType: T;
    headerContentStyles?: StyleProp<ViewStyle & ImageStyle>;
    lottieWebViewStyles?: React.CSSProperties | undefined;
    minModalHeight?: number;
    subtitleText?: React.ReactNode;
};

type MediaType<HeaderMedia, T extends MediaTypes> = SharedProps<T> & {
    headerMedia: HeaderMedia;
};

type VideoProps = MediaType<string, 'video'>;
type IllustrationProps = MediaType<IconAsset, 'illustration'>;
type AnimationProps = MediaType<DotLottieAnimation, 'animation'>;

type EmptyStateComponentProps = VideoProps | IllustrationProps | AnimationProps;

type VideoLoadedEventType = {
    srcElement: {
        videoWidth: number;
        videoHeight: number;
    };
};

export type {EmptyStateComponentProps, VideoLoadedEventType, EmptyStateButton};
