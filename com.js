var obj = {
    start: '',
    end: '',
}
var routeList=[];

var isPointOnLineValue =50
// var arr = []

// var addArr = (id, name) => {
//     // _riding_jump(id)
//     arr.push({
//         id,
//         name
//     })
//     console.log(arr, 'addArr')
//     console.log(LineArr, 'LineArr')
//     //     let last = arr[arr.length - 1]

//     //    let lines = LineArr.filter(v=>{
//     //        return v.include && v.include.some(k=>{
//     //             return k.name == last.name;
//     //         })
//     //     })
//     //     console.log(lines,'lines')
//     //     // lines.map(v=>{
//     //     //     console.log(v,'v')
//     //     //     draw(v)

//     //     // })


//     //     let lines1 = lines?.map((v, i) => {
//     //         const coordinates = v.geometry.coordinates
//     //         return {
//     //             "line_id": "110100010117" + i,
//     //             "line_name": v.properties.name,
//     //             "lnglat": coordinates
//     //         }
//     //     })
//     //     layer1.setData(lines1, {
//     //         lnglat: 'lnglat'
//     //     }).render();


// }
var delArr = (id) => {
    let last = routeList[routeList.length - 1]
    if (last.id != id) {
        alert('只能删除最近添加的锚点')
        return false;
    } else {
        // riding.clear()
        // last.routeLine && last.routeLine.hide()
        routeList.splice(routeList.length - 1, 1)
        console.log(routeList, 'delArr')

        return true;
    }
    // arr = arr.filter(v => {
    //     return v.id != id;
    // })
}


// function changArr(type, coordinates) {
//     if (type == 3) {
//         // const name = geojson.properties.name
//         addArr(coordinates, '')
//     } else {
//         return delArr(coordinates)
//     }

//     //     arr.length>1 && arr.reduce((v,k,i)=>{
//     //         _riding_jump(v.id, k.id)
//     //         return k;
//     //    }, arr[0])
// }


var driving = new AMap.Driving({
    map: map,
    panel: "panel"
});




// var _riding_jump = (last) => {
//     let start = arr[arr.length - 1]
//     //根据起终点坐标规划骑行路线
//     start && riding.search(start.id, last, function (status, result) {
//         // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
//         if (status === 'complete') {
//             console.log('骑行路线数据查询成功', result)
//             if (result.routes && result.routes.length) {
//                 drawRoute(result.routes[0])
//             }
//         } else {
//             console.log('骑行路线数据查询失败' + result)
//         }
//     });

// }

var nextPolyline=[];
var draw = (path) => {
    let Polyline = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        strokeOpacity: 0.9,
        // lineJoin: 'round'
    })
    nextPolyline.push(Polyline);
    map.add(Polyline);
}






// var _riding_jump = (p1, p2) => {
//     //根据起终点坐标规划骑行路线
//     riding.search(p1, p2, function (status, result) {
//         console.log(result, 'result')
//         // result即是对应的骑行路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
//         if (status === 'complete') {

//             if (result.routes && result.routes.length) {
//                 drawRoute(result.routes[0])
//             }
//         }
//     });

// }






//分组
var postLines=[];
var lines=[]; //所有的线
var markerList=[];//所有的岔路口
var selectLine=[];
function getGroup(geoJSON) {
     console.log(geoJSON,'geoJSON')
    let LineString = geoJSON.features.filter(k=>k.geometry.type == 'LineString')
    console.log(LineString,'LineString')
     lines = LineString.map((v, i) => {
        const coordinates = v.geometry.coordinates
        const name = v.properties.name
        // // 创建一个 Marker 实例：
        const startMarker = _marker("", coordinates[0],
            defaultIcon0, {
                'id': coordinates[0],
                'type': 3 // 0 默认值 1 起点 2 终点
            });

        const endMarker = _marker("", coordinates[coordinates.length -
                1],
            defaultIcon0, {
                'id': coordinates[coordinates.length -
                    1],
                'type': 3 // 0 默认值 1 起点 2 终点
            });
        // setMarker(startMarker,coordinates[0])
        // setMarker(endMarker,coordinates[coordinates.length - 1])
        markerList = [startMarker,...markerList, endMarker]
        return {
            "line_id": +new Date() + i,
            "line_name": v.properties.name,
            "lnglat": coordinates,
            'start':coordinates[0],
            'end':coordinates[coordinates.length -
                1],
            'points':[coordinates[0],coordinates[coordinates.length -
                1]]
        }
    })

    layer1.setData(lines, {
        lnglat: 'lnglat'
    }).render();


    map.add(markerList);

    // LineArr = [];
    // PointAll = [];

    // LineArr = geoJSON.features.filter(v => {
    //     return v.geometry.type == 'LineString'
    // })
    // LineArr.map((v, i) => {
    //     const coordinates = v.geometry.coordinates
    //     PointAll = [...PointAll, coordinates[0], coordinates[coordinates.length - 1]]
    // })
    // lines.map((e) => {
    //     PointAll.map((p) => {
    //         const path = e.geometry.coordinates;
    //         let dis = AMap.GeometryUtil.isPointOnLine(p, path, 100);
    //         if (dis) {
    //             let include = e?.include;
    //             // let n_p = AMap.GeometryUtil.closestOnLine(p, path);
    //             if (include) {
    //                 include.push({
    //                     p
    //                 })
    //             } else {
    //                 include = [{
    //                     p
    //                 }]
    //             }
    //             e.include = include;
    //         }
    //     })
    // })
    // console.log(LineArr, 'LineArr')
}




