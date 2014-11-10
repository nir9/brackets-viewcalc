define(function (require, exports, module) {


    var CommandManager = brackets.getModule("command/CommandManager"),
        Menus = brackets.getModule("command/Menus"),
        PanelManager = brackets.getModule("view/PanelManager"),
        ExtensionUtils = brackets.getModule("utils/ExtensionUtils"),
        AppInit = brackets.getModule("utils/AppInit");

    var VIEWCALC_EXECUTE = "viewcalc.execute";
    var panel;
    var panelHtml = require("text!panel.html");
    var $calcIcon = $( '<a href="#" title="ViewCalc" id="brackets-viewcalc-icon"></a>' );


    function handleCalcPanel() {
        if (panel.isVisible()) {
            panel.hide();
            $calcIcon.removeClass( 'active' );
            CommandManager.get(VIEWCALC_EXECUTE).setChecked(false);
        } else {
            panel.show();
            $calcIcon.addClass( 'active' );
            CommandManager.get(VIEWCALC_EXECUTE).setChecked(true);
        }
    }

    AppInit.appReady(function () {


        ExtensionUtils.loadStyleSheet(module, "main.css");
        CommandManager.register("Viewport Calculator", VIEWCALC_EXECUTE, handleCalcPanel);

        var menu = Menus.getMenu(Menus.AppMenuBar.VIEW_MENU);
        menu.addMenuItem(VIEWCALC_EXECUTE , 'Ctrl-Alt-V');

        panel = PanelManager.createBottomPanel(VIEWCALC_EXECUTE, $(panelHtml), 200);

        //alert($("#screen-x").height());
        $calcIcon.click(function()
        {

            handleCalcPanel();
        }).appendTo("#main-toolbar .buttons");

        $("#mainpanel")
			.on( 'click', '.close', function() {
				handleCalcPanel();

			} );


        $("#contents *").on('input', function()//Changes the vh whenever someone types in one of the inputs
        {
            $("#result-vh").val(
                parseFloat($("#type-a-value").val()) / parseFloat($("#screen-y").val()) * 100
                + "vh"
            );

            $("#result-vw").val(
                parseFloat($("#type-a-value").val()) / parseFloat($("#screen-x").val()) * 100
                + "vw"
            );
        });


//onchange

    });


});
