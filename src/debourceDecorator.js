import { debounce } from 'lodash'

export default (wait, opts) => (...args) => {
  const func = args[2].value
  return debounce(func, wait, opts)
}

