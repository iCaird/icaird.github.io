function matchingFromTableux(tableux) {
	let k = tableux[0].length;
	let m = math.ones(k, k);
	for (let i = 0; i < k; i++) {
		for (let j = 0; j < k; j++) {
			let row_label = tableux[0][i];
			let col_label = tableux[1][j];

			if ((row_label + col_label) % 2 == 0) {
				m.set([i, j], 0);
			}
		}
	}
	//PROBABLY MERGE THESE TWO LOOPS
	for (let i = 0; i < k; i++) {
		for (let j = 0; j < k; j++) {
			if (m.get([i, j]) == 0) {
				continue;
			}

			let row_label = tableux[0][i];
			let col_label = tableux[1][j];

			if (row_label > col_label) {
				m.set([i, j], 0);
				continue;
			}
			let smaller = math.min(row_label, col_label);
			let bigger = math.max(row_label, col_label);

			let count1 = 0;
			let count2 = 0;
			for (let l = smaller + 1; l < bigger; l++) {
				if (tableux[0].includes(l)) {
					count1++;
				} else {
					count2++;
				}
			}

			if (count1 != count2) {
				m.set([i, j], 0);
			}
		}
	}

	//loop through admissible rows, if row only has one 1, make that a matching and ban that
	let matching_indices = [];
	let allowed_rows = Array.from(Array(k).keys());
	let allowed_cols = Array.from(Array(k).keys());
	while (matching_indices.length != k) {
		for (let i of allowed_rows) {
			let row = m._data[i];
			let oneCount = 0;

			for (let i of allowed_cols) {
				if (row[i] == 1) {
					oneCount++;
				}
			}

			if (oneCount == 1) {
				matching_indices.push([i, row.indexOf(1)]);
				allowed_rows.splice(allowed_rows.indexOf(i), 1);

				allowed_cols.splice(allowed_cols.indexOf(row.indexOf(1)), 1);
				break;
			}
		}
	}

	//convert indices to matchings
	let matching = [];

	for (let mIndex of matching_indices) {
		matching.push([tableux[0][mIndex[0]], tableux[1][mIndex[1]]]);
	}

	return matching;
}

function myMod(a, b) {
	//return a mod b (in the maths sense)
	return ((a % b) + b) % b;
}

function printMatrix(m) {
	for (let i = 0; i < m._size[0]; i++) {
		console.log(JSON.stringify(m._data[i]));
	}
}

