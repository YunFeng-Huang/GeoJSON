





var draw = (path) => {
    let Polyline = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#00ad3a',
        strokeOpacity: 0.9,
        // lineJoin: 'round'
    })
    nextPolyline.push(Polyline);
    map.add(Polyline);
}




var drawRoute1 = (path) => {
    let _path = path.map(v => [+v.lng, +v.lat])
    let Polyline = new AMap.Polyline({
        path: _path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#00ad3a',
        strokeOpacity: 0.9,
        // lineJoin: 'round'
    })
    map.add(Polyline);
}







function getGroup(geoJSON) {
    
    markerList =[]
    // let LineString = geoJSON.features.filter(k => {
     
    //    return k.geometry.type == 'LineString'
    // })
    // markerList = geoJSON.features.filter(k => {
    //     return i
    // })
    lines = geoJSON.features.map((v, i) => {
        if (v.properties.name && v.geometry.type == 'Point') markerList.push(v);
        if (v.geometry.type == 'LineString'){
            const coordinates = v.geometry.coordinates

            // // 创建一个 Marker 实例：
            // const startMarker = _marker(``, coordinates[0],
            //     defaultIcon0, {
            //     'id': coordinates[0],
            //     'type': 3 // 0 默认值 1 起点 2 终点
            // });

            // const endMarker = _marker(``, coordinates[coordinates.length -
            //     1],
            //     defaultIcon0, {
            //     'id': coordinates[coordinates.length -
            //         1],
            //     'type': 3 // 0 默认值 1 起点 2 终点
            // });
            // markerList = [startMarker, ...markerList, endMarker]
            // map.add([startMarker, endMarker]);
            // markerList.push(coordinates[0]);
            // markerList.push(coordinates[coordinates.length -
            //     1]);
            return {
                "line_id": +new Date() + i,
                "line_name": v.properties.name,
                "lnglat": coordinates,
                'start': coordinates[0],
                'end': coordinates[coordinates.length - 1],
                'points': []
            }
        }
        
    }).filter(Boolean)
    // const marker = _marker('1', [121.655028, 29.732844],
    //     defaultIcon0, {
    //     'id': [121.655028, 29.732844],
    //     'type': 3 // 0 默认值 1 起点 2 终点
    // });
    // map.add(marker);
    layer1.setData(lines, {
        lnglat: 'lnglat'
    }).render();

    
//    console.time()
//     lines.map(v => {
//         markerList.map(k => {
//             let p = k.geometry.coordinates;
//             let a = AMap.GeometryUtil.isPointOnLine(p, v.lnglat, isPointOnLineValue)
//             if (a) {
//                 v['points'] = [...v['points'], [...p]]
//             }
//         })
//     })
//     console.timeEnd()
    // console.log(lines, 'linesde');
   
 
   

}

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



// function getGroup2(geoJSON) {
//     console.log(geoJSON, 'geoJSON')
//     let LineString = geoJSON.features.filter(k => k.geometry.type == 'LineString')
//     lines = LineString.map((v, i) => {
//         const coordinates = v.geometry.coordinates
       
//     })
// }




// 开始规划路线
function start_planning(p) {
    selectLine = [];
    lines.map((v, i) => {
        let path = v.lnglat;
        if (v.start == p || AMap.GeometryUtil.isPointOnLine(p, path, isPointOnLineValue)) {
            path = dilution(path);
            draw(path);
            selectLine.push(path);
        } 
    })
}
function dilution(path) {
    // console.log(path.length,1);
    // if (path.length > 2000) {
    //     path = path.filter((k, l) => {
    //         return l % 20 == 0 || l == 0 || l == path.length - 1;
    //     })
    // } else if (path.length > 3000) {
    //     path = path.filter((k, l) => {
    //         return l % 30 == 0 || l == 0 || l == path.length - 1;
    //     })
    // } else if (path.length > 4000) {
    //     path = path.filter((k, l) => {
    //         return l % 40 == 0 || l == 0 || l == path.length - 1;
    //     })
    // }
    // console.log(path.length,2);
    return path;
}


function showLoading() {
    document.getElementById("over").style.display = "block";
    document.getElementById("layout").style.display = "block";
}
function hideLoading() {
    document.getElementById("over").style.display = "none";
    document.getElementById("layout").style.display = "none";
}


// function postData(v){
//     console.log(v);
//     var formData = new FormData();
//     formData.append("photo",$("#photo")[0].files[0]);
//     formData.append("service",'App.Passion.UploadFile');
//     // formData.append("token",token);
//     $.ajax({
//         url:'http://www.baidu.com/', /*接口域名地址*/
//         type:'post',
//         data: formData,
//         contentType: false,
//         processData: false,
//         success:function(res){
//             console.log(res.data);
//             if(res.data["code"]=="succ"){
//                 alert('成功');
//             }else if(res.data["code"]=="err"){
//                 alert('失败');
//             }else{
//                 console.log(res);
//             }
//         }
//     })
// }




function showToast(title = '网路异常，请稍后点击') {
    $('.mask_box').html(title);
    $('.mask').removeClass('hide');
    setTimeout(() => {
        $('.mask').addClass('hide');
    }, 2000)
}

