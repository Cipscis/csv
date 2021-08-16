export interface StringifyOptions {
	/**
	 * If set to true, swap rows and columns before saving.
	 *
	 * @default false;
	 */
	transpose?: boolean;

	/**
	 * If set to true, prepend each cell starting with `'=' | '-' | '+' | '@'` with a tab character. This prevents spreadsheet software like Excel from trying to execute code.
	 *
	 * This option should be used when saving any data to a CSV that may include data from an untrusted source, such as user-generated data.
	 *
	 * @default false;
	 */
	sanitise?: boolean;
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
 *
 * @return {string} CSV string
 */
function stringify(data: any[][], options?: StringifyOptions): string {
	options = options || {};
	options.transpose = options.transpose || false;
	options.sanitise = options.sanitise || false;

	// Enforce square data and apply CSV escaping, then convert to string
	const rows = data;
	const shapedRows = _shape(data, options);
	const escapedRows = _escape(shapedRows, options);
	const joinedRows = _join(escapedRows);

	return joinedRows;
}

/**
 * Pad missing cells with empty strings and, if necessary, transpose the data
 *
 * @param {any[][]} data - A 2D Array to pad and potentially transpose.
 * @param {StringifyOptions} [options] - An object containing stringify options.
 *
 * @return {any[][]} Shaped CSV data
 */
function _shape(data: any[][], options?: StringifyOptions): any[][] {
	const transpose = options?.transpose ?? false;

	const maxLength = data.reduce((maxLength, row) => Math.max(maxLength, row.length), 0);

	// Flip rows and columns if transposing data
	const iMax = transpose ? maxLength : data.length;
	const jMax = transpose ? data.length : maxLength;

	const rows = [];
	for (let i = 0; i < iMax; i++) {
		const row = [];
		for (let j = 0; j < jMax; j++) {
			const iRow = transpose ? j : i;
			const iCol = transpose ? i : j;

			let cellValue = data[iRow][iCol];

			if (iCol >= data[iRow].length) {
				cellValue = '';
			}

			row.push(cellValue);
		}
		rows.push(row);
	}

	return rows;
}

/**
 * Make sure any cells containing " or , or a newline are escaped appropriately
 *
 * @param {any[][]} rows - A 2D Array with values to escape
 * @param {StringifyOptions} [options] - An object containing stringify options.
 *
 * @return {string[][]} Escaped CSV data
 */
function _escape(rows: any[][], options?: StringifyOptions): string[][] {
	for (const row of rows) {
		for (let j = 0; j < row.length; j++) {
			row[j] = _escapeCell(row[j], options);
		}
	}

	return rows;
}

/**
 * Make sure any cells containing " or , or a newline are escaped appropriately
 *
 * @param {any} cell - A single value to escape
 * @param {StringifyOptions} [options] - An object containing stringify options.
 *
 * @return {string} Escaped value
 */
function _escapeCell(cell: any, options?: StringifyOptions): string {
	const sanitise = options?.sanitise ?? false;

	// Convert to string
	let cellString: string;
	if (typeof cell === 'undefined') {
		// Replace undefined with ''
		cellString = '';
	} else if (typeof cell !== 'string') {
		// Convert to string
		cellString = '' + cell;
	} else {
		cellString = cell;
	}

	// Sanitise
	if (sanitise) {
		// Prevent spreadsheet software like
		// Excel from trying to execute code
		if (cellString.match(/^[=\-+@]/)) {
			cellString = '\t' + cell;
		}
	}

	// Escape
	if (cellString.match(/,|"|\n|\r/)) {
		// Turn any double quotes into escaped double quotes
		cellString = cellString.replace(/"/g, '""');

		// Wrap cell in double quotes
		cellString = '"' + cellString + '"';
	}

	return cellString;
}

/**
 * Join escaped CSV data into a single string.
 *
 * @param  {string[][]} rows - A 2D Array containing escaped CSV data
 *
 * @return {string} A CSV string
 */
function _join(rows: string[][]): string {
	const rowStrings = [];

	for (let i = 0; i < rows.length; i++) {
		rowStrings.push(rows[i].join(','));
	}

	const rowsString = rowStrings.join('\n');
	return rowsString;
}

export { stringify };
