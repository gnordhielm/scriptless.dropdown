import React from 'react'
import ReactDOM from 'react-dom'
import Content from './Content'

test('renders', () => {
  const div = document.createElement('div')
  const content = <Content>Stuff</Content>
  ReactDOM.render(content, div)
  ReactDOM.unmountComponentAtNode(div)
})
