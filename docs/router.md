## Router

Add your site path as base href.

```html
<base href="https://root/simply/examples/routeri/index.html">
```

Pass your router container to the Router.

```html
<body>
	<router></router>
</body>
```

```js
const outlet = document.querySelector('router');
const router = new Router(outlet, {
});
```

Optionaly you can pass `enableHash: true` to Router as an option.

```js
const router = new Router(outlet, {
	enableHash: true
});
```


Get your components. You'll pass their names to the router later.

```js
get('hello-world.html', "hello-world");
get('user-list.html', "user-list");
get('not-found.html', "not-found");
get('user-profile.html', "user-profile");
```


?> Set your routes.

```js
router.setRoutes([
	{ path: '/', component: 'hello-world' },
	{
		path: '/users',
		children: [
			{ path: '/', component: 'user-list' },
			{ path: '/:user', component: 'user-profile' }
		]
	},
	{ path: '(.*)', component: 'not-found' },
]);
```


And your links will be like:

```html
<a href="#">Home</a>
<a href="#/users">Users</a>
<a href="#/users/kim">Kim</a>
```

Hook examples:
```js
router.hooks = {
	before: function (router, pathnameOrContext)
	{
		// your code
	},
	after: function (context)
	{
		// your code
	}
}
```

Vaadin docs[Vaadin docs](https://vaadin.github.io/router/vaadin-router/#/classes/Router)<br>
Demos [Demos](https://vaadin.github.io/router/vaadin-router/#/classes/Router/demos/demo/index.html)

