import React from 'react'
import ReactDOM from 'react-dom'
import Trigger from './Trigger'

test('renders', () => {
  const div = document.createElement('div')
  const trigger = <Trigger>Trigger</Trigger>
  ReactDOM.render(trigger, div)
  ReactDOM.unmountComponentAtNode(div)
})

test('renders active', () => {
  const div = document.createElement('div')
  const trigger = <Trigger _isActive={true} >Trigger</Trigger>
  // TO DO - expect trigger to have active class
  ReactDOM.render(trigger, div)
  ReactDOM.unmountComponentAtNode(div)
})
