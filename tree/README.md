# perfect-tree

This is a basic tree component with **NO DEPENDENCIES!**<br>
Just 1 file.<br>
Native webcomponent.<br>


*Note:* if you use a shitty browser, than you need some [webcomponents polyfills](https://www.webcomponents.org/polyfills).


## Usage

```html
<script src="index.js" type="module"></script>

<perfect-tree></perfect-tree>
```

```js
const el = document.getElementsByTagName('perfect-tree')[0];
el.addEventListener('change', e => {
	console.log(e.detail);
});
el.data = {};
```


## Dev

```sh
yarn
```

## License

*MIT*
