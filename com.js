var obj = {
    start: '',
    end: '',
}
var routeList=[];

var isPointOnLineValue =1000

var delArr = (id) => {
    let last = routeList[routeList.length - 1]
    if (last.id != id) {
        alert('只能删除最近添加的锚点')
        return false;
    } else {
        // riding.clear()
        // last.routeLine && last.routeLine.hide()
        routeList.splice(routeList.length - 1, 1)

        return true;
    }
   
}



var driving = new AMap.Driving({
    map: map,
    panel: "panel"
});




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








function getGroup(geoJSON) {
     console.log(geoJSON,'geoJSON')
    let LineString = geoJSON.features.filter(k=>k.geometry.type == 'LineString')
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

}





// 开始规划路线
function start_planning(type, p) {
    selectLine=[];
    lines.map((v, i) => {
        let path = v.lnglat;
        if(v.start == p){
            path= dilution(path);
            draw(path);
            selectLine.push(path);
        }else if(AMap.GeometryUtil.isPointOnLine(p, path, isPointOnLineValue)){
            path= dilution(path);
            draw(path);
            selectLine.push(path);
        }
    })
    // selectLine =  selectLine.map((v,i)=>{
    //    return v.filter((k,l)=>{
    //         if(v.length>300){
    //             return l%2==0;
    //         }else if(v.length>600){
    //             return l%4==0;
    //         }else if(v.length>1000){
    //             return l%6==0;
    //         }else if(v.length>2000){
    //             return l%10==0;
    //         }
    //     })
    // })
}
function dilution(path){
    // console.log(path.length,1);
    if(path.length>2000){
        path = path.filter((k,l)=>{
            return l%20==0 || l==0||l==path.length-1;
        })
    }else if(path.length>3000){
        path = path.filter((k,l)=>{
            return l%30==0|| l==0||l==path.length-1;
        })
    }else if(path.length>4000){
        path = path.filter((k,l)=>{
            return l%40==0|| l==0||l==path.length-1;
        })
    }
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