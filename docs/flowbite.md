# Tailwind Integration

You can enable [Tailwind](https://tailwindcss.com/docs/utility-first) support (thanks to [Twind](https://twind.style)) for your components. This allows you to use all Tailwind utility classes and leverage Twind's innovative approaches. To do this, simply pass a [Twind config object](https://twind.dev/handbook/configuration.html) from any of your components, as shown below.

```html
<script>
	class {
		data = {};
		twind = {
			presets: [
				// adds all Tailwind v3 classes
				presetTailwind(),
				// provides a CSS vendor prefixer and property alias mapper
				presetAutoprefix(),
				// Convert rem to px with a base value
				presetRemToPx({baseValue: 16})
			]
		}
  }
</script>
```

When Simply.js detects this Twind config object in any of your components, it will automatically load the Twind script from the CDN and apply the provided configuration. Here are two working examples:

<repl-component id="5yu28xjvnav6kos" download="true"></repl-component>

After this, Twind will be globally available. You will be able to access all Twind features in all your components, eliminating the need to pass the configuration again from other components.

<repl-component id="xhzt9oaqvf7zyvr" download="true"></repl-component>

>! If you pass another Twind config object, it will replace the first one. (Not yet tested)

## Available Config Entries

There are many configuration options available to customize the behavior of the Twind instance for your specific needs. You can find the available options below:

```html
<script>
  class {
    data = {};
		twind = {
			// Do not include base style reset
			// (default: use tailwind preflight)
			preflight: false,

			// Throw errors for invalid rules (default: warn)
			mode: strict,

			// Hash all generated class names (default: false)
			hash: true,

			presets: [
				presetTailwind(),
				presetAutoprefix(),
				presetRemToPx({baseValue: 16}),
			]

			// Define custom theme values (default: tailwind theme)
			theme: {
				fontFamily: {
					sans: ['Helvetica', 'sans-serif'],
					serif: ['Times', 'serif'],
				},
				colors: {
					// Build your palette here
					// Tailwind v2 extended color palette
					// (/docs/customizing-colors#color-palette-reference)
					// amber, black, blue, blueGray, coolGray, cyan,
					// emerald, fuchsia, gray,green,indigo,lightBlue,
					// lime, orange, pink, purple, red, rose, teal,
					// trueGray, violet, warmGray, white, yellow
					gray: colors.trueGray,
					red: colors.red,
					blue: colors.lightBlue,
					yellow: colors.amber,
				},
				extend: {
					spacing: {
						128: '32rem',
						144: '36rem',
					},
				},
			},

			// use a different dark mode strategy (default: 'media')
			darkMode: 'class',
		}
  }
</script>
```

## Official Twind Presets
Presets need to be installed and added to the presets option of the Twind config.

| Preset |      Function      | Description |
|--------------|:-------------|:-------------------------|
|<img width=250/>|<img width=300/>|
| [**Tailwind**](https://twind.style/preset-tailwind) | `presetTailwind()` | <sub><sup>Adds all Tailwind v3 classes. It's must if you want to use Tailwind Forms or Typography preset.</sup></sub> |
| [**Auto Prefix**](https://twind.style/preset-autoprefix) | `presetAutoprefix()` | <sub><sup>Provides a CSS vendor prefixer and property alias mapper</sup></sub>
| [**Typography**](https://twind.style/preset-typography) | `presetTypography()` | <sub><sup>Add beautiful typographic defaults</sup></sub> |
| [**Tailwind Forms**](https://twind.style/preset-tailwind-forms) | `presetTailwindForms()` | <sub><sup>Provides a basic reset for form styles</sup></sub> |
| [**Rem To Px**](https://github.com/tw-in-js/twind/issues/437#issuecomment-1382433830) | `presetRemToPx({baseValue: 16})` | <sub><sup>Converts rem to px with a base value</sup></sub> |
| [**Container Queries**](https://twind.style/preset-container-queries) | `presetContainerQueries()` | <sub><sup>Provides utilities for container queries</sup></sub> |
| [**Ext**](https://twind.style/preset-ext) | `presetExt()` | <sub><sup>Adds some commonly used rules and variants that are not part of Tailwind CSS</sup></sub> |
| [**Line Clamp**](https://twind.style/preset-line-clamp) | `presetLineClamp()` | <sub><sup>adds utilities for visually truncating text after a fixed number of lines</sup></sub> |
| [**Radix UI**](https://twind.style/preset-radix-ui) | `presetRadixUi()` | <sub><sup>The Radix UI color scales</sup></sub> |

## Simply.js Styles
You might wonder how to override a style for an element that already uses Tailwind classes in your component's template section. It's straightforward: simply write your normal CSS in the standard style section of your component. While utility classes are effective, you retain control over the final styling. For example, you can easily override `purple` with `blue` using your `<style>` tag:

<repl-component id="fxl9fftbvy2g0yk" download="true"></repl-component>

And finally, you can easily combine Simply.js variables with Tailwind utility classes for powerful styling.

<repl-component id="10h4zxdvn7yag9f" download="true"></repl-component>

## Sources
Here are some links to help you strengthen your Tailwind expertise:

[Official Handbook of Twind (Config Page)](https://twind.dev/handbook/configuration.html)<br>
[Twind Home](https://twind.style)<br>
[Tailwind Home](https://tailwind.com)<br>
[Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)<br>
[Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)
