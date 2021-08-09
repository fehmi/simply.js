# Getting Started


## Add it to your app

You can add simply.js to your app via `<script>` tag to start using it. Just be sure to add it right before the closing `</body>` tag.

```html
<script src="//cdn.jsdelivr.net/gh/fehmi/simply.js@v0.4-alpha/simply.min.js"></script>
```

## Create a Component

Now our page is ready to interact with simply.js components. The components in simply.js have three sections; `template`, `style` and `script`. You can learn more about them in the component syntax section later but we want to quickly jump in right now. So create a `hello-world.html` file with the content below and save it to the same folder with the app you added simply.js in it at the first step.

```html
<template>
  <h1>Hello World!</h1>
  <p>Greetings from {data.name}</p>
</template>

<style>
  h1 {
    font-family: Arial, Helvetica;
  	color: #4197b9;
  }
</style>

<script>
  class {
    data = {
      name: "simply.js"
    }
  }
</script>
```

## Use the Component

You can use `get()` function of simply.js to load your component anywhere in your app/page like this.

```js
get("hello-world.html");
```

After getting your component, the filename without extension will be your custom tag name and then you will be able to put the component anywhere you want by just writing the tag like this.

```html
<hello-world></hello-world>
```

## Everything Together

Now you have two files and they are look like below. You can just click to download to have them in your local for fastest start if you don't want to create these files manually.

<repl-component download="true" id="I"></repl-component>

## Preview Your App

When you have these files you can start a server to preview your app. You can use any web server but here are some suggestions for you.
<br>
- #### Python
If you have Python installed you can easyly run:
```bash
#python 2
cd hello-world && python -m SimpleHTTPServer 8000
```
```bash
#python 3
cd hello-world && python3 -m http.server 8080
```

- #### Node.js HTTP Server
  You can install [http-server](https://www.npmjs.com/package/http-server) package if you want to continue with node.js.<br>
```bash
npm install --global http-server
```
  Then you will be able to start the server by
```bash
http-server [path] [options]
```

- #### Other Options

  Other options to start a server can be [XAMPP](https://www.apachefriends.org/), [MAMP](https://www.mamp.info/), [Prepros](https://prepros.io/) or [Codekit](https://codekitapp.com/).
