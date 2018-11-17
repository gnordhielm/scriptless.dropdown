import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import Dropdown from '../src/components/Dropdown.jsx'
import Trigger from '../src/components/Trigger.jsx'
import Content from '../src/components/Content.jsx'
import Item from '../src/components/Item.jsx'


storiesOf('Dropdown', module)
    .addDecorator(withKnobs)
    .add('basic', () => (
        <Dropdown>
            <Trigger>Trigger</Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))
    .add('complex trigger', () => (
        <Dropdown>
            <Trigger>
                <div>
                    <input type="text" />
                </div>
            </Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))
    .add('hoverable', () => (
        <Dropdown isHoverable>
            <Trigger>Trigger</Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))
    .add('controlled', () => (
        <Dropdown hasFocus={boolean('Has Focus', false)}>
            <Trigger isDisabled>Trigger</Trigger>
            <Content>
                I am content, hear me roar.
            </Content>
        </Dropdown>
    ))
    .add('disabled trigger', () => (
        <Dropdown>
            <Trigger isDisabled>Trigger</Trigger>
            <Content>
                I am content, hear me roar.
            </Content>
        </Dropdown>
    ))
    .add('right justified', () => (
        <Dropdown justify={'right'}>
            <Trigger>Trigger</Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))
    .add('open upward', () => (
        <div style={{ 
            height: '100%', 
            display: 'flex', 
            flexFlow: 'column-reverse' 
        }}>
            <Dropdown>
                <Trigger>Trigger</Trigger>
                <Content>
                    <div style={{ padding: '0.5rem' }}>
                        Content
                    </div>
                </Content>
            </Dropdown>
        </div>
    ))