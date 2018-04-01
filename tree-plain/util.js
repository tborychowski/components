
// tree object ==> flat array
function treeToArray (data) {
	const res = [];
	if (!Array.isArray(data)) data = [data];
	data.forEach(item => {
		const itemCopy = Object.assign({}, item);
		delete itemCopy.items;
		res.push(itemCopy);
		if (item.items) res.push(...treeToArray(item.items));
	});
	return res;
}

// flat array ==> tree
function arrayToTree (data, parentId = '', level = 0) {
	let res = data
		.filter(i => (i.parentId || '') === parentId)
		.map(item => {
			const items = arrayToTree(data, item.id, level + 1);
			const newItem = Object.assign({}, item);
			if (items.length) newItem.items = items;
			newItem.level = level;
			// update category's level
			updateArrayItem(data, item.id, { level });
			return newItem;
		});
	return res;
}


function updateArrayItem (items, id, newData) {
	const item = items.find(i => i.id === id);
	if (item) Object.assign(item, newData);
	return item;
}


function isTree (data) {
	if (!Array.isArray(data) || !data.length) return true;
	for (let i in data) if (data[i].items) return true;
	return false;
}

function sort (data) {
	data.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
}



export default {
	treeToArray,
	arrayToTree,
	updateArrayItem,
	isTree,
	sort,
};
