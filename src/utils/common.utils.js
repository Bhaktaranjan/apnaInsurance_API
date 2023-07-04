exports.multipleColumnSet = (object) => {
	// console.log(object)
	if (typeof object !== 'object') {
		throw new Error('Invalid input');
	}

	const keys = Object.keys(object);
	const values = Object.values(object);

	//Generating SQL for query.
	columnSet = keys.map((key) => `${key} = ?`).join(', ');

	return {
		columnSet,
		values,
	};
};

