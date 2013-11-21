class listWindow
  constructor:() ->
    ActivityIndicator = require("ui/activityIndicator")
    @activityIndicator = new ActivityIndicator()

    @baseColor =
      barColor:"#f9f9f9"
      backgroundColor:"#f3f3f3"
      titleColor:"#222"
      detailsColor:"#444"      
      keyColor:"#EDAD0B"
      
    @listWindow = Ti.UI.createWindow
      title:"リスト"
      barColor:@baseColor.barColor
      backgroundColor: @baseColor.backgroundColor
      tabBarHidden:true
      navBarHidden:false
      
    @_createNavbarElement()
    myTemplate =
    childTemplates:[
      # title
      type: "Ti.UI.Label"
      bindId:"title"
      properties:
        color: @baseColor.titleColor
        font:
          fontSize:16
          fontWeight:'bold'
        width:240
        height:20
        left:5
        top:5
    ,
      # icon
      type: "Ti.UI.ImageView"
      bindId:"icon"
      properties:
        defaultImage:"ui/image/logo.png"
        width:75
        height:75
        left:5
        top:30
    ,
      # details
      type: "Ti.UI.Label"
      bindId:"details"
      properties:
        color: @baseColor.detailsColor
        font:
          fontSize:12
        width:200
        height:50
        left:100
        top:30
    ,
      # startTime
      type: "Ti.UI.Label"
      bindId:"startTime"
      properties:
        color: @baseColor.textColor
        font:
          fontSize:12
        width:60
        height:15
        right:0
        top:5
          
        
    ]            
    @listView = Ti.UI.createListView
      top:0
      left:0
      zIndex:20
      templates:
        template: myTemplate
      defaultItemTemplate: "template"
      refreshControlEnabled:true
    @listView.addEventListener("refreshstart",(e) =>
      @listView.isRefreshing()
      mainController.findEvents((result) =>
        @refresData(result)
        @listView.refreshFinish()
      )

    )

    @listView.addEventListener('itemclick',(e) =>
      that = @
      index = e.itemIndex
      
      # e.section.items[index]を参照することで
      # secitonに配置したアイコン、タイトルやカスタムプロパティの値も全て取得できる

      data =
        title:e.section.items[index].properties.data.title
        startTime:e.section.items[index].properties.data.startTime
        details:e.section.items[index].properties.data.details
        icon:e.section.items[index].properties.data.icon
        pict:e.section.items[index].properties.data.pict
      
      detailWindow = require('ui/iphone/detailWindow')
      detailWindow = new detailWindow(data)
      Ti.API._activeTab.open(detailWindow)      

    )
    KloudService = require("model/kloudService")
    @kloudService = new KloudService()
    @kloudService.findEvents((result) =>
      Ti.API.info "findEvents start result count: #{result.length}"
      
      return @_refreshData(result)
    )
    @listWindow.add @listView
    return @listWindow
            
  _createNavbarElement:() ->
    
    listWindowTitle = Ti.UI.createLabel
      textAlign: 'center'
      color:'#333'
      font:
        fontSize:18
        fontWeight:'bold'
      text:"2013年PT忘年会"

    if Ti.Platform.osname is 'iphone'
      @listWindow.setTitleControl listWindowTitle
      
    return
    
  _refreshData: (data) =>
    sections = []
    section = Ti.UI.createListSection()

    dataSet = []
    for _items in data
      Ti.API.info _items.photo
      
      if _items.photo is null or typeof _items.photo is "undefined"
        iconPath = "ui/image/noimageSmall.jpg"
        pictPath = "ui/image/noimage.png"
      else
        iconPath = _items.photo.urls.square_75
        pictPath = _items.photo.urls.small_240
        # pictPath = _items.photo.urls.original
        
      _data =
        title     : _items.name
        startTime : _items.start_time
        details   : _items.details
        icon      : iconPath
        pict      : pictPath        
        
      layout =
        properties:
          height:120
          selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE
          accessoryType:Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE
          data:_data
          
        title:
          text: _items.name
        startTime:
          text: _items.start_time
        details:
          text: _items.details
        icon:
          image:iconPath

      dataSet.push(layout)
                

    section.setItems dataSet
    sections.push section

    return @listView.setSections sections
    
module.exports = listWindow