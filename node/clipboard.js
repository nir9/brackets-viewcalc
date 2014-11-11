(function () {
    "use strict";

    var node_copy_paste = require('copy-paste');
    var domainManager;

    function load(){

    }




    function bracketCopy(userSelection) {

        node_copy_paste.copy(userSelection);
    }


    function init(DomainManager) {
        if (!DomainManager.hasDomain("clipboard")) {
            DomainManager.registerDomain("clipboard", {major: 0, minor: 1});
        }




        domainManager = DomainManager;
    }

    exports.init = init;

}());
