import Enzyme from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
// import './global_mocks/MutationObserver'

Enzyme.configure({
  adapter: new Adapter()
})