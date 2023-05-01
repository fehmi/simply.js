# Style

Encapsulated style definitions only affect the elements inside the template tag of the component. But there is one exception. The inherited styles of the document can affect all child components. For example, when you define `color` property of `body` as `red` in the root document (index.html), then texts of all components inside the document will be `red` if you don't define otherwise inside the style tag of a component. Here is an example about it:

<repl-component id="56ezen3ypsn2w7v" download="true"></repl-component>

### Styling Component Container

When you want to style the component itself inside the component you can use `:host` selector. Also you can define your CSS variables in it.

<repl-component id="bzr1zokh1i7udmw" download="true"></repl-component>

### Link a CSS file

You can link a CSS file inside the template tag of the component like this. Because there are CSS variables in :host{} part of the external CSS file you imported, they will be all available in the current component and all its childs. It's a good approach to maintain your design tokens. 

<repl-component id="xugiyk48m90e56s" download="true"></repl-component>

### JavaScript Variables

The best thing about styling is you can use reactive JS variables in style tag. Syntax is like `color: "{data.color}";`.

?> Just don't forget to write variable name between apostrophes like `"{data.color}"`

<repl-component id="udiuc37epe5li8u" download="true"></repl-component>

### Tailwind
You also have the ability to use Tailwind magic in your components. See more at [Style section](tailwind.md)

