import { TemplateResult } from "lit";

export function ForEach<T extends any[]>(
	item: T
): (
	render: (item: T[number], index: number) => TemplateResult<1>
) => TemplateResult<1>[];

export function ForEach<T extends any[]>(
	item: T,
	render: (item: T[number], index: number) => TemplateResult<1>
): TemplateResult<1>[];

export function ForEach<T extends any[]>(
	item: T,
	render?: (item: T[number], index: number) => TemplateResult<1>
):
	| TemplateResult<1>[]
	| ((
			render: (item: T[number], index: number) => TemplateResult<1>
	  ) => TemplateResult<1>[]) {
	if (render) {
		return item.map((value, index) => render(value, index));
	} else {
		return (render: (item: T[number], index: number) => TemplateResult<1>) =>
			item.map((value, index) => render(value, index));
	}
}
