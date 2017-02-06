import R from 'ramda'
import autobind from 'autobind-decorator'
import React, { PropTypes } from 'react'
import { debounce } from 'lodash'

import genKey from './genKey'
import Sortable from 'react-drag-sort'

/**
 * @name ListInput
 *
 * an input for a variable-length
 * list of items
 *
 * handles keys and dragging automatically
 *
 * these are the propTypes:
 */

const propTypes = {
  ItemComponent: PropTypes.func.isRequired,
  StagingComponent: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  initialStagingValue: PropTypes.any.isRequired,
  onChange: PropTypes.func,
  maxItems: PropTypes.number,
  minItems: PropTypes.number
}

/*
 * ItemComponent is passed
 *   - decorateHandle (func) element -> element
 *     make an element the drag hanldle
 *     feel free to pass your whole component in
 *
 *   - onChange (func)
 *
 *   - onRemove (func)
 *
 *   - removable (bool)
 *
 *   - value (any)
 *
 * StagingComponent is passed:
 *
 *   - value (any)
 *
 *   - onChange (func) any -> void
 *     update the staged value
 *
 *   - add (func) any -> void
 *     add a given value and reset the staged value
 *
 *   - onAdd (func) void -> void
 *     add from the staging area and reset the staged value
 *
 *   - canAdd (bool)
 */

const addKey = value => ({
  value,
  key: genKey()
})
const addKeys = R.map(addKey)

const removeKey = R.prop('value')
const removeKeys = R.map(removeKey)

class ListInput extends React.Component {
  static displayName = 'ListInput'
  static propTypes = propTypes

  constructor (props) {
    super(props)

    this.maybeRefreshKeys = debounce(this.maybeRefreshKeys, 50)

    this.state = {
      value: addKeys(props.value),
      stagedValue: props.initialStagingValue,
      WrappedItemComponent: null
    }
  }

  componentWillMount () {
    this.updateWrappedItemComponent()
  }

  componentWillUpdate (nextProps, nextState) {
    if (nextProps.value.length !== this.props.value.length) {
      this.updateWrappedItemComponent()
    }
  }

  componentWillReceiveProps (nextProps) {
    this.maybeRefreshKeys(nextProps)
  }

  @autobind
  maybeRefreshKeys (nextProps) {
    if (R.equals(removeKeys(this.state.value), nextProps.value)) return
    this.setState({
      value: addKeys(nextProps.value)
    })
  }

  @autobind
  resetStagingValue () {
    this.setState({
      stagedValue: this.props.initialStagingValue
    })
  }

  @autobind
  changeState (value) {
    this.setState({
      value
    })
    this.props.onChange(removeKeys(value))
  }

  @autobind
  findWithSameKey (v) {
    return R.findIndex(R.propEq('key', v.key), this.state.value)
  }

  @autobind
  remove (v) {
    const index = this.findWithSameKey(v)
    const newValue = R.remove(index, 1, this.state.value)

    this.changeState(newValue)
  }

  @autobind
  change (v) {
    const index = this.findWithSameKey(v)
    const newValue = R.update(index, v, this.state.value)
    this.changeState(newValue)
  }

  @autobind
  makeItemComponentWrapper ({ItemComponent, minItems}) {
    return ({value, onChange, decorateHandle, onRemove}) => {
      const removable = this.props.value.length > (this.props.minItems || 0)
      return (
        <ItemComponent
          {...{
            ItemComponent,
            decorateHandle,
            value
          }}
          removable={removable}
          onChange={onChange}
          value={value}
          onRemove={removable ? onRemove : R.identity}
        />
      )
    }
  }

  @autobind
  updateWrappedItemComponent () {
    this.setState({
      WrappedItemComponent: this.makeItemComponentWrapper({
        ItemComponent: this.props.ItemComponent,
        minItems: this.props.minItems,
        value: this.props.value,
        change: this.change,
        remove: this.remove
      })
    })
  }

  render () {
    const {
      value,
      StagingComponent,
      initialStagingValue,
      maxItems: _maxItems
    } = this.props

    const maxItems = _maxItems || 5

    const addFromStaging = () => {
      const newValue = R.append(addKey(this.state.stagedValue), this.state.value)

      this.changeState(newValue)
      this.resetStagingValue()
    }

    const add = v => {
      const newValue = R.append(addKey(v), this.state.value)

      this.changeState(newValue)
      this.resetStagingValue()
    }

    return (
      <div>
        { value.length < maxItems &&
          <StagingComponent
            onAdd={addFromStaging}
            canAdd={this.state.value.length < maxItems && !R.equals(this.state.stagedValue, initialStagingValue)}
            add={add}
            value={this.state.stagedValue}
            onChange={stagedValue => {
              this.setState({stagedValue})
            }}
          />
        }

        { value &&
          <Sortable
            collection={this.state.value}
            onChange={this.changeState}
            Component={this.state.WrappedItemComponent}
          />
        }
      </div>
    )
  }
}

export default ListInput

