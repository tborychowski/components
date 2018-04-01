# year-picker

Numeric input with 2 buttons on the sides



## Usage

```html
<script src="index.js" type="module"></script>

<year-picker></year-picker>
```

```js
const el = document.getElementsByTagName('year-picker')[0];
el.addEventListener('change', e => {
	console.log(e.detail);
});
```


## Dev

```sh
yarn
```

## License

*MIT*
