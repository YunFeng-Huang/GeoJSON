
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
                if (userType == 1) {
                    routeList.push(coordinates)
                    // changArr(type, coordinates)
                    start_planning(type, coordinates)
                }

            }, 0);
    } else {
        type != 0 && userType == 1 && contextMenu.addItem("设置为经过点",
            () => {
                showLoading()
                setTimeout(() => {
                    console.log("设置为经过点", marker)
                    addRoute('')
                    hideLoading();
                }, 100)

            }, 1);

        type != 2 && !obj.end && contextMenu.addItem(
            "设置为终点",
            () => {
                showLoading()
                setTimeout(() => {
                    console.log("设置为终点", marker)
                    if (userType == 1) {
                        addRoute('end')
                        // draw2()
                    }
                    obj.end = id;
                    console.log([obj.start, obj.end])
                    if (userType == 2) {
                        var walkOption = {
                            map: map,
                            panel: "panel",
                            hideMarkers: false,
                            isOutline: true,
                            outlineColor: '#ffeeee',
                            autoFitView: true
                        }

                        // 步行导航
                        var walking = new AMap.Walking(walkOption)
                        //根据起终点坐标规划骑行路线
                        walking.search(obj.start, obj.end, function (status, result) {
                            if (status === 'complete') {
                                log.success('骑行路线数据查询成功')
                            } else {
                                log.error('骑行路线数据查询失败' + result)
                            }
                        });
                    }
                    nextPolyline.map(v => map.remove(v));
                    hideLoading();
                }, 100)

                // marker.setIcon(endIcon)
                // marker.setExtData({
                //     type: 2,
                //     'id': coordinates,
                // })
                // reset()
                // obj.end = id;
                // routeList.push(coordinates)
                // start_planning(type, coordinates)
                // changArr(type, coordinates)
            }, 1);

        type != 3 && userType == 1 && contextMenu.addItem("移除该锚点",
            () => {
                alert('功能开发中')
                // console.log(changArr(type, coordinates, geojson))
                // marker.setIcon(defaultIcon0)
                // marker.setExtData({
                //     type: 3,
                //     'id': coordinates,
                // })
                // reset()
                // delArr(coordinates)

            }, 1);
    }
    contextMenu.open(map, lnglat);

    // 线路处理
    function addRoute(type) {
        let pre = routeList[routeList.length - 1];
        let allLines = [];
        console.time();

        // 可以优话速度，先把点绑定在线上
        selectLine.some(path => {
            let a = AMap.GeometryUtil.isPointOnLine(coordinates, path, isPointOnLineValue)
            let b = AMap.GeometryUtil.isPointOnLine(pre, path, isPointOnLineValue)
            console.log(a, b)
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
                allLines.push(aline);
            }
        })
        console.timeEnd();
        if (!selectLine.some(path => {
            if (AMap.GeometryUtil.isPointOnLine(coordinates, path, isPointOnLineValue)) return true;
        })) {
            alert('请选择线路关联的节点');
            return;
        };
        console.log(allLines, 'allLines');
       let c= allLines.map(v => {
            var dis = AMap.GeometryUtil.distance(pre, v[0]);
            let arr = v;
            if (dis < isPointOnLineValue) {
                arr = [pre, ...v, coordinates]
            } else {
                arr = [coordinates, ...v, pre]
            }
            draw1(arr)
            return arr;
        })
       console.log({
        "manPoint": coordinates,
        "subPoint": pre,
        "lines": c
    })
        fetch('api/admin/point/addRlt', {
            "manPoint": coordinates,
            "subPoint": pre,
            "lines": c
        }).then((res)=>{
            console.log(res)
        })

        // if (allLines.length == 1) {
        //     draw1(allLines[0]);
        // } else {
        //     let less = {
        //         value: null,
        //         line: null
        //     }
        //     allLines.map(v => {
        //         let dis = AMap.GeometryUtil.distanceOfLine(v);
        //         if (less.value == null || less.value > dis) {
        //             less = {
        //                 value: dis,
        //                 line: v
        //             }
        //         }
        //     })
        //     draw1(less.line);
        // }

        // hideLoading()

        if (type == 'end') {
            marker.setIcon(endIcon)
            marker.setExtData({
                type: 2,
                'id': coordinates,
            })
        } else {
            marker.setIcon(defaultIcon1)
            marker.setExtData({
                type: 0,
                'id': coordinates,
            })
        }

        reset()
        nextPolyline.map(v => map.remove(v));
        routeList.push(coordinates)
        start_planning(type, coordinates)
    }
}


var draw1 = (path) => {
    postLines = [...postLines, ...path]
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

// function _moving() {
//     var marker, lineArr = postLines.reverse();
//     marker = new AMap.Marker({
//         map: map,
//         position: [116.478935, 39.997761],
//         icon: "https://webapi.amap.com/images/car.png",
//         offset: new AMap.Pixel(-26, -13),
//         autoRotation: true,
//         angle: -90,
//     });

//     // // 绘制轨迹
//     // let p = new AMap.Polyline({
//     //     map: map,
//     //     path: lineArr,
//     //     showDir: true,
//     //     strokeColor: "#28F",  //线颜色
//     //     // strokeOpacity: 1,     //线透明度
//     //     strokeWeight: 6,      //线宽
//     //     // strokeStyle: "solid"  //线样式
//     // });
//     var passedPolyline = new AMap.Polyline({
//         map: map,
//         // path: lineArr,
//         strokeColor: "#AF5",  //线颜色
//         // strokeOpacity: 1,     //线透明度
//         strokeWeight: 6,      //线宽
//         // strokeStyle: "solid"  //线样式
//     });

//     // map.add(p);

//     marker.on('moving', function (e) {
//         passedPolyline.setPath(e.passedPath);
//     });
//     startAnimation()
//     function startAnimation() {
//         marker.moveAlong(lineArr, 10000);
//     }
// }


var draw2 = () => {
    let Polyline = new AMap.Polyline({
        path: postLines,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: 'blue',
        strokeOpacity: 0.9,
        // lineJoin: 'round',
        zIndex: 52,
    })
    map.add(Polyline);
}



//   function _ajax(data){
//         $.ajax({
//             type: "post",
//             url: `http://192.168.10.147/api/admin/point/addRlt`,
//             async: true,
//             contentType: "application/json",
//             dataType: "json",
//             data:data,
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
