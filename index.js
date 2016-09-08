'use strict';

var RawModule = require('webpack/lib/RawModule');

function EmptyModulePlugin(resourceRegExp, source) {
    this.resourceRegExp = resourceRegExp;
    this.source = source || '/* empty */';
}

module.exports = EmptyModulePlugin;

EmptyModulePlugin.prototype.apply = function (compiler) {
    var self = this;

    compiler.plugin('normal-module-factory', function (nmf) {
        nmf.plugin('resolver', function (resolver) {
            return function (data, callback) {
                var request = data.request;

                if (self.resourceRegExp.test(request)) {
                    var source = self.source;

                    if (typeof self.source === 'function') {
                        source = self.source(request);
                    }

                    return callback(null, new RawModule(
                        source,
                        'empty ' + context + ' ' + request,
                        request + ' (empty)'
                    ));
                }

                return resolver(data, callback);
            };
        });
    });
};
