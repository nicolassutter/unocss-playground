import { defineConfig } from 'unocss'
import { presetWind, colors as defaultColors } from '@unocss/preset-wind'
import { omit, pick } from 'radash'

const config = presetWind()

export default defineConfig({
  presets: [
    /**
     * On ne met pas `theme` dans le preset car il contient
     * toutes les couleurs de tailwind et nous souhaitons
     * les remplacer par les nôtres.
     */
    omit(config, ['theme'])
  ],
  postprocess: [
    /**
     * Dans tailwind `spacing.1` === `4px` | `spacing.1` === `0.25rem`
     * Mais nous souhaitons `spacing.1` === `1px` | `spacing.1` === `0.0625rem`
     */
    (util) => {
      const remRE = /^(-?[\.\d]+)rem$/g

      util.entries.forEach((i) => {
        const [_cssProp, cssValue] = i

        if (typeof cssValue === 'string' && remRE.test(cssValue))
          i[1] = cssValue.replace(remRE, (_, remValue) => `${remValue / 4}rem`)
      })
    },
  ],
  theme: {
    ...config.theme,
    colors: {
      ...pick(defaultColors, ['transparent', 'white']),
      red: '#f00'
    },
  },
})
