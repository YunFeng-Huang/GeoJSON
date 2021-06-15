var map = new AMap.Map('container', {
    center: [121.6785192489624,
        29.798011779785156
    ],
    zoom: 13,
    // 'bg'（地图背景）、'point'（POI点）、'road'（道路）、'building'（建筑物）
    // features:['bg','point']
});
console.log(map)
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

var defaultIcon0 = new AMap.Icon({
    // 图标尺寸
    size: new AMap.Size(25, 34),
    // 图标的取图地址
    image: './dir-via-marker.png',
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

const _marker = (title,position, icon, extData) => {
    return new AMap.Marker({
        // content: title,
        title:title,
        position: position,
        extData: extData,
        icon: icon, // 添加 Icon 实例
        offset: new AMap.Pixel(-13, -30),
    })
}


    // geoJSON.features.map(v => {
                //     AMap.convertFrom(v.geometry.coordinates, 'gps', function (status, result) {
                //         if (result.info === 'ok') {
                //             var lnglats = result.locations; // Array.<LngLat>
                //             v.geometry.coordinates = lnglats;
                //               a++;
                //         }
                //          if (status== 'complete') {
                //             a++;
                //          }
                //     });
                // })
