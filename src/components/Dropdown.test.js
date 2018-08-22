import React from 'react'
import ReactDOM from 'react-dom'
import Dropdown from './Dropdown'
import Trigger from './Trigger'
import Content from './Content'
import '../../test/global_mocks/MutationObserver'

test('renders', () => {
  const div = document.createElement('div')
  const dropdown = (
    <Dropdown>
        <Trigger>
            Open dropdown
        </Trigger>
        <Content>
            <div style={{ padding: '0.5rem' }}>
                Content
            </div>
        </Content>
    </Dropdown>
  )
  ReactDOM.render(dropdown, div)
  ReactDOM.unmountComponentAtNode(div)
})
