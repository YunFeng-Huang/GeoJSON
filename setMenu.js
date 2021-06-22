function setMenu(marker, coordinates,lnglat) {
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
                changArr(type, coordinates)
                // start_planning(type, coordinates)
            }, 0);
    } else {
        type != 0 && contextMenu.addItem("设置为经过点",
            () => {

                console.log("设置为经过点", marker)
                marker.setIcon(defaultIcon1)
                marker.setExtData({
                    type: 0,
                    'id': coordinates,
                })
                reset()
                changArr(type, coordinates)
                // _riding_jump(obj.start, obj.end)

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
                changArr(type, coordinates)
            }, 1);

        type != 3 && contextMenu.addItem("移除该锚点",
            () => {
                // console.log(changArr(type, coordinates, geojson))
                if (changArr(type, coordinates)) {
                    marker.setIcon(defaultIcon0)
                    marker.setExtData({
                        type: 3,
                        'id': coordinates,
                    })
                    reset()
                }


            }, 1);
    }
    contextMenu.open(map, lnglat);

}



// function setMarker(marker, coordinates){
//     AMap.event.addListener(marker, 'click', (e) => {
//         setMenu(marker, coordinates,  e.lnglat);
//     });
// }