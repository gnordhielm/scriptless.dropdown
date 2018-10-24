import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import Content from '../components/Content.jsx'
import Item from '../components/Item.jsx'

storiesOf('Content', module)
  .add('with plain content', () => 
    <Content>
      <div style={{ padding: '1rem' }}>Content</div>
    </Content>
  )
  .add('with items', () => 
    <Content>
      <Item>Item 1</Item>
      <Item>Item 2</Item>
    </Content>
  )