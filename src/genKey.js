function* idMaker () {
  let index = 0
  while (true) yield index++
}

const gen = idMaker()

const genKey = () =>
  gen.next().value

export default genKey

