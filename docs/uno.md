# Tailwind Integration

You can enable [Tailwind](https://tailwindcss.com/docs/utility-first) support (thanks to [UNO](https://unocss.dev/)) for your components, allowing you to utilize all Tailwind utility classes and more.

Add the custom build of UNO for Simply.js to your root (`index.html`) page, as shown below.
```html
<script src="https://simply.js.org/style/uno.min.js"></script>
```

Then, simply pass an [UNO config object](https://unocss.dev/config/) from any of your components, as shown below.

```html
<script>
	class {
		data = {};
    uno = {
      shortcuts: [],
      rules: [],
      presets: [    
        presetAttributify(),
        presetUno(), 
      ],  
    }
  }
</script>
```

When Simply.js detects this UNO config object in any of your components, it will automatically load the UNO script from the CDN and apply the provided configuration. Here are working examples:

<repl-component id="fqu7rho9tb1s4bk" download="true"></repl-component>

After this, UNO will be globally available. You will be able to access all UNO features in all your components, eliminating the need to pass the configuration again from other components.

<repl-component id="ej2yfqzecjv5a0t" download="true"></repl-component>

## Available Config Entries

There are many configuration options available to customize UNO's behavior for your specific needs. You can find available options in the [UNO config object](https://unocss.dev/config/).


## Official UNO Presets
Presets need to be installed and added to the presets option of the UNO config.
https://unocss.dev/presets/

## Simply.js Styles
You might wonder how to override a style for an element that already uses Tailwind classes in your component's template section. It's straightforward: simply write your normal CSS in the standard style section of your component. While utility classes are effective, you retain control over the final styling. For example, you can easily override `purple` with `blue` using your `<style>` tag:

<repl-component id="m07agz5m3gjlivw" download="true"></repl-component>

And finally, you can easily combine Simply.js variables with Tailwind utility classes for powerful styling.

<repl-component id="ocg113eix6uf6en" download="true"></repl-component>

## Sources
Here are some links to help you strengthen your Tailwind expertise:

[UNO Config Page](https://unocss.dev/config/)<br>
[UNO Presets](https://unocss.dev/presets/)
[UNO Home](https://unocss.dev/)<br>
[Tailwind Home](https://tailwind.com)<br>
[Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)<br>
[Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)
