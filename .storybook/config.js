import { configure } from '@storybook/react'
import '@storybook/addon-knobs/register'
import './storybook.css'
import '../src/styles.css'

const req = require.context('../src/stories', true, /.stories.js$/)
const loadStories = () => {
  req.keys().forEach(filename => req(filename))
}

configure(loadStories, module)
