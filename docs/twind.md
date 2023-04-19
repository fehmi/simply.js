# Tailwind Integration

You can enable [Tailwind](https://tailwindcss.com/docs/utility-first) support (thanks to [UNO](https://unocss.dev/)) for your components and start to use all Tailwind utility classes and even more. To do that, just pass an [UNO config object](https://unocss.dev/config/) from any of your components like below.

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

When simply.js see this UNO config object in any of your components, it will automaticaly load the UNO script from CDN and will apply the config if you provide some. Here are working examples:

<repl-component id="t4zm906byl315hm" download="true"></repl-component>

<repl-component id="3ihohusopxhgpsr" download="true"></repl-component>

After that UNO will be global. You will be able to access all Twind features in all your components. No need to pass that config again from your other components.

<repl-component id="51ayib7mrvt3gvo" download="true"></repl-component>

## Available Config Entries

There are plenty of config to change the behaviour of UNO for your custom needs. You can find available ones from [UNO config object](https://unocss.dev/config/)


## Official Twind Presets
Presets need to be installed and added to the presets option of the UNO config.
https://unocss.dev/presets/

## Simply.js Styles
You may be wondering what if you want to override some style of an element which you utilized with Tailwind classes earlier in the template section of your components. So, it's easy. Just write your normal CSS to the standard style section of your component. Utility classes are good but you have the right to say last word. For example, let's just simply override the `purple` with `blue` using our `<style>` tag:

<repl-component id="ny44pvrz4hglnkg" download="true"></repl-component>

And last but not least; you can go wild with the combination of simply.js variables and Tailwind utility classes easyly.

<repl-component id="5dfsx8sal6gszw5" download="true"></repl-component>

## Sources
Here are some links to help you to strengthen your Tailwind muscles:

[UNO Config Page](https://unocss.dev/config/)<br>
[UNO Presets](https://unocss.dev/presets/)
[UNO Home](https://unocss.dev/)<br>
[Tailwind Home](https://tailwind.com)<br>
[Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)<br>
[Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)