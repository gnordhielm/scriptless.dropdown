import React from 'react'
import ReactDOM from 'react-dom'
import Dropdown from './Dropdown'
import '../../test/global_mocks/MutationObserver.js'

it('renders without crashing', () => {
  const div = document.createElement('div')
  ReactDOM.render(<Dropdown />, div)
  ReactDOM.unmountComponentAtNode(div)
})
