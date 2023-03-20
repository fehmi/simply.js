## Electron Integration

Add the index.html path as base href.

```html
<base href="https://root/simply/examples/routeri/index.html">
```


Pass `enableHash: true` to Router as an option.

```js
const outlet = document.querySelector('router');
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


?> Set all routes inside `index.html` path as children.

```js
router.setRoutes([
	{
		path: 'index.html',
		children: [
			{ path: '/', component: 'hello-world' },
			{
				path: '/users', children: [
					{ path: '/', component: 'user-list' },
					{ path: '/:user', component: 'user-profile' }
				]
			}
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

That's it!

