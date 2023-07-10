/**
 * Generates a SQL column set and values from an object.
 *
 * @param {object} object - The input object.
 * @returns {object} - An object with the generated column set and values.
 * @throws {Error} - If the input is not an object.
 */
exports.multipleColumnSet = (object) => {
	if (typeof object !== 'object') {
		throw new Error('Invalid input');
	}

	const keys = Object.keys(object);
	const values = Object.values(object);

	// Generate SQL column set by mapping keys to `${key} = ?` format and joining with comma.
	const columnSet = keys.map((key) => `${key} = ?`).join(', ');

	return {
		columnSet,
		values,
	};
};

/**
 * Generates query parameters for a multiple column set query.
 *
 * @param {Object} object - The object containing the column-value pairs.
 * @returns {Object} - An object with the generated query parameters and values.
 * @throws {Error} - If the input is not an object.
 */
exports.multipleColumnSetQueryParams = (object) => {
	// Validate input
	if (typeof object !== 'object') {
		throw new Error('Invalid input');
	}

	// Extract keys and values from the object
	const keys = Object.keys(object);
	const values = Object.values(object);

	// Generate SQL for query
	const columnSetQueryParams = keys.map((key) => `${key} = ?`).join(' AND ');

	return {
		columnSetQueryParams,
		values,
	};
}
