import React from 'react'
import { storiesOf } from '@storybook/react'
import { action } from '@storybook/addon-actions'
import { withKnobs, boolean } from '@storybook/addon-knobs'
import { State, Store } from "@sambego/storybook-state"

import Dropdown from '../Dropdown'
import Trigger from '../Trigger'
import Content from '../Content'

const store = new Store({
    isTrue: false
})

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
    .add('focusable trigger', () => (
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
    .add('disappearing focusable trigger', () => (
        <State store={store}>
            {state => (
                <div>
                    <Dropdown>
                        <Trigger>
                            <div>
                                {
                                    state.isTrue ? 
                                        <div>Trigger</div> :
                                        <input type="text" />
                                }
                            </div>
                        </Trigger>
                        <Content>
                            <div style={{ padding: '0.5rem' }}>
                                Content
                            </div>
                        </Content>
                    </Dropdown>
                    <button 
                        onClick={() => {
                            store.set({ isTrue: !store.get("isTrue") })
                        }}
                    >Toggle Trigger</button>
                </div>
            )}
        </State>
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
        <Dropdown 
            hasFocus={boolean('Has Focus', false)}
            onHide={action('onHide')}
            onShow={action('onShow')}
        >
            <Trigger>Trigger</Trigger>
            <Content>
                I am content, hear me roar.
            </Content>
        </Dropdown>
    ))
    .add('with onFocus and onBlur', () => (
        <Dropdown 
            onFocus={action('onFocus')}
            onBlur={action('onBlur')}
        >
            <Trigger>Trigger</Trigger>
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
        <Dropdown justify="right">
            <Trigger>Trigger</Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))
    .add('right justified with justifyOffset', () => (
        <Dropdown justify="right" justifyOffset="-10px">
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
    .add('style props', () => (
        <Dropdown style={{ color: 'dodgerblue' }}>
            <Trigger>Trigger</Trigger>
            <Content>
                <div style={{ padding: '0.5rem' }}>
                    Content
                </div>
            </Content>
        </Dropdown>
    ))