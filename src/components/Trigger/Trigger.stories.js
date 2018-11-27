import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
// import { withKnobs, text, boolean, number } from '@storybook/addon-knobs'

import Trigger from '../Trigger'

storiesOf('Trigger', module)
  .add('plain trigger', () => 
    <Trigger onClick={action('clicked')}>Trigger</Trigger>)
  .add('with active dropdown', () => 
    <Trigger _isActive={true} onClick={action('clicked')}>Trigger</Trigger>)