export function initWith<T>(obj: T) {
	return {
		let(fn: (it: T) => void): T {
			fn(obj);
			return obj;
		},
	};
}

/**
 * @alias initWith
 */
export const iw = initWith;
