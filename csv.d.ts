export interface StringifyOptions {
	/**
	 * If set to true, swap rows and columns before saving.
	 * 
	 * @default false;
	 */
	readonly transpose?: boolean;

	/**
	 * If set to true, prepend each cell starting with `'=' | '-' | '+' | '@'` with a tab character. This prevents spreadsheet software like Excel from trying to execute code.
	 *
	 * This option should be used when saving any data to a CSV that may include data from an untrusted source, such as user-generated data.
	 *
	 * @default false;
	 */
	readonly sanitise?: boolean;
}

export interface ParseOptions<T> {
	/**
	 * A function that takes a string containing the value of a single CSV cell, and returns the value it should be mapped to.
	 */
	readonly mapper?: (cell: string) => T;
}

/**
 * Converts a 2D Array into a CSV string.
 * 
 * `stringify` converts most falsey values into empty cells. `undefined`, `''`, and `[]` are all treated this way. `null` and `false`, however, are converted into string representations when stringifying CSV data.
 * 
 * If you need to maintain a value of `undefined`, `''`, or `[]` when stringifying your CSV data, convert it to a string first (e.g. `'undefined'`)
 * 
 * @param {any[][]} data - A 2D Array to convert into a CSV string.
 * @param {StringifyOptions} [options] - An object containing stringify options.
 * @return {string} CSV string
 */
export function stringify(data: any[][], options?: StringifyOptions): string;

/**
 * Converts a CSV string into a 2D Array.
 * 
 * `parse` will throw an error if the string it is passed is malformed in one of these ways:
 * 
 * - Unclosed quote
 * - closed quote not followed immediately by separator
 * - Rows of unequal lengths
 * 
 * All values are converted to strings. If you need to convert them further, for example changing the strings `'true'` and `'false'` to boolean values, you can do this in separate code after the fact.
 * 
 * @template T=string
 * @param {string} data - A CSV string to convert to a 2D Array.
 * @param {ParseOptions} [options] - An object containing parse options.
 * @return {T[][]} 2D Array
 */
export function parse<T=string>(data: string, options?: ParseOptions<T>): T[][];
