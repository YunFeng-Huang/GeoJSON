
function setMenu(marker, coordinates, lnglat) {
    let {
        type,
        id
    } = marker.getExtData()

    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();


    const reset = () => {
        if (id == obj.start) obj.start = '';
        if (id == obj.end) obj.end = '';
    }
    if (!obj.start) {
        contextMenu.addItem(
            "设置为起点",
            () => {
                console.log("设置为起点", marker)
                marker.setIcon(startIcon)
                marker.setExtData({
                    type: 1,
                    'id': coordinates,
                })
                reset()
                obj.start = id;
                routeList.push(coordinates)
                // changArr(type, coordinates)
                start_planning(type, coordinates)
            }, 0);
    } else {
        type != 0 && contextMenu.addItem("设置为经过点",
            () => {

                console.log("设置为经过点", marker)
               
                // map.remove(markersList)
                // 上一个点
                let pre = routeList[routeList.length - 1];
                console.log(selectLine, 'lines');
                // 可以优话速度，先把点绑定在线上
                 selectLine.some(path => {
                    let a = AMap.GeometryUtil.isPointOnLine(coordinates, path, isPointOnLineValue)
                    let b = AMap.GeometryUtil.isPointOnLine(pre, path, isPointOnLineValue)
                    //在一条线上
                    if (a && b) {
                        let line = []
                        let aline = []
                        path.some(v => {
                            line.push(v);
                            let c = AMap.GeometryUtil.isPointOnLine(coordinates, line, isPointOnLineValue)
                            let d = AMap.GeometryUtil.isPointOnLine(pre, line, isPointOnLineValue)
                            //2个点中间的数据
                            if (c || d) {
                                aline.push(v);
                                if (c && d) {
                                    return aline;
                                }
                            }
                        })
                      
                        // postLines=[...postLines,...aline];
                        draw1(aline)
                        return true;
                    }
                })
                if (!selectLine.some(path => {
                    if (AMap.GeometryUtil.isPointOnLine(coordinates, path, isPointOnLineValue)) return true;
                })) {
                    alert('请选择线路关联的节点');
                    return;
                };
                marker.setIcon(defaultIcon1)
                marker.setExtData({
                    type: 0,
                    'id': coordinates,
                })
                reset()
                nextPolyline.map(v => map.remove(v));
                routeList.push(coordinates)
                // draw1(routeList)

                // selectLine.map(v=>{{
                //     if(v==coordinates){

                //     }
                // })
                // changArr(type, coordinates)
                start_planning(type, coordinates)
                // _riding_jump(obj.start, obj.end)
                // _navigation(obj.start.slice(0,2), coordinates.slice(0,2))


            }, 1);

        type != 2 && !obj.end && contextMenu.addItem(
            "设置为终点",
            () => {
                console.log("设置为终点", marker)
                marker.setIcon(endIcon)
                marker.setExtData({
                    type: 2,
                    'id': coordinates,
                })
                reset()
                obj.end = id;
                routeList.push(coordinates)
                // changArr(type, coordinates)
            }, 1);

        type != 3 && contextMenu.addItem("移除该锚点",
            () => {
                // console.log(changArr(type, coordinates, geojson))
                marker.setIcon(defaultIcon0)
                marker.setExtData({
                    type: 3,
                    'id': coordinates,
                })
                reset()
                delArr(coordinates)

            }, 1);
    }
    contextMenu.open(map, lnglat);

}


var draw1 = (path) => {
    let Polyline = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: 'red',
        strokeOpacity: 0.9,
        // lineJoin: 'round',
        zIndex: 51,
    })
    map.add(Polyline);
}



//   function _navigation(origin,destination){
//       let show_fields = {
//         polyline:','
//       }
//         $.ajax({
//             type: "GET",
//             url: `https://restapi.amap.com/v5/direction/walking?show_fields=1&AlternativeRout=3&origin=${origin}&destination=${destination}&key=159ac7ab77b871475921666af383d69b`,
//             async: true,
//             contentType: "application/json",
//             dataType: "json",
//             success: ((res) => {
//                 console.log(res)
//                 drawRoute(res.route)

//             }),
//             fail: ((err) => {
//                 console.log(err)
//             })
//         });
//     }




//     function drawRoute (route) {
//         var path = parseRouteToPath(route).map(v=>{
//             return {keyword: v.road_name}
//         })
// console.log(path,'path')
//         // var routeLine = new AMap.Polyline({
//         //     path: path,
//         //     isOutline: true,
//         //     outlineColor: '#ffeeee',
//         //     borderWeight: 2,
//         //     strokeWeight: 5,
//         //     strokeColor: 'red',
//         //     // strokeColor: '#0091ff',
//         //     lineJoin: 'round'
//         // })

//         // map.add(routeLine);

//  // 根据起终点名称规划驾车导航路线
//  driving.search(path, function(status, result) {
//     // result 即是对应的驾车导航信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_DrivingResult
//     if (status === 'complete') {
//         log.success('绘制驾车路线完成')
//     } else {
//         log.error('获取驾车数据失败：' + result)
//     }
// });
//     }
//     function parseRouteToPath(route) {
//         var path = []

//         for (var i = 0, l = route.paths.length; i < l; i++) {
//             var step = route.paths[i]

//             for (var j = 0, n = step.steps.length; j < n; j++) {
//               path.push(step.steps[j])
//             }
//         }

//         return path
//     }
