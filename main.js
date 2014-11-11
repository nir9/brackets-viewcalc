define(function (require, exports, module) {




    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        PanelManager = brackets.getModule("view/PanelManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        AppInit = brackets.getModule("utils/AppInit");
    var NodeConnection = brackets.getModule("utils/NodeConnection");
    var bracketsStrings = brackets.getModule("strings");
    var VIEWCALC_EXECUTE = "viewcalc.execute";
    var panel;
    var panelHtml = require("text!panel.html");
    var $calcIcon = $('<a href="#" title="ViewCalc" id="brackets-viewcalc-icon"></a>');
    var nodeConnection = new NodeConnection();



    function chain() { //For copy
        var functions = Array.prototype.slice.call(arguments, 0);

        if (functions.length > 0) {
            var firstFunction = functions.shift();
            var firstPromise = firstFunction.call();
            firstPromise.done(function () {
                chain.apply(null, functions);
            });
        }
    }

    function handleCalcPanel() {
        if (panel.isVisible()) {
            panel.hide();
            $calcIcon.removeClass('active');
            CommandManager.get(VIEWCALC_EXECUTE).setChecked(false);
        } else {
            panel.show();
            $calcIcon.addClass('active');
            CommandManager.get(VIEWCALC_EXECUTE).setChecked(true);
        }
    }

    AppInit.appReady(function () {









        /*Node Copy*/
        function connect() {
            var connectionPromise = nodeConnection.connect(true);
            connectionPromise.fail(function () {
                console.error("[brackets-simple-node] failed to connect to node");
            });
            return connectionPromise;
        }


        function loadClipboard() {
            var path = ExtensionUtils.getModulePath(module, "node/clipboard");
            var loadPromise = nodeConnection.loadDomains([path], true);
            loadPromise.fail(function (e) {
                console.log(e);
                console.log("[brackets-simple-node] failed to load clipboard");
            });
            return loadPromise;
        }


        function clipboardLoad() {
            var loadPromise = nodeConnection.domains.clipboard.load();
            loadPromise.fail(function (err) {
                console.error("[brackets-simple-node] failed to run clipboard.load", err);
            });
            loadPromise.done(function (err) {
                //loaded
            });
            return loadPromise;
        }

        chain(connect, loadClipboard, clipboardLoad);
        /*Node Copy Until Here*/





        /*Settings*/
        ExtensionUtils.loadStyleSheet(module, "main.css");
        CommandManager.register("Viewport Calculator", VIEWCALC_EXECUTE, handleCalcPanel);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(VIEWCALC_EXECUTE, 'Ctrl-Alt-V');

        panel = PanelManager.createBottomPanel(VIEWCALC_EXECUTE, $(panelHtml), 200);
        /*Settings Until Here*/


        /*Events*/
        $calcIcon.click(function () {

            handleCalcPanel();
        }).appendTo("#main-toolbar .buttons");

        $("#mainpanel")
            .on('click', '.close', function () {
                handleCalcPanel();

            });


        $("#contents *").on('input', function () //Changes the vh whenever someone types in one of the inputs
            {

                $("#contents button").html("Copy");

                $("#result-vh").val(
                    parseFloat(($("#type-a-value").val()) / parseFloat($("#screen-y").val()) * 100)|| 0 + "vh"
                );

                $("#result-vw").val(
                    parseFloat(($("#type-a-value").val()) / parseFloat($("#screen-x").val()) * 100)|| 0 + "vw"
                );
            });



        $("#contents button").click(function () {
            $("#contents button").html("Copy"); //Removes previous Copied!

            $(this).html("Copied!");

            if ($(this).attr("id") == "button-vw") //Check if button is to copy vw or vh
                nodeConnection.domains.clipboard.callCopy($("#result-vw").val());
            else
                nodeConnection.domains.clipboard.callCopy($("#result-vh").val());
        });
        //onchange
        /*Events Until Here*/
    });




});
