configurationWizard = Ti.App.Properties.getBool "configurationWizard"

# GoogleAnalyticsによるトラッキングのための処理


osname = Ti.Platform.osname

if osname is "android"
  TopWindow = require("ui/android/topWindow")
  topWindow = new TopWindow()
  topWindow.open()
  # Map = require("ui/android/mapWindow")
  # mapWindow = new Map()
  # mapWindow.open()

else if osname is "iphone"

  if configurationWizard is null or typeof configurationWizard is "undefined" or configurationWizard is false

    StartupWindow = require("ui/#{osname}/startupWindow")
    startupWindow = new StartupWindow()  
    startupWindow.open()
  else
    MainController = require("controller/mainController")
    mainController = new MainController()
    mainController.createTabGroup()
else
    MainController = require("controller/mainController")
    mainController = new MainController()
    mainController.createTabGroup()
