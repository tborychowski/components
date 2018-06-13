# web components




*Note:* if you use a shitty browser, than you need some [webcomponents polyfills](https://www.webcomponents.org/polyfills).


## Example usage

```html
<script type="module" src="index.js"></script>

<perfect-calendar></perfect-calendar>
```

```js
const cal = document.getElementsByTagName('perfect-calendar')[0];
cal.addEventListener('change', e => {
	console.log(e.detail);
});
cal.date = '2018-03-11';
```


## Dev

```sh
yarn
```
