import React from 'react'
import ReactDOM from 'react-dom'
import Item from './Item'

test('renders', () => {
  const div = document.createElement('div')
  const item = <Item>Content</Item>
  ReactDOM.render(item, div)
  ReactDOM.unmountComponentAtNode(div)
})
