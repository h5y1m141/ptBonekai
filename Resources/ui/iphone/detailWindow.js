var detailWindow;

detailWindow = (function() {
  function detailWindow(data) {
    var ActivityIndicator, keyColor;
    keyColor = "#f9f9f9";
    this.baseColor = {
      barColor: keyColor,
      backgroundColor: "#f3f3f3",
      keyColor: "#DA5019",
      textColor: "#333",
      textGrayColor: "#666",
      phoneColor: "#3261AB",
      favoriteColor: "#DA5019",
      feedbackColor: "#DA5019",
      separatorColor: '#cccccc'
    };
    this.detailWindow = Ti.UI.createWindow({
      title: data.title,
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: false
    });
    this.eventID = data.eventID;
    this._createNavbarElement(data.title);
    this._createTableView(data);
    this._createDescription(data.pict, data.details);
    ActivityIndicator = require("ui/activityIndicator");
    this.activityIndicator = new ActivityIndicator();
    this.detailWindow.add(this.activityIndicator);
    this._findComments();
    return this.detailWindow;
  }

  detailWindow.prototype._createDescription = function(picturePath, details) {
    var button, container, pictImage,
      _this = this;
    container = Ti.UI.createView({
      left: 10,
      top: 10,
      width: 320,
      height: 180
    });
    pictImage = Ti.UI.createImageView({
      image: picturePath,
      width: 150,
      height: 150,
      top: 5,
      left: 5,
      borderRadius: 3,
      borderColor: this.baseColor.separatorColor
    });
    details = Ti.UI.createLabel({
      text: details,
      width: 150,
      height: 100,
      top: 5,
      left: 160,
      textAlign: 'left',
      color: this.baseColor.textGrayColor,
      font: {
        fontSize: 10
      }
    });
    button = Ti.UI.createLabel({
      width: 120,
      height: 40,
      top: 110,
      left: 175,
      textAlign: 'center',
      text: '投票する',
      font: {
        fontSize: 18,
        fontWeight: 'bold'
      },
      backgroundColor: "#4cda64",
      color: this.baseColor.barColor,
      borderWidth: 1,
      borderRadius: 10,
      borderColor: this.baseColor.backgroundColor
    });
    button.addEventListener('click', function(e) {});
    container.add(pictImage);
    container.add(details);
    container.add(button);
    return this.detailWindow.add(container);
  };

  detailWindow.prototype._createNavbarElement = function(title) {
    var backButton, commentButton, detailWindowTitle,
      _this = this;
    backButton = Titanium.UI.createButton({
      backgroundImage: "ui/image/backButton.png",
      width: 44,
      height: 44
    });
    backButton.addEventListener('click', function(e) {
      return _this.detailWindow.close({
        animated: true
      });
    });
    commentButton = Ti.UI.createButton({
      title: 'コメントする'
    });
    this.detailWindow.leftNavButton = backButton;
    detailWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: this.baseColor.textColor,
      font: {
        fontSize: 14,
        fontWeight: 'bold'
      },
      text: title
    });
    this.detailWindow.setTitleControl(detailWindowTitle);
  };

  detailWindow.prototype._createTableView = function(data) {
    var _this = this;
    this.tableView = Ti.UI.createTableView({
      width: 'auto',
      height: 'auto',
      top: 180,
      left: 0,
      backgroundColor: this.baseColor.backgroundColor,
      separatorColor: this.baseColor.backgroundColor,
      zIndex: 1
    });
    this.tableView.addEventListener('click', function(e) {});
    return this.detailWindow.add(this.tableView);
  };

  detailWindow.prototype._findComments = function() {
    var KloudService, kloudService, that;
    that = this;
    KloudService = require("model/kloudService");
    kloudService = new KloudService();
    this.activityIndicator.show();
    return kloudService.findComments(function(comments) {
      var comment, eventID, row, rows, _i, _len;
      rows = [];
      for (_i = 0, _len = comments.length; _i < _len; _i++) {
        comment = comments[_i];
        eventID = comment.custom_fields.eventID;
        if (that.eventID === eventID) {
          row = that.createCommentRow(comment);
          rows.push(row);
        }
        that.tableView.setData(rows);
      }
      return that.activityIndicator.hide();
    });
  };

  detailWindow.prototype.createCommentRow = function(comment) {
    var bodySummary, breakLine, marker, messageBoxContainer, postDate, row, triangleImage, verticalLine;
    row = Ti.UI.createTableViewRow({
      width: 320,
      height: 60,
      backgroundColor: this.baseColor.backgroundColor
    });
    verticalLine = Ti.UI.createImageView({
      width: 1,
      height: 60,
      left: 35,
      top: 0,
      zIndex: 10,
      backgroundColor: "#bbb"
    });
    marker = Ti.UI.createImageView({
      width: 15,
      height: 15,
      borderRadius: 10,
      left: 28,
      top: 20,
      zIndex: 10,
      backgroundColor: "#bbb"
    });
    row.add(verticalLine);
    row.add(marker);
    bodySummary = Ti.UI.createLabel({
      width: 200,
      height: 40,
      left: 20,
      top: 0,
      color: "#222",
      font: {
        fontSize: 14
      },
      text: comment.message
    });
    postDate = Ti.UI.createLabel({
      width: 100,
      height: 20,
      right: 5,
      bottom: 0,
      color: "#444",
      font: {
        fontSize: 10
      },
      text: "投稿日；10分前"
    });
    triangleImage = Ti.UI.createImageView({
      width: 15,
      height: 15,
      left: 45,
      top: 20,
      borderRadius: 3,
      transform: Ti.UI.create2DMatrix().rotate(45),
      borderColor: "#bbb",
      borderWidth: 1,
      zIndex: 0,
      backgroundColor: "#fff"
    });
    breakLine = Ti.UI.createImageView({
      width: 1,
      height: 15,
      left: 50,
      top: 20,
      zIndex: 10,
      backgroundColor: "#fff"
    });
    messageBoxContainer = Ti.UI.createView({
      width: 250,
      height: 40,
      left: 50,
      top: 10,
      zIndex: 5,
      borderColor: "#bbb",
      borderWidth: 1,
      borderRadius: 5,
      backgroundGradient: {
        type: 'linear',
        startPoint: {
          x: '0%',
          y: '0%'
        },
        endPoint: {
          x: '0%',
          y: '100%'
        },
        colors: [
          {
            color: '#fff',
            position: 0.0
          }, {
            color: '#fefefe',
            position: 0.3
          }, {
            color: '#eee',
            position: 1.0
          }
        ]
      }
    });
    messageBoxContainer.add(bodySummary);
    messageBoxContainer.add(postDate);
    row.add(triangleImage);
    row.add(breakLine);
    row.add(messageBoxContainer);
    return row;
  };

  detailWindow.prototype._createFavoriteDialog = function(shopName) {
    var cancelleBtn, contents, favoriteDialog, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor,
      _this = this;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    unselectedColor = "#666";
    selectedColor = "#222";
    selectedValue = false;
    favoriteDialog = Ti.UI.createView({
      width: 300,
      height: 280,
      top: 0,
      left: 10,
      borderRadius: 10,
      opacity: 0.8,
      backgroundColor: "#333",
      zIndex: 20,
      transform: t
    });
    titleForMemo = Ti.UI.createLabel({
      text: "メモ欄",
      width: 300,
      height: 40,
      color: this.baseColor.barColor,
      left: 10,
      top: 5,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    contents = "";
    textArea = Titanium.UI.createTextArea({
      value: '',
      height: 150,
      width: 280,
      top: 50,
      left: 10,
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      color: this.baseColor.textColor,
      textAlign: 'left',
      borderWidth: 2,
      borderColor: "#dfdfdf",
      borderRadius: 5,
      keyboardType: Titanium.UI.KEYBOARD_DEFAULT
    });
    textArea.addEventListener('return', function(e) {
      contents = e.value;
      Ti.API.info("登録しようとしてるメモの内容は is " + contents + "です");
      return textArea.blur();
    });
    textArea.addEventListener('blur', function(e) {
      contents = e.value;
      return Ti.API.info("blur event fire.content is " + contents + "です");
    });
    registMemoBtn = Ti.UI.createLabel({
      bottom: 30,
      right: 20,
      width: 120,
      height: 40,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "登録する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var MainController, currentUserId, mainController, ratings, that;
      that = _this;
      that._setDefaultMapViewStyle();
      that.activityIndicator.show();
      Ti.API.info("contents is " + contents);
      ratings = ratings;
      contents = contents;
      currentUserId = Ti.App.Properties.getString("currentUserId");
      MainController = require("controller/mainController");
      mainController = new MainController();
      return mainController.createReview(ratings, contents, shopName, currentUserId, function(result) {
        that.activityIndicator.hide();
        if (result.success) {
          alert("登録しました");
        } else {
          alert("すでに登録されているか\nサーバーがダウンしているために登録することができませんでした");
        }
        return that._hideDialog(favoriteDialog, Ti.API.info("done"));
      });
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 30,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      _this._setDefaultMapViewStyle();
      return _this._hideDialog(favoriteDialog, Ti.API.info("done"));
    });
    favoriteDialog.add(textArea);
    favoriteDialog.add(titleForMemo);
    favoriteDialog.add(registMemoBtn);
    favoriteDialog.add(cancelleBtn);
    return favoriteDialog;
  };

  detailWindow.prototype._createPhoneDialog = function(phoneNumber, shopName) {
    var callBtn, cancelleBtn, confirmLabel, t, that, _view;
    that = this;
    t = Titanium.UI.create2DMatrix().scale(0.0);
    _view = Ti.UI.createView({
      width: 300,
      height: 240,
      top: 0,
      left: 10,
      borderRadius: 10,
      opacity: 0.8,
      backgroundColor: this.baseColor.textColor,
      zIndex: 20,
      transform: t
    });
    callBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      right: 20,
      bottom: 40,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: 'はい',
      textAlign: "center"
    });
    callBtn.addEventListener('click', function(e) {
      that._setDefaultMapViewStyle();
      return that._hideDialog(_view, Titanium.Platform.openURL("tel:" + phoneNumber));
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 40,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: 'いいえ',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      that._setDefaultMapViewStyle();
      return that._hideDialog(_view, Ti.API.info("cancelleBtn hide"));
    });
    confirmLabel = Ti.UI.createLabel({
      top: 20,
      left: 10,
      textAlign: 'center',
      width: 300,
      height: 150,
      color: this.baseColor.barColor,
      font: {
        fontSize: 16,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "" + shopName + "の電話番号は\n" + phoneNumber + "です。\n電話しますか？"
    });
    _view.add(confirmLabel);
    _view.add(cancelleBtn);
    _view.add(callBtn);
    return _view;
  };

  detailWindow.prototype._createFeedBackDialog = function(shopName) {
    var cancelleBtn, contents, registMemoBtn, selectedColor, selectedValue, t, textArea, titleForMemo, unselectedColor, _view,
      _this = this;
    Ti.API.info("createFeedBackDialog start shopName is " + shopName);
    t = Titanium.UI.create2DMatrix().scale(0.0);
    unselectedColor = "#666";
    selectedColor = "#222";
    selectedValue = false;
    _view = Ti.UI.createView({
      width: 300,
      height: 280,
      top: 0,
      left: 10,
      borderRadius: 10,
      opacity: 0.8,
      backgroundColor: "#333",
      zIndex: 20,
      transform: t
    });
    titleForMemo = Ti.UI.createLabel({
      text: "どの部分に誤りがあったのかご入力ください",
      width: 300,
      height: 40,
      color: this.baseColor.barColor,
      left: 10,
      top: 5,
      font: {
        fontSize: 14,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      }
    });
    contents = "";
    textArea = Titanium.UI.createTextArea({
      value: '',
      height: 150,
      width: 280,
      top: 50,
      left: 10,
      font: {
        fontSize: 12,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      color: this.baseColor.textColor,
      textAlign: 'left',
      borderWidth: 2,
      borderColor: "#dfdfdf",
      borderRadius: 5,
      keyboardType: Titanium.UI.KEYBOARD_DEFAULT
    });
    textArea.addEventListener('return', function(e) {
      contents = e.value;
      Ti.API.info("登録しようとしてる情報は is " + contents + "です");
      return textArea.blur();
    });
    textArea.addEventListener('blur', function(e) {
      contents = e.value;
      return Ti.API.info("blur event fire.content is " + contents + "です");
    });
    registMemoBtn = Ti.UI.createLabel({
      bottom: 30,
      right: 20,
      width: 120,
      height: 40,
      backgroundImage: "NONE",
      borderWidth: 0,
      borderRadius: 5,
      color: this.baseColor.barColor,
      backgroundColor: "#4cda64",
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: "報告する",
      textAlign: 'center'
    });
    registMemoBtn.addEventListener('click', function(e) {
      var MainController, currentUserId, mainController, that;
      that = _this;
      that._setDefaultMapViewStyle();
      that.activityIndicator.show();
      contents = contents;
      currentUserId = Ti.App.Properties.getString("currentUserId");
      Ti.API.info("contents is " + contents + " and shopName is " + shopName);
      MainController = require("controller/mainController");
      mainController = new MainController();
      return mainController.sendFeedBack(contents, shopName, currentUserId, function(result) {
        that.activityIndicator.hide();
        if (result.success) {
          alert("報告完了しました");
        } else {
          alert("サーバーがダウンしているために登録することができませんでした");
        }
        return that._hideDialog(_view, Ti.API.info("done"));
      });
    });
    cancelleBtn = Ti.UI.createLabel({
      width: 120,
      height: 40,
      left: 20,
      bottom: 30,
      borderRadius: 5,
      backgroundColor: "#d8514b",
      color: this.baseColor.barColor,
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p'
      },
      text: '中止する',
      textAlign: "center"
    });
    cancelleBtn.addEventListener('click', function(e) {
      _this._setDefaultMapViewStyle();
      return _this._hideDialog(_view, Ti.API.info("done"));
    });
    _view.add(textArea);
    _view.add(titleForMemo);
    _view.add(registMemoBtn);
    _view.add(cancelleBtn);
    return _view;
  };

  detailWindow.prototype._setTiGFviewToMapView = function() {
    this.mapView.rasterizationScale = 0.1;
    this.mapView.shouldRasterize = true;
    this.mapView.kCAFilterTrilinear = true;
  };

  detailWindow.prototype._setDefaultMapViewStyle = function() {
    this.mapView.rasterizationScale = 1.0;
    this.mapView.shouldRasterize = false;
    this.mapView.kCAFilterTrilinear = false;
  };

  detailWindow.prototype._showDialog = function(_view) {
    var animation, t1;
    t1 = Titanium.UI.create2DMatrix();
    t1 = t1.scale(1.0);
    animation = Titanium.UI.createAnimation();
    animation.transform = t1;
    animation.duration = 250;
    return _view.animate(animation);
  };

  detailWindow.prototype._hideDialog = function(_view, callback) {
    var animation, t1;
    t1 = Titanium.UI.create2DMatrix();
    t1 = t1.scale(0.0);
    animation = Titanium.UI.createAnimation();
    animation.transform = t1;
    animation.duration = 250;
    _view.animate(animation);
    return animation.addEventListener('complete', function(e) {
      return callback;
    });
  };

  return detailWindow;

})();

module.exports = detailWindow;
