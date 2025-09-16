## Electron Integration

!> This method is deprecated and will be removed in upcoming releases.

Add the `index.html` path as the base `href`.

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


Retrieve your components. You will pass their names to the router later.

```js
get('hello-world.html', "hello-world");
get('user-list.html', "user-list");
get('not-found.html', "not-found");
get('user-profile.html', "user-profile");
```


?> Set all routes within the `index.html` path as children.

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


Your links will then be structured as follows:

```html
<a href="#">Home</a>
<a href="#/users">Users</a>
<a href="#/users/kim">Kim</a>
```

That completes the setup!
