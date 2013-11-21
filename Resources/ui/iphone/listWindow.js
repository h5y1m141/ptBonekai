var listWindow,
  __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

listWindow = (function() {

  function listWindow() {
    this._refreshData = __bind(this._refreshData, this);

    var ActivityIndicator, KloudService, myTemplate,
      _this = this;
    ActivityIndicator = require("ui/activityIndicator");
    this.activityIndicator = new ActivityIndicator();
    this.baseColor = {
      barColor: "#f9f9f9",
      backgroundColor: "#f3f3f3",
      titleColor: "#222",
      detailsColor: "#444",
      keyColor: "#EDAD0B"
    };
    this.listWindow = Ti.UI.createWindow({
      title: "リスト",
      barColor: this.baseColor.barColor,
      backgroundColor: this.baseColor.backgroundColor,
      tabBarHidden: true,
      navBarHidden: false
    });
    this._createNavbarElement();
    myTemplate = {
      childTemplates: [
        {
          type: "Ti.UI.Label",
          bindId: "title",
          properties: {
            color: this.baseColor.titleColor,
            font: {
              fontSize: 16,
              fontWeight: 'bold'
            },
            width: 240,
            height: 20,
            left: 5,
            top: 5
          }
        }, {
          type: "Ti.UI.ImageView",
          bindId: "icon",
          properties: {
            defaultImage: "ui/image/logo.png",
            width: 75,
            height: 75,
            left: 5,
            top: 30
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "details",
          properties: {
            color: this.baseColor.detailsColor,
            font: {
              fontSize: 12
            },
            width: 200,
            height: 50,
            left: 100,
            top: 30
          }
        }, {
          type: "Ti.UI.Label",
          bindId: "startTime",
          properties: {
            color: this.baseColor.textColor,
            font: {
              fontSize: 12
            },
            width: 60,
            height: 15,
            right: 0,
            top: 5
          }
        }
      ]
    };
    this.listView = Ti.UI.createListView({
      top: 0,
      left: 0,
      zIndex: 20,
      templates: {
        template: myTemplate
      },
      defaultItemTemplate: "template",
      refreshControlEnabled: true
    });
    this.listView.addEventListener("refreshstart", function(e) {
      _this.listView.isRefreshing();
      return mainController.findEvents(function(result) {
        _this.refresData(result);
        return _this.listView.refreshFinish();
      });
    });
    this.listView.addEventListener('itemclick', function(e) {
      var animation, data, detailWindow, index, that;
      that = _this;
      index = e.itemIndex;
      if (e.section.items[index].loadOld === true) {
        return maincontroller.getNextFeed(function(items) {
          var currentSection, lastIndex;
          lastIndex = that._getLastItemIndex();
          Ti.API.info("lastIndex is " + lastIndex);
          currentSection = that.listView.sections[0];
          return currentSection.insertItemsAt(lastIndex, items);
        });
      } else {
        data = {
          uuid: e.section.items[index].properties.data.uuid,
          url: e.section.items[index].properties.data.url,
          title: e.section.items[index].properties.data.title,
          body: e.section.items[index].properties.data.body,
          icon: e.section.items[index].properties.data.user.profile_image_url
        };
        detailWindow = require('ui/iphone/detailWindow');
        detailWindow = new detailWindow(data);
        detailWindow.top = Ti.Platform.displayCaps.platformHeight;
        animation = Ti.UI.createAnimation();
        animation.top = 0;
        animation.duration = 300;
        return detailWindow.open(animation);
      }
    });
    KloudService = require("model/kloudService");
    this.kloudService = new KloudService();
    this.kloudService.findEvents(function(result) {
      Ti.API.info("findEvents start result count: " + result.length);
      return _this._refreshData(result);
    });
    this.listWindow.add(this.listView);
    return this.listWindow;
  }

  listWindow.prototype._createNavbarElement = function() {
    var listWindowTitle;
    listWindowTitle = Ti.UI.createLabel({
      textAlign: 'center',
      color: '#333',
      font: {
        fontSize: 18,
        fontFamily: 'Rounded M+ 1p',
        fontWeight: 'bold'
      },
      text: "2013年PT忘年会"
    });
    if (Ti.Platform.osname === 'iphone') {
      this.listWindow.setTitleControl(listWindowTitle);
    }
  };

  listWindow.prototype._refreshData = function(data) {
    var dataSet, imagePath, layout, rawData, section, sections, _i, _items, _len;
    sections = [];
    section = Ti.UI.createListSection();
    dataSet = [];
    for (_i = 0, _len = data.length; _i < _len; _i++) {
      _items = data[_i];
      rawData = _items;
      Ti.API.info(_items.photo);
      if (_items.photo === null || typeof _items.photo === "undefined") {
        imagePath = "ui/image/noimageSmall.jpg";
      } else {
        imagePath = _items.photo.urls.square_75;
      }
      layout = {
        properties: {
          height: 120,
          selectionStyle: Titanium.UI.iPhone.ListViewCellSelectionStyle.NONE,
          accessoryType: Titanium.UI.LIST_ACCESSORY_TYPE_DISCLOSURE,
          data: rawData
        },
        title: {
          text: _items.name
        },
        startTime: {
          text: _items.startTime
        },
        details: {
          text: _items.details
        },
        icon: {
          image: imagePath
        }
      };
      dataSet.push(layout);
    }
    section.setItems(dataSet);
    sections.push(section);
    return this.listView.setSections(sections);
  };

  return listWindow;

})();

module.exports = listWindow;
