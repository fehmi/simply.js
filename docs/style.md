# Style

Encapsulated style definitions only affect elements within the component's template tag. However, there is one exception: inherited styles from the document can affect all child components. For example, if you define the `color` property of the `body` as `red` in the root document (index.html), then the text of all components within that document will be `red` unless otherwise defined within a component's style tag. Here is an example:

<repl-component id="56ezen3ypsn2w7v" download="true"></repl-component>

### Styling Component Container

To style the component's container from within the component itself, you can use the `:host` selector. You can also define your CSS variables within it.

<repl-component id="bzr1zokh1i7udmw" download="true"></repl-component>

### Link a CSS file

You can link a CSS file inside the component's template tag as follows. Since the external CSS file you import contains CSS variables within its `:host{}` section, these variables will be available to the current component and all its children. This is a good approach for maintaining your design tokens.

<repl-component id="xugiyk48m90e56s" download="true"></repl-component>

### JavaScript Variables

One of the key advantages of styling is the ability to use reactive JavaScript variables within style tags. The syntax is as follows: `color: "{data.color}";` and `width: "{data.width ? data.width : '100%'}";`.

?> Remember to enclose the variable name within apostrophes, like `"{data.color}"`.

### Tailwind

You also have the ability to leverage Tailwind CSS within your components. See more in the [Style section](tailwind.md).

### Conditions

You can also use Simply.js conditions, as shown in the example below.

<repl-component id="g8ey7ye01fp3g5z" download="true"></repl-component>
