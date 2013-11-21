var MainController, StartupWindow, TopWindow, configurationWizard, mainController, osname, startupWindow, topWindow;

configurationWizard = Ti.App.Properties.getBool("configurationWizard");

osname = Ti.Platform.osname;

if (osname === "android") {
  TopWindow = require("ui/android/topWindow");
  topWindow = new TopWindow();
  topWindow.open();
} else if (osname === "iphone") {
  if (configurationWizard === null || typeof configurationWizard === "undefined" || configurationWizard === false) {
    StartupWindow = require("ui/" + osname + "/startupWindow");
    startupWindow = new StartupWindow();
    startupWindow.open();
  } else {
    MainController = require("controller/mainController");
    mainController = new MainController();
    mainController.createTabGroup();
  }
} else {
  MainController = require("controller/mainController");
  mainController = new MainController();
  mainController.createTabGroup();
}
