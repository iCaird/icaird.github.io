function makeTableaux(k, content, above = -1, memo = {}) {
	//deactivating memo is a quick fix for semistandard tableau
	//memo = {};

	if (k in memo) {
		return memo[k];
	}

	if (k == 1) {
		memo[1] = [[0, 1]];
		return [[0, 1]];
	}

	let tableau = [];
	let valuesTried = [];

	for (let i = 1; i < content.length; i++) {
		if (valuesTried.includes(content[i])) {
			continue;
		} else {
			valuesTried.push(content[i]);
		}

		if (!(content[i] > above)) {
			continue;
		}

		let newContent = content.toSpliced(content.indexOf(content[i]), 1);
		newContent.shift();

		for (let subTab of makeTableaux(k - 1, newContent, content[i], memo)) {
			if (
				!(newContent[subTab[1]] > content[i]) ||
				!(newContent[subTab[0]] > content[0])
			) {
				continue;
			}

			let currentTab = [0, i].concat(
				subTab.map((e) => content.indexOf(newContent[e]))
			);
			tableau.push(currentTab);
		}
	}

	memo[k] = tableau;
	return memo[k];
    //format is array of indices of content, read from left to right top to bottom
}