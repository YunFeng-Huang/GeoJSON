var map = new AMap.Map('container', {
    // center: [121.67437917552888, 29.757456528022885],
    // center: [121.67746768675849, 29.797649656150444, 18.88],
   center :[121.67746676281693, 29.797647558677987, 1.92],
    features: ['bg', 'road'],
    // mapStyle: 'amap://styles/midnight',
    // pitch: 50,
    zoom: 14,
    // Loca 自 1.2.0 起 viewMode 模式默认为 3D，如需 2D 模式，请显示配置。
    // viewMode: '3D'
    // 'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
    // features:['bg','point']
    pitch: 56,
    // viewMode: '3D'
});
var layer = new Loca.HeatmapLayer({
    map: map,
}).setOptions({
    style: {
        radius: 2,
        color: {
            0.5: "blue",
            0.65: "rgb(117,211,248)",
            0.7: "rgb(0, 255, 0)",
            0.9: "#ffea00",
            1.0: "red",
        },
    },
});
var colors = ['#fb9a99'];
// , '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'，, '#e31a1c', '#fdbf6f', '#ff7f00'

var layer1 = new Loca.LineLayer({
    map: map,
    // zIndex:201
}).setOptions({
    style: {
        borderWidth: 4,
        opacity: 1,
        color: function (v) {
            var id = v.value.line_id;
            var len = colors.length;
            return colors[id % len];
        },
    }
});


var ridingOption = {
    map: map,
    panel: "panel",
    policy: 2,
    isOutline: true,
    outlineColor: '#ffeeee',
    autoFitView: false,
    hideMarkers: true

}
var riding = new AMap.Riding(ridingOption)
 //构造路线导航类
 var driving = new AMap.Driving({
    map: map,
    panel: "panel"
}); 

// 创建一个 Icon
var startIcon = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
    // 图标所用图片大小
    imageSize: new AMap.Size(135, 40),
    // 图标取图偏移量
    imageOffset: new AMap.Pixel(-9, -3)
});



// 创建一个 icon
var endIcon = new AMap.Icon({
    size: new AMap.Size(25, 34),
    image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-marker.png',
    imageSize: new AMap.Size(135, 40),
    imageOffset: new AMap.Pixel(-95, -3)
});

var defaultIcon1 = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: 'https://a.amap.com/jsapi_demos/static/demo-center/icons/dir-via-marker.png',
    // 图标所用图片大小
    imageSize: new AMap.Size(25, 34),
    // 图标取图偏移量
    // imageOffset: new AMap.Pixel(-9, -3)
});

var defaultIcon2 = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: '../img/dir-via-marker1.png',
    // 图标所用图片大小
    imageSize: new AMap.Size(25, 34),
    // 图标取图偏移量
    // imageOffset: new AMap.Pixel(-9, -3)
});

var defaultIcon0 = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: '../img/dir-via-marker.png',
    // 图标所用图片大小
    imageSize: new AMap.Size(25, 34),
    // 图标取图偏移量
    // imageOffset: new AMap.Pixel(-9, -3)
});
// var marker = new AMap.Marker({
//     position: lnglats,
//     // 将一张图片的地址设置为 icon
//     icon: icon,
//     // 设置了 icon 以后，设置 icon 的偏移量，以 icon 的 [center bottom] 为原点
//     offset: new AMap.Pixel(-13, -30)
// });

var _marker = (title, position, icon, extData) => {
    let marker = new AMap.Marker({
        // content: title,
        title: title,
        position: position,
        extData: extData,
        icon: icon, // 添加 Icon 实例
        offset: new AMap.Pixel(-13, -30),
    })
    marker.setLabel({
        offset: new AMap.Pixel(-24, -26), //设置文本标注偏移量
        content: title, //设置文本标注内容
        direction: 'right' //设置文本标注方位
    });
    AMap.event.addListener(marker, 'click', (e) => {
        setMenu(marker, position, e.lnglat);
    });
    // type 0默认点  1起点 2终点 3 经过点 4 分支点

    return marker;
}


function drawRoute(route) {
    // let last = arr[arr.length - 1]
    var path = parseRouteToPath(route)
    var routeLine = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 4,
        strokeColor: '#0091ff',
        strokeOpacity: 0.9,
        lineJoin: 'round',
    })
    // last.routeLine = routeLine;
    map.add(routeLine);
    // 调整视野达到最佳显示区域
    // map.setFitView([ routeLine])
}

function _setGeoJson(geoJSON){
    var geojson = new AMap.GeoJSON({
        geoJSON: geoJSON,
        getMarker: (geojson, lnglats) => {
            if (geojson.properties && geojson.properties.name) {
                const coordinates = geojson.geometry.coordinates
                const marker = _marker(geojson.properties.name, lnglats,
                    defaultIcon0, {
                    'id': lnglats,
                    'type': 3 // 0 默认值 1 起点 2 终点
                });
                return marker;
            }
            return;
        },
        getPolyline: (geojson, lnglats) => {
            return new AMap.Polyline({
                path: lnglats,
                strokeWeight: 3,
                strokeOpacity: 0.2,
                //  bubble: true,
            })
        }

    });

    geojson.setMap(map);
}

function _resetMap(){
    markerList &&  map?.remove(markerList)
     heatmap;//热力图
     userType = 1;
     postLines = []; //分组
     lines = []; //所有的线
     markerList = [];//所有的岔路口
     selectLine = [];
     obj = {
        start: '',
        end: '',
    }
     routeList = [];
     nextPolyline = [];
     isPointOnLineValue = 30
    
    map?.clearMap()
}
function init() {
    _resetMap()
    showLoading()
    $.ajax({
        type: "GET",
        url: 'https://kybcrm-files.oss-cn-hangzhou.aliyuncs.com/prod/tesla/smart-scenic-v2-web/amcharts/1.json',
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: ((res) => {
            let geoJSON = { ...res }
            gcoord.transform(geoJSON, gcoord.WGS84, gcoord.GCJ02);
            console.log(geoJSON.features, 'geoJSON.features');
            getGroup(geoJSON);
            hideLoading();
            _setlayer(geoJSON)
            _setGeoJson(geoJSON);
            console.log('GeoJSON 数据加载完成')
        }),
        fail: ((err) => {
            console.log(err)
        })
    });
}
