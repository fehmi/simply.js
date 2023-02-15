# Tailwind Integration

You can enable [Tailwind](https://tailwindcss.com/docs/utility-first) support (thanks to [Twind](https://twind.style)) for your components and start to use all Tailwind utility classes and even more with Twind's delighful new approaches. To do that, just pass an [Twind config object](https://twind.dev/handbook/configuration.html) in any of your components like below.

```html
<script>
	class {
		data = {};
		twind = {
			presets: [
				presetTailwind(/* options */), // adds all Tailwind v3 classes
				presetAutoprefix(), // provides a CSS vendor prefixer and property alias mapper
				presetRemToPx({baseValue: 16}) // Convert rem to px with a base value
			]
		}
  }
</script>
```

When simply.js see this Twind options object in any of your components, it will automaticaly load the Twind script from cdn and will apply the config if you provide some. Here are two working examples:

<repl-component id="5yu28xjvnav6kos" download="true"></repl-component>

After that it will be global. So you will be able to access Twind features in all your components.

<repl-component id="2ykb3777n630pc3" download="true"></repl-component>

>! If you pass another Twind config object It will replace the first one.

## Available Config Entries

There are plenty of options to change Twind instance for your custom needs. You can find available ones from below:

```html
<script>
  class {
    data = {};
		twind = {
			// Do not include base style reset (default: use tailwind preflight)
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
					// Tailwind v2 extended color palette
					// (https://tailwindcss.com/docs/customizing-colors#color-palette-reference)
					// List of colors:
					// amber,black,blue,blueGray,coolGray,cyan,emerald,fuchsia,
					// gray,green,indigo,lightBlue,lime,orange,pink,purple,red,
					// rose,teal,trueGray,violet,warmGray,white, yellow
					// Build your palette here
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
Presets need to be installed and added to the presets option of the twind config.

| Preset |      Function      | Description |
|--------------|:-------------|:-------------------------|
|<img width=250/>|<img width=400/>|
| [**Tailwind**](https://twind.style/preset-tailwind) | `presetTailwind()` | Adds all Tailwind v3 classes. It's must if you want to use Tailwind Forms or Typography preset. |
| [**Auto Prefix**](https://twind.style/preset-autoprefix) | `presetAutoprefix()` | Provides a CSS vendor prefixer and property alias mapper
| [**Typography**](https://twind.style/preset-typography) | `presetTypography()` | Add beautiful typographic defaults |
| [**Tailwind Forms**](https://twind.style/preset-tailwind-forms) | `presetTailwindForms()` | Provides a basic reset for form styles |
| [**Rem To Px**](https://github.com/tw-in-js/twind/issues/437#issuecomment-1382433830) | `presetRemToPx({baseValue: 16})` | Converts rem to px with a base value |
| [**Container Queries**](https://twind.style/preset-container-queries) | `presetContainerQueries()` | Provides utilities for container queries |
| [**Ext**](https://twind.style/preset-ext) | `presetExt()` | Adds some commonly used rules and variants that are not part of Tailwind CSS |
| [**Line Clamp**](https://twind.style/preset-line-clamp) | `presetLineClamp()` | adds utilities for visually truncating text after a fixed number of lines |
| [**Radix UI**](https://twind.style/preset-radix-ui) | `presetRadixUi()` | The Radix UI color scales |

## Simply.js Styles
You may be wondering what if you want to override some style of an element which you utilized with Tailwind classes earlier in the template section of your component. So, it's easy. Just right your normal CSS in the style section of your component. Utility classes are good but you have right to say last word. Let's just simply override the `purple` with `blue` using our `<style>` tag:

<repl-component id="fxl9fftbvy2g0yk" download="true"></repl-component>

And last but not least; you can go wild with the combination of simply.js variables and utility classes easyly.

<repl-component id="10h4zxdvn7yag9f" download="true"></repl-component>

## Sources
Here are some links to help you to strengthen your Tailwind muscles:

[Official Handbook of Twind (Config Page)](https://twind.dev/handbook/configuration.html)<br>
[Twind Home](https://twind.style)<br>
[Tailwind Home](https://tailwind.com)<br>
[Tailwind Cheat Sheet](https://nerdcave.com/tailwind-cheat-sheet)<br>
[Tailwind Color Palette](https://tailwindcss.com/docs/customizing-colors#color-palette-reference)

