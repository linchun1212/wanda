<template>
  <div>
    <mt-header title="地图">
      <mt-button icon="back" @click="goback" slot="left"></mt-button>
    </mt-header>
    <div class="map_content">
      <div style="margin:5px 0px">
        <b>
          换乘策略：
        </b>
        <select id="policy" @change="calcPlan">
          <option value="LEAST_TIME">
            较快捷
          </option>
          <option value="LEAST_TRANSFER">
            少换乘
          </option>
          <option value="LEAST_WALKING">
            少步行
          </option>
          <option value="NO_SUBWAY">
            不坐地铁
          </option>
        </select>
      </div>
      <div style="width:100%;height:80%" id="container"></div>
      <div style="width:100%;padding-top:10px;" id="plans"></div>
    </div>
  </div>
</template>
<script>
import store from "store";
import { Toast } from "mint-ui";
import { Indicator } from "mint-ui";

export default {
  data: function() {
    return {
      map: null,
      transfer_plans: null,
      start_marker: null,
      end_marker: null,
      transferService: null,
      station_markers: [],
      transfer_lines: [],
      walk_lines: [],
      start_name: [],
      end_name: []
    };
  },
  mounted: function() {
    Indicator.open("加载中");
    // 获取起点经纬度
    this.getCurrentLocation();
    // 获取终点经纬度
    let end_position = store.get("wanda_cinema");
    this.end_name.push(end_position.longitude);
    this.end_name.push(end_position.latitude);

    this.t_init();
    this.init();
  },
  methods: {
    // 获取当前定位
    getCurrentLocation() {
      var geolocation = new qq.maps.Geolocation(
        "HQLBZ-OCK3J-3GCFO-KUKAY-IKGJQ-S3BGN",
        "wd"
      );
      // 手机端定位
      // geolocation.getLocation(this.showPosition, this.showErr);
      // PC端定位
      geolocation.getIpLocation(this.showPosition, this.showErr);
    },
    showPosition(position) {
      this.start_name.push(position.lng);
      this.start_name.push(position.lat);
      this.calcPlan();
    },
    showErr() {
      // Toast("定位失败");
      this.getCurrentLocation(); //定位失败再请求定位，测试使用
    },
    goback() {
      this.$router.go(-1);
    },
    t_init() {
      let that = this;
      this.transferService = new qq.maps.TransferService({
        location: "北京",
        complete: function(result) {
          result = result.detail;
          var start = result.start,
            end = result.end;
          var anchor = new qq.maps.Point(6, 6),
            size = new qq.maps.Size(24, 36),
            start_icon = new qq.maps.MarkerImage("img/busmarker.png", size),
            end_icon = new qq.maps.MarkerImage(
              "img/busmarker.png",
              size,
              new qq.maps.Point(24, 0),
              anchor
            );

          that.start_marker && that.start_marker.setMap(null);
          that.end_marker && that.end_marker.setMap(null);
          that.start_marker = new qq.maps.Marker({
            icon: start_icon,
            position: start.latLng,
            map: that.map,
            zIndex: 1
          });
          that.end_marker = new qq.maps.Marker({
            icon: end_icon,
            position: end.latLng,
            map: that.map,
            zIndex: 1
          });

          that.transfer_plans = result.plans;
          var plans_desc = [];
          for (var i = 0; i < that.transfer_plans.length; i++) {
            //plan desc.
            var p_attributes = [
              '@click="renderPlan(' + i + ')"',
              'onmouseover=this.style.background="#eee"',
              'onmouseout=this.style.background="#fff"',
              'style="margin-top:-4px;cursor:pointer"'
            ].join(" ");
            plans_desc.push(
              "<p " + p_attributes + "><b>方案" + (i + 1) + ".</b>"
            );
            var actions = that.transfer_plans[i].actions;
            for (var j = 0; j < actions.length; j++) {
              var action = actions[j],
                img_position;
              action.type == qq.maps.TransferActionType.BUS &&
                (img_position = "-38px 0px");
              action.type == qq.maps.TransferActionType.SUBWAY &&
                (img_position = "-57px 0px");
              action.type == qq.maps.TransferActionType.WALK &&
                (img_position = "-76px 0px");

              var action_img =
                '<span style="margin-bottom: -4px;' +
                "display:inline-block;background:url(img/busicon.png) " +
                "no-repeat " +
                img_position +
                ';width:19px;height:19px"></span>&nbsp;&nbsp;';
              plans_desc.push(action_img + action.instructions);
            }
          }
          //方案文本描述
          document.getElementById("plans").innerHTML = plans_desc.join(
            "<br><br>"
          );

          //渲染到地图上
          that.renderPlan(0);
        }
      });
    },
    init() {
      //   let lat = this.$store.getters.Cinema.latitude;
      //   let lng = this.$store.getters.Cinema.longitude;
      this.map = new qq.maps.Map(document.getElementById("container"), {
        // 地图的中心地理坐标。
        center: new qq.maps.LatLng(this.end_name[1], this.end_name[0])
      });
      // this.calcPlan();
    },
    //调用calcPlan用来判断出行方式
    calcPlan() {
      // var start_name = document.getElementById("start").value.split(",");
      // var end_name = document.getElementById("end").value.split(",");

      var policy = document.getElementById("policy").value;

      this.transferService.search(
        new qq.maps.LatLng(this.start_name[1], this.start_name[0]),
        new qq.maps.LatLng(this.end_name[1], this.end_name[0])
      );

      switch (policy) {
        case "较快捷":
          this.transferService.setPolicy(qq.maps.TransferActionType.LEAST_TIME);
          break;
        case "少换乘":
          this.transferService.setPolicy(
            qq.maps.TransferActionType.LEAST_TRANSFER
          );
          break;
        case "少步行":
          this.transferService.setPolicy(
            qq.maps.TransferActionType.LEAST_WALKING
          );
          break;
        case "不坐地铁":
          this.transferService.setPolicy(qq.maps.TransferActionType.NO_SUBWAY);
          break;
      }
    },
    //清除地图上的marker
    clearOverlay(overlays) {
      var overlay;
      while ((overlay = overlays.pop())) {
        overlay.setMap(null);
      }
    },

    renderPlan(index) {
      var plan = this.transfer_plans[index],
        lines = plan.lines,
        walks = plan.walks,
        stations = plan.stations;
      this.map.fitBounds(plan.bounds);

      //clear overlays;
      this.clearOverlay(this.station_markers);
      this.clearOverlay(this.transfer_lines);
      this.clearOverlay(this.walk_lines);
      var anchor = new qq.maps.Point(6, 6),
        size = new qq.maps.Size(24, 36),
        bus_icon = new qq.maps.MarkerImage(
          "img/busmarker.png",
          size,
          new qq.maps.Point(48, 0),
          anchor
        ),
        subway_icon = new qq.maps.MarkerImage(
          "img/busmarker.png",
          size,
          new qq.maps.Point(72, 0),
          anchor
        );
      //draw station marker
      for (var j = 0; j < stations.length; j++) {
        var station = stations[j];
        if (station.type == qq.maps.PoiType.SUBWAY_STATION) {
          var station_icon = subway_icon;
        } else {
          var station_icon = bus_icon;
        }
        var station_marker = new qq.maps.Marker({
          icon: station_icon,
          position: station.latLng,
          map: this.map,
          zIndex: 0
        });
        this.station_markers.push(station_marker);
      }

      //draw bus line
      for (var j = 0; j < lines.length; j++) {
        var line = lines[j];
        var polyline = new qq.maps.Polyline({
          path: line.path,
          strokeColor: "#3893F9",
          strokeWeight: 6,
          map: this.map
        });
        this.transfer_lines.push(polyline);
      }

      //draw walk line
      for (var j = 0; j < walks.length; j++) {
        var walk = walks[j];
        var polyline = new qq.maps.Polyline({
          path: walk.path,
          strokeColor: "#3FD2A3",
          strokeWeight: 6,
          map: this.map
        });
        this.walk_lines.push(polyline);
      }

      // 渲染完毕
      Indicator.close();
    }
  }
};
</script>
<style lang="less">
.map_content {
  position: absolute;
  top: 40px;
  width: 100%;
  height: calc(100% - 40px);
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
}
</style>
