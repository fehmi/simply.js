# Getting Started


## Add it to your app

You can integrate simply.js into your application by adding a `<script>` tag. Ensure it is placed just before the closing `</body>` tag.

```html
<script src="https://simply.js.org/simply.min.js"></script>
```

## Create a Component

Your page is now ready to interact with simply.js components. simply.js components are structured into three main sections: `template`, `style`, and `script`. While more details are available in the [component structure](docs/component-structure) section, let's quickly get started. Create a `hello-world.html` file with the content below and save it to the same folder as the application where you initially added simply.js.

```html
<html>
  <h1>Hello World!</h1>
  <p>Greetings from {data.name}</p>
</html>

<style>
  h1 {
    font-family: Arial, Helvetica;
  	color: #4197b9;
  }
</style>

<script>
  class simply {
    data = {
      name: "simply.js"
    }
  }
</script>
```

## Use the Component

You can use simply.js's `get()` function to load your component anywhere in your application or page, as shown below.

```js
get("hello-world.html");
```

Once your component is loaded, its filename (without the extension) will serve as its custom tag name, allowing you to place the component anywhere by simply using the tag, like this:

```html
<hello-world></hello-world>
```

## Everything Together

You now have two files, structured as shown below. For a quicker start, you can download them directly instead of creating them manually.

<repl-component download="true" id="10fcijpwru4j34e"></repl-component>

## Preview Your App

When you have these files you can start a server to preview your app. You can use any web server but here are some suggestions for you.
<br>
- #### Python
If Python is installed, you can easily run:
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
