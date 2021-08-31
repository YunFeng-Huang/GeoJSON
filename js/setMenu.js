
function setMenu(marker, coordinates, lnglat) {
    //  if (from == 'line'&&disabled) return;
    let {
        type,
        id,
        title,
        is_punch,
        circleEditor,
        lngGaode,
        latGaode,
        circle,
    } = marker.getExtData()
    console.log(userType, 'userType');
    console.log(marker.getExtData(), 'marker.getExtData()');
    //创建右键菜单
    var contextMenu = new AMap.ContextMenu();
    const reset = () => {
        if (id == obj.start && id != obj.end) obj.start = '';
        if (id == obj.end && id != obj.start) obj.end = '';
    }
    function _Addpoint() {
        console.log(activePath, 'activePath', id)
        if (activePath) {
            let item = activePath.filter(v => {
                return v.man_point_id == id || v.sub_point_id == id;
            })[0]
            console.log(item, 'item')
            if (item) {
                let p = JSON.parse(item.lnglat);
                let _path = p.map(v => [+v.lng, +v.lat])
                let polyline = draw1(_path);
                pointList.push({
                    point: coordinates,
                    polyline: polyline,
                    title: title,
                    id: id,
                    route: p
                })
            }
        } else {
            pointList.push({
                point: coordinates,
                polyline: [],
                title: title,
                id: id,
                route: []
            })
        }


    }
    console.log(obj, 'obj');
    if (!obj.start) {
        contextMenu.addItem(
            "设置为起点",
            async () => {
                disabled = true;
                console.log("设置为起点", marker)
                marker.setIcon(startIcon)
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        type: 1,
                    },
                })
                reset()
                obj.start = id;
                activePath = null;
                if (userType == 1) {
                    _Addpoint()
                    dqh_pointLine(id);
                    // start_planning(coordinates)
                }
            }, 0);
        // contextMenu.addItem("设置",
        // () => {
        //     document.querySelector('.pop').style="display:block";
        // }, 1);
    } else {
        (userType == 1 || (userType == 2 && obj.end != '')) && contextMenu.addItem("设置为经过点",
            () => {
                if (userType == 1) {
                    if (!selectLine.some(path => AMap.GeometryUtil.isPointOnLine(coordinates, path, 1000))) {
                        alert('请选择线路关联的节点');
                        return;
                    };
                    _Addpoint()
                    dqh_pointLine(id);
                    // start_end('', obj, id)
                } else {
                    if (obj.end != '') start_end('', obj, id)
                }
                console.log(id, obj.start);
                if (id == obj.start) {
                    _marker('途经点', id,
                        defaultIcon1, marker.getExtData());

                } else {
                    marker.setIcon(defaultIcon1)
                    marker.setExtData({
                        ...marker.getExtData(), ...{
                            type: 0,
                        },
                    })
                }


            }, 1);

        type != 2 && !obj.end && contextMenu.addItem(
            "设置为终点",
            async () => {
                let r = true;
                if (userType == 1) r = confirm("确定设置为终点，点击确定生成路线");
                if (!r) return;
                console.log(selectLine, 'selectLine');
                if (userType == 1) {
                    if (!selectLine.some(path => AMap.GeometryUtil.isPointOnLine(coordinates, path, isPointOnLineValue))) {
                        alert('请选择线路关联的节点');
                        return;
                    };
                    _Addpoint()
                } else {
                    //    dqh_pointLine(id);

                }
                obj.end = id;
                marker.setIcon(endIcon)
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        type: 2,
                    },
                })
                start_end('end', obj, id, pointList)
                document.querySelector('#w iframe').src = iframeSrc;
                document.querySelector('#w').style = "display:block";
            }, 1);

        type != 3 && userType == 1 && contextMenu.addItem("移除该锚点",
            () => {
                marker.setIcon(defaultIcon0)
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        type: 3,
                    },
                })
                // map.remove(marker);
                // obj.end = '';
                let polyline = pointList[pointList.length - 1].polyline;
                map.remove(polyline)
                nextPolyline.map(v => map.remove(v));
                pointList.pop();
                deleteId(id);
                let _id = pointList[pointList.length - 1]?.id;
                dqh_pointLine(_id);
                reset()
            }, 1);





    }
    console.log(is_punch, 'is_punch', circleEditor)
    contextMenu.addItem(`${is_punch == 0 ? '设置为' : '取消'}打卡点`,
        () => {
            if (is_punch == 0 ){
                let circle1 = SetCircle([lngGaode, latGaode])
                let circleEditor1 = new AMap.CircleEditor(map, circle1)
                // circleEditor1.on('end', function (event) {
                //     console.log(event.target, 'event.target', event)
                //     // event.target 即为编辑后的圆形对象
                // })
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        is_punch:1,
                        circle: circle1,
                        circleEditor: circleEditor1 ,
                    },
                })
                dqh_punchSetting({
                    id: id,
                    isPunch: 1,
                    radius: circle.Ce.radius
                });
                circleEditor1.open()
            }else{
                marker.setExtData({
                    ...marker.getExtData(), ...{
                        is_punch:  0,
                        circle:  null,
                        circleEditor:   null,
                    },
                })
                dqh_punchSetting({
                    id: id,
                    isPunch: 0,
                    radius: circle.Ce.radius
                });
                circleEditor.close()
                circle.clear();
            }
        
        }, 1);
    if (is_punch == 1) contextMenu.addItem(`设置打卡点范围`,
        () => {
            circleEditor.open();
        }, 4);
    if (is_punch == 1) contextMenu.addItem(`锁定打卡点范围`,
        () => {
            dqh_punchSetting({
                id: id,
                isPunch: is_punch,
                radius: circle.Ce.radius
            });
            circleEditor.close();
        }, 4);
    contextMenu.open(map, lnglat);

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

}
