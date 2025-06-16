import { renderFnOrArray, renderFnOrArrayType } from "../core";

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
export { Container } from "./Container";
export { Divider } from "./Divider";
export { FooterLayout } from "./FooterLayout";
export { ForEach } from "./ForEach";
export { GridBreakpoint } from "./GridBreakpoint";
export { HeroSection } from "./HeroSection";
export { Hidden } from "./Hidden";
export { List, ListItem } from "./List";
export { ListGroup } from "./ListGroup";
export { Overlay } from "./Overlay";
export { PositionContainer } from "./PositionContainer";
export { SizedBox } from "./SizedBox";
export { SkeletonLoader } from "./SkeletonLoader";
export { Spacer } from "./Spacer";
export { Sticky } from "./Sticky";
export { Table } from "./Table";
export { Wrap } from "./Wrap";
export { ZStack } from "./ZStack";

export { Combobox } from "./Combobox";
export { Progress } from "./Progress";
export { Spinner } from "./Spinner";
export { WithTooltip } from "./Tooltip";
// 弹窗组件
export * from "./Dialog";

export function $Html(slot: renderFnOrArrayType) {
	return renderFnOrArray(slot);
}
