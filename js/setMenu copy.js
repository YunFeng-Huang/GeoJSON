
function setMenu(marker, coordinates, lnglat) {
    let {
        type,
        id,
        title
    } = marker.getExtData()
    console.log(marker.getExtData(), 'marker.getExtData()');
    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();

    const reset = () => {
        if (id == obj.start && id != obj.end) obj.start = '';
        if (id == obj.end && id != obj.start) obj.end = '';
    }
    if (!obj.start) {
        contextMenu.addItem(
            "设置为起点",
            () => {
                console.log("设置为起点", marker)
                marker.setIcon(startIcon)
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        type: 1,
                    },
                })
                reset()
                obj.start = id;
                if (userType == 1) {
                    pointList.push({
                        point: coordinates,
                        polyline: [],
                        title: title,
                        line: []
                    })
                    // changArr(type, coordinates)
                    start_planning(coordinates)
                }
            }, 0);
        // contextMenu.addItem("设置",
        // () => {
        //     document.querySelector('.pop').style="display:block";
        // }, 1);
    } else {
        type != 0 && userType == 1 && contextMenu.addItem("设置为经过点",
            () => {
                showLoading()
                setTimeout(() => {
                    console.log("设置为经过点", marker)
                    addRoute('', coordinates)
                    hideLoading();
                }, 100)

            }, 1);

        type != 2 && !obj.end && contextMenu.addItem(
            "设置为终点",
            () => {
                let r = true;
                if (userType == 1) r = confirm("确定设置为终点，点击确定生成路线");
                if (!r && userType == 1) return hideLoading();
                showLoading()
                setTimeout(() => {
                    console.log(userType, 'userType')
                    console.log("设置为终点", marker)
                    if (userType == 1) {

                        addRoute('end', coordinates)
                        // console.log(pointList,'pointList')
                        // pointList.map(v => {
                        //     v.w.path
                        // })

                        // draw2()
                    }
                    obj.end = id;
                    console.log([obj.start, obj.end])
                    if (userType == 2) {

                        var ridingOption = {
                            map: map,
                            panel: "panel",
                            policy: 1,
                            hideMarkers: false,
                            isOutline: true,
                            outlineColor: '#ffeeee',
                            autoFitView: true
                        }

                        var riding = new AMap.Riding(ridingOption)

                        //根据起终点坐标规划骑行路线
                        riding.search(obj.start, obj.end, function (status, result) {
                            // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
                            if (status === 'complete') {
                                log.success('骑行路线数据查询成功')
                            } else {
                                log.error('骑行路线数据查询失败' + result)
                            }
                        });

                        // getRoutes2(obj.start, obj.end);
                    }
                    nextPolyline.map(v => map?.remove(v));
                    hideLoading();
                }, 100)
            }, 1);

        type != 3 && userType == 1 && contextMenu.addItem("移除该锚点",
            () => {
                map.remove(marker);
                obj.end = '';
                let polyline = pointList[pointList.length - 1].polyline;
                map.remove(polyline)
                nextPolyline.map(v => map.remove(v));
                pointList.pop();
                reset()
            }, 1);

        // contextMenu.addItem("设置",
        //     () => {
        //         document.querySelector('.pop').style="display:block";
        //     }, 1);



    }
    contextMenu.open(map, lnglat);
    function getRoutes2(start, end) {

        // lines.map((v, i) => {
        //     let path = v.lnglat;
        //     if (v.start == p || AMap.GeometryUtil.isPointOnLine(p, path, isPointOnLineValue)) {
        //         path = dilution(path);
        //         draw(path);
        //     }
        // })
        aa(start, end)
    }
    // lines.map(v => {
    //     markerList.map(k => {
    //         let p = k.geometry.coordinates;
    //         let a = AMap.GeometryUtil.isPointOnLine(p, v.lnglat, isPointOnLineValue)
    //         if (a) {
    //             v['points'] = v['points'] || [];
    //             v['points'] = [...v['points'], [...p]]
    //         }
    //     })
    // })
    // let path = v.lnglat;
    // if (v.start == p || AMap.GeometryUtil.isPointOnLine(p, path, isPointOnLineValue)) {
    //     path = dilution(path);
    // }
    function aa(p, end) {
        lines.some((v, i) => {
            console.log(v)
            //    return v['points'].some(v => {
            //         let less = {
            //             value: null,
            //             point: null
            //         }
            //        let d = AMap.GeometryUtil.distance(v, p);
            //        if (d < 1000) {
            //            console.log(d,'dddd')
            //             let dis = AMap.GeometryUtil.distance(v, end);
            //             if (less.value == null || less.value > dis) {
            //                 less = {
            //                     value: dis,
            //                     point: v
            //                 }
            //             }
            //            point = less.point
            //            console.log(less);
            //         //    map.emit('click', {
            //         //        lnglat: point
            //         //    });

            //            let d1 = AMap.GeometryUtil.distance(point, end);
            //            console.log(d1,'d1')
            //            if (d1 > 1000){
            //                aa(point, end)
            //            }

            //         }

            //        return d < 1000;
            //     })
        })
    }




    // 线路处理
    function addRoute(type, point) {
        let lastp = pointList[pointList.length - 1];
        let pre = lastp.point;
        let allLines = [];
        console.time();
        selectLine.some(path => {
            let a = AMap.GeometryUtil.isPointOnLine(point, path, isPointOnLineValue)
            let b = AMap.GeometryUtil.isPointOnLine(pre, path, isPointOnLineValue)
            console.log(a, b)
            //在一条线上
            if (a && b) {
                let line = []
                let aline = []
                path.some(v => {
                    line.push(v);
                    let c = AMap.GeometryUtil.isPointOnLine(point, line, isPointOnLineValue)
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
            if (AMap.GeometryUtil.isPointOnLine(point, path, isPointOnLineValue)) return true;
        })) {
            alert('请选择线路关联的节点');
            return;
        };
        console.log(allLines, 'allLines');
        allLines = allLines.map(v => {
            var dis = AMap.GeometryUtil.distance(pre, v[0]);
            let arr = v;
            let p1 = {
                'Q': pre[1],
                'R': pre[0],
                'lat': pre[1],
                'lng': pre[0]
            }
            let p2 = {
                'Q': point[1],
                'R': point[0],
                'lat': point[1],
                'lng': point[0]
            }
            if (dis < isPointOnLineValue) {
                arr = [p1, ...v, p2]
            }
            var dis1 = AMap.GeometryUtil.distance(pre, v[v.length - 1]);
            if (dis1 < isPointOnLineValue) {
                arr = [p2, ...v, p1]
            }
            // draw1(arr)
            return arr;
        })
        console.log({
            "manPoint": point,
            "subPoint": pre,
            "lines": allLines
        })
        // let distance = AMap.GeometryUtil.distanceOfLine(allLines);
        // console.log(distance,'distance')

        let c1 = [...point];
        let p1 = [...pre];
        if (!c1[2]) c1[2] = 0;
        if (!p1[2]) p1[2] = 0;
        c1[3] = title
        p1[3] = lastp.title
        console.log('addRlt');
        fetch('https://47.99.183.98:8090/api/admin/point/addRlt', {
            "manPoint": c1,
            "subPoint": p1,
            "lines": allLines,
            "distance": allLines.map(v => +(AMap.GeometryUtil.distanceOfLine(v).toFixed(2))),
        }).then((res) => {
            console.log(res)
        })
        let line;
        if (allLines.length == 1) {
            line = allLines[0]
        } else {
            let less = {
                value: null,
                line: null
            }
            allLines.map(v => {
                let dis = AMap.GeometryUtil.distanceOfLine(v);
                if (less.value == null || less.value > dis) {
                    less = {
                        value: dis,
                        line: v
                    }
                }
            })
            line = less.line
        }

        let polyline = draw1(line);


        // hideLoading()

        if (type == 'end') {
            marker.setIcon(endIcon)
            marker.setExtData({
                ...marker.getExtData(), ...{
                    type: 2,
                },
            })
        } else {
            marker.setIcon(defaultIcon1)
            marker.setExtData({
                ...marker.getExtData(), ...{
                    type: 0,
                },
            })
        }

        reset()
        nextPolyline.map(v => map.remove(v));
        pointList.push({
            point: point,
            polyline,
            line: line,
        })
        start_planning(point)
    }
}


var draw1 = (path) => {
    routerLines = [...routerLines, ...path]
    let Polyline = new AMap.Polyline({
        path: path,
        isOutline: true,
        outlineColor: '#ffeeee',
        borderWeight: 2,
        strokeWeight: 5,
        strokeColor: '#0091ff',
        strokeOpacity: 0.9,
        // lineJoin: 'round',
        zIndex: 51,
    })
    map.add(Polyline);
    return Polyline;
}
// '#fb9a99', '#e31a1c', '#fdbf6f', '#ff7f00'，
// function _moving() {
//     var marker, lineArr = routerLines.reverse();
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
        path: routerLines,
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
