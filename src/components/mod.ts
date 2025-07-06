import { renderFnOrArray, renderFnOrArrayType, Temp } from "../core";

export {
	Virtualizer,
	VirtualizerController,
	type ItemsSource,
	type VirtualizerConfig,
} from "./Virtualizer.labs";

export { LightboxContainer } from "./LightboxContainer";

export { Column } from "./Column";
export { Flex } from "./Flex";
export { FlowItem } from "./FlowItem";
export { Grid } from "./Grid";
export { GridCol } from "./GridCol";
export { GridItem } from "./GridItem";
export { GridRow } from "./GridRow";
export { Row } from "./Row";
export { WaterFlow } from "./WaterFlow";

export { ColumnSplit } from "./ColumnSplit";
export { RowSplit } from "./RowSplit";
export { ScrollBar } from "./ScrollBar";
export { SideBarContainer } from "./SideBarContainer";
export { Swiper } from "./Swiper";
export { SwitchInput } from "./SwitchInput";

export { AbsoluteBox } from "./AbsoluteBox";
export { AcrylicBar } from "./AcrylicBar";
export { AspectRatio } from "./AspectRatio";
export { AutoFitGrid } from "./AutoFitGrid";
export { AvatarStack } from "./AvatarStack";
export { Badge } from "./Badge";
export { Canvas } from "./Canvas";
export { Card } from "./Card";
export { Center } from "./Center";
export { Combobox } from "./Combobox";
export { Container } from "./Container";
export { Divider } from "./Divider";
export { FooterLayout } from "./FooterLayout";
export { ForEach } from "./ForEach";
export { GridBreakpoint } from "./GridBreakpoint";
export { HeroSection } from "./HeroSection";
export { Hidden } from "./Hidden";
export { LazyForEach } from "./LazyForEach";
export { List, ListItem } from "./List";
export { ListGroup } from "./ListGroup";
export { Overlay } from "./Overlay";
export { PositionContainer } from "./PositionContainer";
export { Progress } from "./Progress";
export { SizedBox } from "./SizedBox";
export { SkeletonLoader } from "./SkeletonLoader";
export { Spacer } from "./Spacer";
export { Spinner } from "./Spinner";
export { Sticky } from "./Sticky";
export { Table } from "./Table";
export { WithTooltip } from "./Tooltip";
export { Wrap } from "./Wrap";
export { ZStack } from "./ZStack";
// 弹窗组件
export * from "./Dialog";

export function $Html(slot: renderFnOrArrayType) {
	return renderFnOrArray(slot);
}

export function $Once(
	self: HTMLElement,
	slot: () => Temp | Temp[],
	slotKey?: string
): Temp {
	const _self = self as any;

	// Use the provided slotKey or generate one based on the stringified slot function
	const key = slotKey || `__LYCO_ONCE_CACHE_${slot.toString()}__`;

	if (!_self[key]) {
		_self[key] = slot();
		return _self[key];
	} else {
		return _self[key];
	}
}
