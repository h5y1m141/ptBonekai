var kloudService;

kloudService = (function() {
  function kloudService() {
    this.Cloud = require('ti.cloud');
  }

  kloudService.prototype.findEvents = function(callback) {
    Ti.API.info("findEvents called");
    return this.Cloud.Events.query({
      order: "start_time"
    }, function(e) {
      var data, event, i, result;
      if (e.success) {
        result = [];
        i = 0;
        while (i < e.events.length) {
          event = e.events[i];
          data = {
            name: event.name,
            details: event.details,
            photo: event.photo,
            eventID: event.id,
            startTime: event.start_time
          };
          result.push(data);
          i++;
        }
        return callback(result);
      } else {
        return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
      }
    });
  };

  kloudService.prototype.createEvents = function(name, details, callback) {
    return this.Cloud.Events.create({
      name: name,
      details: details,
      recurring: 'daily',
      startTime: "2013-12-20T20:00:00+0000"
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.findComments = function(callback) {
    return this.Cloud.Statuses.query({
      page: 1,
      per_page: 100,
      order: "-updated_at"
    }, function(e) {
      var i, result, status;
      result = [];
      if (e.success) {
        i = 0;
        while (i < e.statuses.length) {
          status = e.statuses[i];
          result.push(status);
          Ti.API.info("Success:\n" + "id: " + status.id + "\n" + "message: " + status.message + "\n" + "updated_at: " + status.updated_at);
          i++;
        }
        return callback(result);
      } else {
        return Ti.API.info("Error:\n" + ((e.error && e.message) || JSON.stringify(e)));
      }
    });
  };

  kloudService.prototype.cbFanLogin = function(userID, password, callback) {
    this.Cloud.Users.login({
      login: userID,
      password: password
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.fbLogin = function(callback) {
    var fb;
    fb = require('facebook');
    return this.Cloud.SocialIntegrations.externalAccountLogin({
      type: "facebook",
      token: fb.accessToken
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.signUP = function(userID, password, callback) {
    return this.Cloud.Users.create({
      username: userID,
      email: userID,
      password: password,
      password_confirmation: password
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.getCurrentUserInfo = function(currentUserId, callback) {
    return this.Cloud.Users.show({
      user_id: currentUserId
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype.sendFeedBack = function(contents, shopName, currentUserId, callback) {
    return this.Cloud.Emails.send({
      template: 'feedbackAboutShopData',
      recipients: 'h5y1m141@gmail.com',
      contents: contents,
      shopName: shopName,
      currentUserId: currentUserId
    }, function(result) {
      return callback(result);
    });
  };

  kloudService.prototype._getAppID = function() {
    var appid, config, file, json;
    config = Titanium.Filesystem.getFile(Titanium.Filesystem.resourcesDirectory, "model/config.json");
    file = config.read().toString();
    json = JSON.parse(file);
    appid = json.facebook.appid;
    return appid;
  };

  return kloudService;

})();

module.exports = kloudService;
