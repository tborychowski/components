# month-picker

Basically months as a button-group.



## Usage

```html
<script src="index.js" type="module"></script>

<month-picker></month-picker>
```

```js
const el = document.getElementsByTagName('month-picker')[0];
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
