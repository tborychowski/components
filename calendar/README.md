# perfect-calendar

This is a fucking calendar with **NO DEPENDENCIES!**<br>
And I mean really - 0 fucking dependencies.<br>
No moment.js, no jquery, no angular, no polymer nor any other shit!<br>
There are many so called "no-dependencies" calendars/datepickers, but I haven't found one, that wouldn't quietly sneak some 0.5MB of shit behind your back.<br>
Well, this one doesn't.<br>
Just 1 file.<br>
Native webcomponent.<br>


*Note:* if you use a shitty browser, than you need some [webcomponents polyfills](https://www.webcomponents.org/polyfills).


## Usage

```html
<script src="index.js" type="module"></script>

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

## License

*MIT*