// 终点和起点直接所有的可能

function AllMaybe(points, line) {
    // for (let i; i < points.l i++;)
    // points.forEach((element,i) => {
    //     if()
    // });
    const length = points.length;
}

// 开始规划路线
function start_planning(type, p) {
    console.log(p,'p')
    // let startPoint;
    // let lines = []
    // let points = []
    selectLine=[];
    lines.map((v, i) => {
        // console.log(v,'v')
        // const in_point = JSON.stringify(v.include);
        const path = v.lnglat;
        if(v.start == p){
            draw(path);
            selectLine.push(path);
        }else if(AMap.GeometryUtil.isPointOnLine(p, path, isPointOnLineValue)){
            draw(path);
            selectLine.push(path);
        }
        
//         let dis = AMap.GeometryUtil.isPointOnLine(p, path, 500);
// if(dis){

//     // routeList.map((k,l)=>{
//     //     if(k==p){
//     //         routeList[l-1];
//     //     }
//     // })
// }
        //点在线上
        // if (in_point.includes(current_point)) {
        //     console.log(v, 'v', current_point)
        //     // const path = v.geometry.coordinates

        //     // 获取相邻点位 成立条件点位按远近排序
        //     // inc.map((k, i) => {
        //     //     // if (JSON.stringify(k) == current_point){
        //     //     //     const left_point = i - 1 >= 0 ? inc[i - 1] : null;
        //     //     //     const right_point = i + 1 <= inc.length-1 ? inc[i + 1] : null;
        //     //     //     console.log(left_point, right_point)
        //     //     //     left_point && points.push(left_point)
        //     //     //     right_point && points.push(right_point)
        //     //     // }
        //     // })

        //     //路径
        //     // v.include.map(v=>{
        //     //     let n_p = AMap.GeometryUtil.closestOnLine(v.p, path);
        //     //     v.n_p = n_p
        //     // })


        //     //卡死
        //     // let newInclude = []
        //     // let include = v.include
        //     // path.some((k, l) => {
        //     //     arr.push(k)
        //     //     include.some((v, i) => {
        //     //         if (AMap.GeometryUtil.isPointOnLine(v.n_p, arr, 0)) {
        //     //             newInclude.push(v)
        //     //             include.splice(i,1)
        //     //             return;
        //     //         }
        //     //     })
                
        //     // })
        //     // v.include = newInclude


         
        //     // 这里对include 排序

        //     // console.log(points, 'points')
        //     let markerList = v.include.map((v, l) => {
        //         return _marker(i + '-' + l, v.p,
        //             defaultIcon1, {
        //             'id': v.p,
        //             'type': 4
        //         });
        //     })
        //     map.add(markerList);

        // }
    })



}

// {
//     new: n_p,
//         old: v
// }
function selectionSort(arr) {

    let len = arr.length;
    let minIndex, temp;
    for (let i = 0; i < len - 1; i++) {
        minIndex = i;
        for (let j = i + 1; j < len; j++) {
            // let v = s_p
            if (arr[j] < arr[minIndex]) {    // 寻找最小的数
                minIndex = j;                // 将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    return arr;
}