var shopifyRoutes = require('./routes/shopify');
var greeneStepRoutes = require('./routes/greenesteps');

exports.route = function(app) {
    app.use('/shopify', shopifyRoutes);
    app.use('/greenesteps', greeneStepRoutes);
};