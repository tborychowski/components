function tree () {
	return `<div class="tree">
		<div class="edit-toggle">
			<button class="edit-on">Edit</button>
			<button class="edit-off">Done</button>
			<button class="btn-new">New</button>
		</div>
		<div class="edit-box">
			<form class="edit-form">
				<input type="hidden" name="id">
				<select name="parentId"></select>
				<input name="name">
				<button class="btn-save">Save</button>
				<button type="button" class="btn-del">Del</button>
			</form>
		</div>
		<div class="tree-content"></div>
	</div>`;
}


function itemTpl (item) {
	return `<a href="#" class="cat" data-id="${item.id}" data-name="${item.name}"
		data-parent-id="${item.parentId}">${item.name}</a>`;
}


function items (data, html = []) {
	if (!data.length) data = [data];
	for (let item of data) {
		html.push('<li>' + itemTpl(item));
		if (item.items) html.push(items(item.items));
		html.push('</li>');
	}
	return `<ul class="tree-node">${html.join('')}</ul>`;
}


function catDropdown (data, max_level = 2) {
	return '<option></option>' + data
		.filter(o => o.level < max_level - 1)	// if max_level === 2 -> this should be < 1
		.map(o => `<option value="${o.id}">${o.name}</option>`)
		.join('');
}



export default {
	tree,
	items,
	catDropdown,
};
