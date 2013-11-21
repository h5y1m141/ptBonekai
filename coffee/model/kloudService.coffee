class kloudService
  constructor:() ->
    @Cloud = require('ti.cloud')
    
  findEvents:(callback) ->
    Ti.API.info "findEvents called"
    @Cloud.Events.query
      order:"start_time"
    , (e) ->
      if e.success
        result = []
        i = 0
        while i < e.events.length
          event = e.events[i]
          data =
            name: event.name
            details:event.details
            photo:event.photo
            
          result.push(data)
          i++
        return callback(result)
      else
        Ti.API.info "Error:\n" + ((e.error and e.message) or JSON.stringify(e))
    
  createEvents:(name,details,callback) ->
    @Cloud.Events.create
      name:name
      details:details
      recurring: 'daily'
      startTime:"2013-12-20T20:00:00+0000"
    , (result) ->
      return callback(result)
  
  cbFanLogin:(userID,password,callback) ->
    @Cloud.Users.login
      login:userID
      password:password
    , (result) ->
      return callback(result)
    
    return
  fbLogin:(callback) ->
    fb = require('facebook')
    @Cloud.SocialIntegrations.externalAccountLogin
      type: "facebook"
      token:fb.accessToken
    , (result) ->
      return callback(result)
      
        

  signUP:(userID,password,callback) ->
    @Cloud.Users.create
      username:userID
      email:userID
      password:password
      password_confirmation:password
    , (result) ->
      return callback(result)

      
  getCurrentUserInfo:(currentUserId,callback) ->
    @Cloud.Users.show
      user_id:currentUserId
    , (result) ->
      return callback(result)

  sendFeedBack:(contents,shopName,currentUserId,callback) ->
    @Cloud.Emails.send
      template:'feedbackAboutShopData'
      recipients:'h5y1m141@gmail.com'
      contents:contents
      shopName:shopName
      currentUserId:currentUserId
    , (result) ->
      return callback(result)
  
  _getAppID:() ->
    # Facebook appidを取得
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json")
    file = config.read().toString()
    json = JSON.parse(file)
    appid = json.facebook.appid
    return appid
    

module.exports = kloudService