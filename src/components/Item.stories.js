import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import Item from './Item'

storiesOf('Item', module)
  .add('with content', () => 
    <Item onClick={action('clicked')}>Text</Item>)
  .add('with first child content', () => 
    <Item onClick={action('clicked')}>
        <span>❗️</span>
        <span>Text</span>
    </Item>)