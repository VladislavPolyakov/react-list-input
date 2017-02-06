module.exports = {
  type: 'react-component',
  npm: {
    esModules: true,
    umd: {
      global: 'ReactListInput',
      externals: {
        react: 'React'
      }
    }
  }
}
