const errorController = {}

errorController.errorLink = (req, res, next) => {
    throw new Error('Intentional 500-type error');
}

module.exports = errorController;