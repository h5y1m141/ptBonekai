class scrollableView
  constructor:() ->
    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      color:"#333"
      backgroundColor:keyColor
    winTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:"#333"
      font:
        fontSize:18
        fontFamily : 'Rounded M+ 1p'
        fontWeight:'bold'
      text:"CraftBeerFan"
      
    @scrollView = Titanium.UI.createScrollableView
      height:460
      showPagingControl:true
      pagingControlHeight:30
      
    @_createView()
    
    win = Ti.UI.createWindow
      title:"CraftBeerFan"
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      navBarHidden:false
      tabBarHidden:false
      
    if Ti.Platform.osname is 'iphone'
      win.setTitleControl winTitle
      
    win.add @scrollView  
    return win
    
  _createView:() =>
    menuList = [
      description:"このアプリケーションは日本全国のクラフトビールが飲める/買えるお店を探すことが出来ます"
      screenCapture:"ui/image/logo.png"
    ,
      description:"現在の位置から近い所のお店を探すことができます。"
      screenCapture:"ui/image/map.png"      
    ,
      description:"飲めるお店はタンブラーのアイコン、買えるお店はボトルのアイコンで表現してます"
      screenCapture:"ui/image/iconImage.png"      
    ,
    
      description:"リストからもお店を探すことができますので、これから出張や旅行先などでクラフトビールが飲める・買えるお店の下調べにも活用することができます"
      screenCapture:"ui/image/list.png"
    ,
      description:"気になったお店があったら、お気に入りに登録することもできます"
      screenCapture:"ui/image/favorite.png"
    ,
      description:"アプリケーションの説明は以上になります。Enjoy!"
      screenCapture:null

    ]
    for menu in menuList
      view = Ti.UI.createView
        width:300
        height:400
        backgroundColor:@baseColor.backgroundColor
        top:20
        left:10
        zIndex:1
        borderRadius:10
      
      label = Ti.UI.createLabel
        textAlign:'left'
        color:@baseColor.color
        width:280
        font:
          fontSize:16
          fontFamily:'Rounded M+ 1p'
          fontWeight:'bold'
        height:70
        top:10
        left:20
        text:menu.description
      view.add label
      
      if menu.screenCapture isnt null
        screenCapture = Ti.UI.createImageView
          width:240
          height:240
          top:100
          left:40
          image:menu.screenCapture
        view.add screenCapture
      else
        endPointBtn = Ti.UI.createLabel
          color:@baseColor.barColor
          backgroundColor:"#DA5019"
          width:150
          height:50
          top:150
          textAlign:"center"
          left:75
          borderWidth:0
          borderRadius:10
          font:
            fontSize:24
            fontFamily:'Rounded M+ 1p'
          text:"START"
    
        endPointBtn.addEventListener('click',(e)->
          Ti.App.Properties.setBool "configurationWizard", false
          MainController = require("controller/mainController")
          mainController = new MainController()
          mainController.init()
    
        )    
        view.add endPointBtn
        
      @scrollView.addView view
      
    return

         
module.exports = scrollableView  