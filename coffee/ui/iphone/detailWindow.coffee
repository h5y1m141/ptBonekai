class detailWindow
  constructor:(data)->
    TiISRefreshControl = require('be.k0suke.tiisrefreshcontrol')

    keyColor = "#f9f9f9"
    @baseColor =
      barColor:keyColor
      backgroundColor:"#f3f3f3"
      keyColor:"#DA5019"
      textColor:"#333"
      textGrayColor:"#666"      
      phoneColor:"#3261AB"
      favoriteColor:"#DA5019"
      feedbackColor:"#DA5019"
      separatorColor:'#cccccc'
      
    @detailWindow = Ti.UI.createWindow
      title:data.title
      barColor:@baseColor.barColor
      backgroundColor:@baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:false
      
    
    @_createNavbarElement(data.title)
    @_createTableView(data)
    @_createDescription(data.pict,data.details)
    ActivityIndicator = require("ui/activityIndicator")
    @activityIndicator = new ActivityIndicator()
    @detailWindow.add @activityIndicator
    
    @_findComments()
    
    
    return @detailWindow

  _createDescription:(picturePath,details) ->
    container = Ti.UI.createView
      left:10
      top:10
      width:320
      height:180
    
    pictImage = Ti.UI.createImageView
      image: picturePath
      width:150
      height:150
      top:5
      left:5
      borderRadius:3
      borderColor:@baseColor.separatorColor
      
    details = Ti.UI.createLabel
      text:details
      width:150
      height:100
      top:5
      left:160
      textAlign: 'left'
      color:@baseColor.textGrayColor
      font:
        fontSize:10
        
    button = Ti.UI.createLabel
      width:120
      height:40
      top:110
      left:175
      textAlign:'center'
      text:'投票する'
      font:
        fontSize:18
        fontWeight:'bold'
      # backgroundColor:"#d8514b" # 赤ベース      
      backgroundColor:"#4cda64" # 緑ベース      
      color:@baseColor.barColor      
      borderWidth:1
      borderRadius:10
      borderColor:@baseColor.backgroundColor
    button.addEventListener('click',(e) =>
    )
    container.add pictImage
    container.add details
    container.add button
    return @detailWindow.add container
        
  _createNavbarElement:(title) ->
    backButton = Titanium.UI.createButton
      backgroundImage:"ui/image/backButton.png"
      width:44
      height:44
      
    backButton.addEventListener('click',(e) =>
      return @detailWindow.close({animated:true})
    )
    
    @detailWindow.leftNavButton = backButton
      
    detailWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:@baseColor.textColor
      font:
        fontSize:14
        fontWeight:'bold'
      text:title
      

    @detailWindow.setTitleControl detailWindowTitle
      
    return
    
  _createTableView:(data) ->

    @tableView = Ti.UI.createTableView
      width:'auto'
      height:'auto'
      top:200
      left:0
      backgroundColor:@baseColor.backgroundColor
      separatorColor:@baseColor.backgroundColor
      zIndex:1
      

    
    @tableView.addEventListener('click',(e) =>

    )

    return @detailWindow.add @tableView
    
  _findComments:() ->
    that = @

    KloudService = require("model/kloudService")
    kloudService = new KloudService()
    @activityIndicator.show()

    kloudService.findComments((comments) ->
      for comment in comments
        Ti.API.info "eventID: #{comment.custom_fields.eventID} and comment: #{comment.message}"
      that.activityIndicator.hide()
        
    )                
  _createFavoriteDialog:(shopName) ->
    t = Titanium.UI.create2DMatrix().scale(0.0)
    unselectedColor = "#666"
    selectedColor = "#222"
    selectedValue = false
    favoriteDialog = Ti.UI.createView
      width:300
      height:280
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
    titleForMemo = Ti.UI.createLabel
      text: "メモ欄"
      width:300
      height:40
      color:@baseColor.barColor
      left:10
      top:5
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
      color:@baseColor.textColor
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
    # 入力完了後、キーボードを消す  
    textArea.addEventListener('return',(e)->
      contents = e.value
      Ti.API.info "登録しようとしてるメモの内容は is #{contents}です"
      textArea.blur()
    )
    
    textArea.addEventListener('blur',(e)->
      contents = e.value
      Ti.API.info "blur event fire.content is #{contents}です"
    )  
    
    registMemoBtn = Ti.UI.createLabel
      bottom:30
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"登録する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultMapViewStyle()
      that.activityIndicator.show()
      # ACSにメモを登録
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      Ti.API.info "contents is #{contents}"
      ratings = ratings
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"

      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.createReview(ratings,contents,shopName,currentUserId,(result) =>
        that.activityIndicator.hide()
        if result.success
          alert "登録しました"
        else
          alert "すでに登録されているか\nサーバーがダウンしているために登録することができませんでした"
        that._hideDialog(favoriteDialog,Ti.API.info "done")

      )
      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:30      
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultMapViewStyle()
      @_hideDialog(favoriteDialog,Ti.API.info "done")
    )
    
    favoriteDialog.add textArea
    favoriteDialog.add titleForMemo
    favoriteDialog.add registMemoBtn
    favoriteDialog.add cancelleBtn
    
    return favoriteDialog
    
  _createPhoneDialog:(phoneNumber,shopName) ->
    that = @
    t = Titanium.UI.create2DMatrix().scale(0.0)
    _view = Ti.UI.createView
      width:300
      height:240
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:@baseColor.textColor
      zIndex:20
      transform:t
      
    callBtn = Ti.UI.createLabel
      width:120
      height:40
      right:20
      bottom:40
      borderRadius:5      
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'はい'
      textAlign:"center"

    callBtn.addEventListener('click',(e) ->
      that._setDefaultMapViewStyle()
      that._hideDialog(_view,Titanium.Platform.openURL("tel:#{phoneNumber}"))

    )
    
    cancelleBtn = Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:40
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'いいえ'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) ->
      that._setDefaultMapViewStyle()
      that._hideDialog(_view,Ti.API.info "cancelleBtn hide")
      
    ) 
    confirmLabel = Ti.UI.createLabel
      top:20
      left:10
      textAlign:'center'
      width:300
      height:150
      color:@baseColor.barColor
      font:
        fontSize:16
        fontFamily:'Rounded M+ 1p'
      text:"#{shopName}の電話番号は\n#{phoneNumber}です。\n電話しますか？"
      
    _view.add confirmLabel
    _view.add cancelleBtn
    _view.add callBtn
    
    return _view

  _createFeedBackDialog:(shopName) ->
    Ti.API.info "createFeedBackDialog start shopName is #{shopName}"
    t = Titanium.UI.create2DMatrix().scale(0.0)
    unselectedColor = "#666"
    selectedColor = "#222"
    selectedValue = false
    _view = Ti.UI.createView
      width:300
      height:280
      top:0
      left:10
      borderRadius:10
      opacity:0.8
      backgroundColor:"#333"      
      zIndex:20
      transform:t
    
    titleForMemo = Ti.UI.createLabel
      text: "どの部分に誤りがあったのかご入力ください"
      width:300
      height:40
      color:@baseColor.barColor
      left:10
      top:5
      font:
        fontSize:14
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
        
    contents = ""
    textArea = Titanium.UI.createTextArea
      value:''
      height:150
      width:280
      top:50
      left:10
      font:
        fontSize:12
        fontFamily :'Rounded M+ 1p'
        fontWeight:'bold'
      color:@baseColor.textColor
      textAlign:'left'
      borderWidth:2
      borderColor:"#dfdfdf"
      borderRadius:5
      keyboardType:Titanium.UI.KEYBOARD_DEFAULT
      
    # 入力完了後、キーボードを消す  
    textArea.addEventListener('return',(e)->
      contents = e.value
      Ti.API.info "登録しようとしてる情報は is #{contents}です"
      textArea.blur()
    )
    
    textArea.addEventListener('blur',(e)->
      contents = e.value
      Ti.API.info "blur event fire.content is #{contents}です"
    )  
    
    registMemoBtn = Ti.UI.createLabel
      bottom:30
      right:20
      width:120
      height:40
      backgroundImage:"NONE"
      borderWidth:0
      borderRadius:5
      color:@baseColor.barColor      
      backgroundColor:"#4cda64"
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:"報告する"
      textAlign:'center'

    registMemoBtn.addEventListener('click',(e) =>
      that = @
      that._setDefaultMapViewStyle()
      that.activityIndicator.show()
      # ACSにメモを登録
      # 次のCloud.Places.queryからはaddNewIconの外側にある
      # 変数参照できないはずなのでここでローカル変数として格納しておく
      
      contents = contents
      currentUserId = Ti.App.Properties.getString "currentUserId"
      Ti.API.info "contents is #{contents} and shopName is #{shopName}"
      MainController = require("controller/mainController")
      mainController = new MainController()
      mainController.sendFeedBack(contents,shopName,currentUserId,(result) =>
        that.activityIndicator.hide()
        if result.success
          alert "報告完了しました"
        else
          alert "サーバーがダウンしているために登録することができませんでした"
        that._hideDialog(_view,Ti.API.info "done")

      )
      
    ) 
    cancelleBtn =  Ti.UI.createLabel
      width:120
      height:40
      left:20
      bottom:30      
      borderRadius:5
      backgroundColor:"#d8514b"
      color:@baseColor.barColor
      font:
        fontSize:18
        fontFamily :'Rounded M+ 1p'
      text:'中止する'
      textAlign:"center"
      
    cancelleBtn.addEventListener('click',(e) =>
      @_setDefaultMapViewStyle()
      @_hideDialog(_view,Ti.API.info "done")
    )
    
    _view.add textArea
    _view.add titleForMemo
    _view.add registMemoBtn
    _view.add cancelleBtn
    
    return _view

  # ダイアログ表示する際に、背景部分となるmapViewに対して
  # フィルタを掛けることで奥行きある状態を表現する
  _setTiGFviewToMapView:() ->
    @mapView.rasterizationScale = 0.1
    @mapView.shouldRasterize = true
    @mapView.kCAFilterTrilinear= true
    return
        
  _setDefaultMapViewStyle:() ->
    @mapView.rasterizationScale = 1.0
    @mapView.shouldRasterize =false
    @mapView.kCAFilterTrilinear= false
    return

  # 引数に取ったviewに対してせり出すようにするアニメーションを適用
  _showDialog:(_view) ->
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(1.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    return _view.animate(animation)
    
  # 引数に取ったviewに対してズームインするようなアニメーションを適用
  # することで非表示のように見せる
  _hideDialog:(_view,callback) ->        
    t1 = Titanium.UI.create2DMatrix()
    t1 = t1.scale(0.0)
    animation = Titanium.UI.createAnimation()
    animation.transform = t1
    animation.duration = 250
    _view.animate(animation)
    
    animation.addEventListener('complete',(e) ->
      return callback
    )        
module.exports = detailWindow  