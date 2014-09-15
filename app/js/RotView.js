var RotView = Backbone.View.extend({
  el: "#canvas",
  name: null,
  data: null,
  point: null,
  zoomed: false,
  loaded: [],
  events: {
    "click": "switchStatus"
  },
  start: function start(name, data, point) {
    if (!point) {
      point = 0;
    }
    this.name = name;
    this.data = data;
    this.point = point;
    this.$el.css("background-image", 'url("img/rot/' + name + '/' + point +
      '.jpg")');
    this.$(".aux-layer").css("background-image", 'url("img/rot/' + name + '/' +
      point + '.jpg")');
  },
  changePoint: function changePoint(point) {
    this.point = point;
    this.$el.css("background-image", 'url("img/rot/' + this.name + '/' + point +
      '.jpg")');
    if (this.zoomed) {
      if (this.loaded[point]) {
        this.$(".aux-layer").css("background-image", 'url("img/rot/' +
          this.name + '/partials/' + point + '.jpg")');
      } else {
        this.$(".aux-layer").css("background-image", 'url("img/rot/' +
          this.name + '/' + point + '.jpg")');
        var myPreloader = ImgPreloader([{
          url: "img/rot/" + this.name + "/partials/" + point + ".jpg"
        }]);
        myPreloader.start();
        var that = this;
        var interval = setInterval(function () {
          if (myPreloader.preloaded()) {
            clearInterval(interval);
            that.$(".aux-layer").css("background-image", 'url("img/rot/' +
              that.name + '/partials/' + point + '.jpg")');
            that.loaded[point] = true;
          }
        }, 50);
      }
    } else {
      this.$(".aux-layer").css("background-image", 'url("img/rot/' + this.name +
        '/' + point + '.jpg")');
    }
  },
  switchStatus: function switchStatus(e) {
    var $target = $(e.target);
    var that = this;
    if ($target.attr("id") == "canvas") {
      var myPreloader = ImgPreloader([{
        url: "img/rot/" + this.name + "/partials/" + this.point + ".jpg"
      }]);
      myPreloader.start();
      var offsetX = e.offsetX*3;
      var offsetY = e.offsetY*3;
      var left = this.$el.width()/2 - offsetX;
      var top = this.$el.height()/2 - offsetY;
      if (left > 0) left = 0;
      if (top > 0) top = 0;
      this.$(".aux-layer").addClass("mobile");
      this.$(".aux-layer").css({
        visibility: "visible",
        width: "300%",
        height: "300%",
        left: left + "px",
        top: top + "px"
      });
      setTimeout(function () {
        that.$(".aux-layer").removeClass("mobile");
        if (myPreloader.preloaded()) {
          that.$(".aux-layer").css("background-image", 'url("img/rot/' +
            that.name + '/partials/' + that.point + '.jpg")');
          that.loaded[that.point] = true;
        } else {
          PfcApp.loadingLayer.show();
          var interval = setInterval(function () {
            PfcApp.loadingLayer.update(myPreloader.percentage());
            if (myPreloader.preloaded()) {
              clearInterval(interval);
              that.$(".aux-layer").css("background-image", 'url("img/rot/' +
                that.name + '/partials/' + that.point + '.jpg")');
              PfcApp.loadingLayer.hide();
              that.loaded[that.point] = true;
            }
          }, 50);
        }
        that.zoomed = true;
      }, 500);
    } else if ($target.hasClass("aux-layer")) {
      this.$(".aux-layer").addClass("mobile");
      this.$(".aux-layer").css({
        backgroundImage: 'url("img/rot/' + this.name + '/' + this.point +
          '.jpg")',
        width: "100%",
        height: "100%",
        left: "0px",
        top: "0px"
      });
      setTimeout(function () {
        that.$(".aux-layer").removeClass("mobile");
        that.$(".aux-layer").css("visibility", "hidden");
        that.zoomed = false;
      }, 500);
    }
  }
});
