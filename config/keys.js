if (process.env.NODE_ENV === 'production') {
    module.exposts = require('./prod')
} else {
    module.exposts = require('./dev')
}