BarView = Backbone.View.extend({
  el: "#bar",
  events: {
    "click .menu-button": "showMenu",
    "click .plus-button": "goPlus",
    "click .minus-button": "goMinus",
    "click .bar-zone": "barJump"
  },
  mwLoading: false,
  mwDelta: 0,
  mouseWheel: function () {
    var that = this;
    $("#canvas").on("mousewheel.pfcapp", function (e) {
      if (!PfcApp.blockEvents) {
        e.preventDefault();
        if (e.deltaY > 0) {
          if (that.mwDelta > -4) {
            that.mwDelta--;
          }
        } else if (that.mwDelta < 4) {
          that.mwDelta++;
        }
        if (!that.mwLoading) {
          that.mwLoading = true;
          setTimeout(function () {
            
            var point = parseInt(PfcApp.point, 10);
            var photos = parseInt(PfcApp.photos, 10);
            var zoomMode = $("#wrapper").hasClass("zoom-mode");
            var newPoint = point + that.mwDelta;
            if (!zoomMode) newPoint = (newPoint%photos + photos)%photos;
            else if (newPoint < 0) newPoint = 0;
            else if (newPoint >= photos) newPoint = photos - 1;
            PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
              { trigger: true });

            setTimeout(function () {
              that.mwDelta = 0;
              that.mwLoading = false;
            }, 205);
          }, 80);
        }
      }
    });
  },
  showMenu: function showMenu() {
    PfcApp.showMenu();
  },
  goPlus: function goPlus() {
    if (!PfcApp.blockEvents) {
      var point = parseInt(PfcApp.point, 10);
      var photos = parseInt(PfcApp.photos, 10);
      var zoomMode = $("#wrapper").hasClass("zoom-mode");
      var newPoint = point + 1;
      if (newPoint == photos && !zoomMode) {
        newPoint = 0;
        PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
          { trigger: true });
      } else if (newPoint < photos) {
        PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
          { trigger: true });
      }
    }
  },
  goMinus: function goMinus() {
    if (!PfcApp.blockEvents) {
      var point = parseInt(PfcApp.point, 10);
      var photos = parseInt(PfcApp.photos, 10);
      var zoomMode = $("#wrapper").hasClass("zoom-mode");
      var newPoint = point - 1;
      if (newPoint < 0 && !zoomMode) {
        newPoint = photos - 1;
        PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
          { trigger: true });
      } else if (newPoint >= 0) {
        PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
          { trigger: true });
      }
    }
  },
  updateBar: function updateBar(percent) {
    this.$(".bar-fill").css("width", percent + "%");
  },
  updateInfo: function updateInfo(info) {
    if (!info.scale) {
      this.$(".scale-value").empty();
    } else {
      this.$(".scale-value").text(info.scale + "x");
    }
    this.$(".source-button").attr("class", "button informative source-button " +
      info.source);
    this.$(".type-button").attr("class", "button informative type-button " +
      info.type);
  },
  barJump: function barJump(e) {
    if (!PfcApp.blockEvents) {
      var width = this.$(".bar-zone").width();
      var offset = e.pageX - this.$(".bar-zone").offset().left;
      var newPoint = Math.floor((offset*PfcApp.photos)/width);
      PfcApp.navigate(PfcApp.section + "/" + PfcApp.line + "/" + newPoint,
        { trigger: true });
    }
  }
});
