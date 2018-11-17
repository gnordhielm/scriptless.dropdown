# @scriptless/dropdown

<img src="https://siteless.co/assets/image/5710239819104256" width="600" />

[![npm](https://img.shields.io/npm/dt/@scriptless/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@scriptless/dropdown)
[![npm](https://img.shields.io/npm/v/@scriptless/dropdown.svg?style=flat-square)](https://www.npmjs.com/package/@scriptless/dropdown)

A flexible dropdown component system for React apps.

## Quick Start

This library provides a default export, `Dropdown`, which will wrap any dropdown setup. It drives the robust focus-management logic that this library provides.

`Dropdown` also provides two children, `Dropdown.Trigger` and `Dropdown.Content`, everything you need to compose a dropdown. Here's an example:

```jsx
import React from 'react'
import Dropdown from '@scriptless/dropdown'

const UserMenu = props => (
    <div className="UserMenu">
        <Dropdown>
            <Dropdown.Trigger>
                {props.userName}
            </Dropdown.Trigger>
            <Dropdown.Content>
                <img src={props.userAvatar} />
            </Dropdown.Content>
        </Dropdown>
    </div>
)

export default UserMenu

```

`Dropdown.Trigger` will always be rendered to the screen, clicking it will show and hide `Dropdown.Content`.

