# @leiops/dropdown

[![npm](https://img.shields.io/npm/dt/@leiops/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@leiops/dropdown)
[![npm](https://img.shields.io/npm/v/@leiops/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@leiops/dropdown)

A flexible dropdown component system for React Apps.

### How to use

This library provides several components which you can use as a basis for any kind of dropdown menu:

`Dropdown` - a wrapper element for everything.
`Dropdown.Trigger` - the element which tells the Dropdown container to show the dropdown \.
`Dropdown.Content` - a wrapper for all of the content hidden/shown at the discretion of the Dropdown container.

Keep in mind that `Trigger` and `Content` **must be direct children** of `Dropdown`. Here's a quick example:

```jsx
import Dropdown from '@leiops/dropdown'


const Menu = ({ onLogOut, onToggleMode }) => (
    <Dropdown>
        <Dropdown.Trigger>Profile</Dropdown.Trigger>
        <Dropdown.Content>
            <div onClick={onToggleMode}>Toggle Dark Mode</div>
            <div onClick={onLogOut}>Log Out</div>
        </Dropdown.Content>
    </Dropdown>
)
```

### Instance

Each instance of `Dropdown` has some methods developers might find useful.

Method | Description
----- | -----
**show** | Shows the dropdown.
**hide** | Hides the dropdown.

### Working

Right now, the dropdown watches child mutations and puts together a list of every element removed from within in order to deal with a situation where removing a child which was clicked on would close the dropdown. This may not be the desired behavior, perhaps only one removed item should be saved?

Portal and Dropdown contain almost idential code, I bet that can be dried up.