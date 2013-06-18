exports.Item = function(server) {
    this.x = 0;
    this.y = 0;

    var that = this;
    var types = ["f"];
    var util = require('./utilities.js');

    this.setNewPosition = function() {
        that.type = getType();
        that.x = util.randInt(0, server.fieldWidth - 1);
        that.y = util.randInt(0, server.fieldHeight - 1);
    };

    var getType = function() {
        var t = 0;
        return types[t];
    };

    this.type = getType();
    this.setNewPosition();

    return this;
};