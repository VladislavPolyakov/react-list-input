module.exports = {
  type: 'react-component',
  babel: {
    plugins: ['ramda']
  },
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
