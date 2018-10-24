import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'

import Dropdown from '../components/Dropdown.jsx'
import Trigger from '../components/Trigger.jsx'
import Content from '../components/Content.jsx'
import Item from '../components/Item.jsx'


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
    .add('with items', () => (
        <Dropdown>
            <Trigger>Trigger</Trigger>
            <Content>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
            </Content>
        </Dropdown>
    ))
    .add('controlled', () => (
        <Dropdown hasFocus={boolean('Has Focus', false)}>
            <Trigger isDisabled>Trigger</Trigger>
            <Content>
                <Item>Item 1</Item>
                <Item>Item 2</Item>
            </Content>
        </Dropdown>
    ))
    .add('right justified', () => (
        <Dropdown hasFocus justify={'right'}>
            <Trigger isDisabled>Trigger</Trigger>
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