import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import Content from '../Content'

storiesOf('Content', module)
  .add('with plain content', () => 
    <Content>
      <div style={{ padding: '1rem' }}>Content</div>
    </Content>
  )