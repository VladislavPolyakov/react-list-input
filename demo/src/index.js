import React from 'react'
import {render} from 'react-dom'

import ListInput from '../../src'

const Input = ({value, onChange, type = 'text'}) =>
  <input type={type} value={value} onChange={e => onChange(e.target.value)} />

class Demo extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      value: ['alpha', 'beta', 'gamma', 'delta', 'epsillon']
    }
    this.Item.displayName = 'Item'
    this.StagingItem.displayName = 'StagingItem'
  }

  Item ({decorateHandle, removable, onChange, onRemove, value}) {
    return (
      <div>
        {decorateHandle(<span>+</span>)}
        {removable && <span onClick={onRemove}>X</span>}
        <Input value={value} onChange={onChange} />
      </div>
    )
  }

  StagingItem ({value, onAdd, canAdd, add, onChange}) {
    return (
      <div>
        {canAdd && <span onClick={onAdd}>Add</span>}
        <Input value={value} onChange={onChange} />
      </div>
    )
  }

  render () {
    return (
      <ListInput
        initialStagingValue=''
        onChange={value => this.setState({value})}
        maxItems={10}
        minItems={1}
        ItemComponent={this.Item}
        StagingComponent={this.StagingItem}
        value={this.state.value}
      />
    )
  }
}

render(<Demo />, document.querySelector('#demo'))
