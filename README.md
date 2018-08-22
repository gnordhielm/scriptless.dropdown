# @leiops/dropdown

[![npm](https://img.shields.io/npm/dt/@leiops/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@leiops/dropdown)
[![npm](https://img.shields.io/npm/v/@leiops/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@leiops/dropdown)

A flexible dropdown component system for React Apps.

### How to use

This library provides three React components that you can use as a basis for any kind of dropdown menu:

- `Dropdown`: The base element for your dropdown. This contains both the `Trigger` and the `Content`, and handles communication between them.
- `Trigger`: The element that will cause your dropdown to appear when clicked.
- `Content`: Contains the "filling" of your dropdown. Generally, this is a list of links.

Keep in mind that `Trigger` and `Content` **must be direct children** of `Dropdown`. Here's a quick example:

```js
var React = require('react');
var Dropdown = require('react-simple-dropdown');

var Menu = React.createClass({
    render: function () {
        return (
            <Dropdown>
                <Dropdown.Trigger>Profile</Dropdown.Trigger>
                <Dropdown.Content>
                    <img src="avatar.jpg" /> Username
                    <ul>
                        <li>
                            <a href="/profile">Profile</a>
                        </li>
                        <li>
                            <a href="/favorites">Favorites</a>
                        </li>
                        <li>
                            <a href="/logout">Log Out</a>
                        </li>
                    </ul>
                </Dropdown.Content>
            </Dropdown>
        )
    }
});
```

### Options

Options can be passed to `Dropdown` as props. A list of available options can be found below. These must be passed to the containing `Dropdown` component.

Property | Type | Description
----- | ----- | -----
**active** | *boolean* | Manually show/hide the `Content`. Make sure to unset this or the dropdown will stay open.
**disabled** | *boolean* | Disable toggling of the dropdown by clicking on `Trigger`. Toggling with `active`, `show()`, and `hide()` is still possible.
**removeElement** | *boolean* | Remove the `Content` element when inactive (rather than just hide it).
**onShow** | *function* | Callback for when `Content` is shown.
**onHide** | *function* | Callback for when `Content` is hidden.


### Instance

Each instance of `Dropdown` has some methods developers might find useful.

Method | Description
----- | -----
**show** | Shows the dropdown.
**hide** | Hides the dropdown.

### Working

Right now, the dropdown watches child mutations and puts together a list of every element removed from within in order to deal with a situation where removing a child which was clicked on would close the dropdown. This may not be the desired behavior, perhaps only one removed item should be saved?

Portal and Dropdown contain almost idential code, I bet that can be dried up.