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
    extData.title = title;
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
            // if (geojson.properties && geojson.properties.name) {
            //     const coordinates = geojson.geometry.coordinates
            //     const marker = _marker(geojson.properties.name, lnglats,
            //         defaultIcon0, {
            //             'id': coordinates,
            //         'type': 3 // 0 默认值 1 起点 2 终点
            //     });
            //     return marker;
            // }
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


function init() {
    document.querySelector('#w').style = "display:none";
    _resetMap()
    showLoading()
    $.ajax({
        type: "GET",
        url: 'https://kybcrm-files.oss-cn-hangzhou.aliyuncs.com/prod/tesla/test/yunfeng/map.geojson?1121',
        async: true,
        contentType: "application/json",
        dataType: "json",
        success: ((res) => {
            let geoJSON = { ...res }
            gcoord.transform(geoJSON, gcoord.WGS84, gcoord.GCJ02);
            // console.log(geoJSON.features, 'geoJSON.features');
            getGroup(geoJSON);
            hideLoading();
            _setlayer(geoJSON)
            _setGeoJson(geoJSON);
            console.log('GeoJSON 数据加载完成')
            //  start_end(146,160)
            dqh_wcList()

            // let arr = [
            //     [
            //         121.66768440369171,
            //         29.734524093924954
            //     ],
            //     [
            //         121.667585,
            //         29.734461
            //     ],
            //     [
            //         121.667569,
            //         29.734453
            //     ],
            //     [
            //         121.66738,
            //         29.734447
            //     ],
            //     [
            //         121.667369,
            //         29.734449
            //     ],
            //     [
            //         121.667297,
            //         29.734447
            //     ],
            //     [
            //         121.667056,
            //         29.73441
            //     ],
            //     [
            //         121.666812,
            //         29.734339
            //     ],
            //     [
            //         121.666748,
            //         29.7343
            //     ],
            //     [
            //         121.666747,
            //         29.734265
            //     ],
            //     [
            //         121.666764,
            //         29.734199
            //     ],
            //     [
            //         121.66676,
            //         29.734178
            //     ],
            //     [
            //         121.666743,
            //         29.734149
            //     ],
            //     [
            //         121.666753,
            //         29.734097
            //     ],
            //     [
            //         121.666793,
            //         29.73405
            //     ],
            //     [
            //         121.666823,
            //         29.734023
            //     ],
            //     [
            //         121.666829,
            //         29.733869
            //     ],
            //     [
            //         121.666833,
            //         29.733844
            //     ],
            //     [
            //         121.666818,
            //         29.733789
            //     ],
            //     [
            //         121.666819,
            //         29.733789
            //     ],
            //     [
            //         121.666777,
            //         29.733681
            //     ],
            //     [
            //         121.666767,
            //         29.73365
            //     ],
            //     [
            //         121.666774,
            //         29.733594
            //     ],
            //     [
            //         121.666761,
            //         29.733581
            //     ],
            //     [
            //         121.66669,
            //         29.733449
            //     ],
            //     [
            //         121.666637,
            //         29.733273
            //     ],
            //     [
            //         121.666615,
            //         29.733199
            //     ],
            //     [
            //         121.666617,
            //         29.733195
            //     ],
            //     [
            //         121.666592,
            //         29.733155
            //     ],
            //     [
            //         121.666572,
            //         29.733023
            //     ],
            //     [
            //         121.666545,
            //         29.732936
            //     ],
            //     [
            //         121.666512,
            //         29.732838
            //     ],
            //     [
            //         121.666503,
            //         29.732824
            //     ],
            //     [
            //         121.666505,
            //         29.73277
            //     ],
            //     [
            //         121.666524,
            //         29.732696
            //     ],
            //     [
            //         121.666521,
            //         29.732656
            //     ],
            //     [
            //         121.666591,
            //         29.732636
            //     ],
            //     [
            //         121.666611,
            //         29.73261
            //     ],
            //     [
            //         121.666673,
            //         29.732636
            //     ],
            //     [
            //         121.666683,
            //         29.732631
            //     ],
            //     [
            //         121.666676,
            //         29.73261
            //     ],
            //     [
            //         121.666664,
            //         29.732566
            //     ],
            //     [
            //         121.666628,
            //         29.732496
            //     ],
            //     [
            //         121.666616,
            //         29.732478
            //     ],
            //     [
            //         121.666603,
            //         29.732457
            //     ],
            //     [
            //         121.666568,
            //         29.732389
            //     ],
            //     [
            //         121.666564,
            //         29.732388
            //     ],
            //     [
            //         121.666535,
            //         29.732369
            //     ],
            //     [
            //         121.666511,
            //         29.732347
            //     ],
            //     [
            //         121.66645,
            //         29.732289
            //     ],
            //     [
            //         121.666433,
            //         29.732275
            //     ],
            //     [
            //         121.666408,
            //         29.732259
            //     ],
            //     [
            //         121.666351,
            //         29.732218
            //     ],
            //     [
            //         121.666322,
            //         29.732173
            //     ],
            //     [
            //         121.666287,
            //         29.732098
            //     ],
            //     [
            //         121.666291,
            //         29.732104
            //     ],
            //     [
            //         121.66625,
            //         29.732079
            //     ],
            //     [
            //         121.666188,
            //         29.73204
            //     ],
            //     [
            //         121.666141,
            //         29.731999
            //     ],
            //     [
            //         121.66607,
            //         29.731989
            //     ],
            //     [
            //         121.66585231877782,
            //         29.73185652142983
            //     ]
            // ]
            // draw(arr);

        }),
        fail: ((err) => {
            console.log(err)
        })
    });

    
}


