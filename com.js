var arr = []
var obj = {
    start: '',
    end: '',
}

var addArr = (id, name) => {
    // _riding_jump(id)
    arr.push({
        id,
        name
    })
    console.log(arr, 'addArr')
    console.log(LineArr, 'LineArr')
    let last = arr[arr.length - 1]

   let lines = LineArr.filter(v=>{
       return v.include && v.include.some(k=>{
            return k.name == last.name;
        })
    })
    console.log(lines,'lines')
    // lines.map(v=>{
    //     console.log(v,'v')
    //     draw(v)
        
    // })


    let lines1 = lines?.map((v, i) => {
        const coordinates = v.geometry.coordinates
        return {
            "line_id": "110100010117" + i,
            "line_name": v.properties.name,
            "lnglat": coordinates
        }
    })
    layer1.setData(lines1, {
        lnglat: 'lnglat'
    }).render();


}
var delArr = (id) => {
    console.log(arr)
    console.log(id)
    let last = arr[arr.length - 1]
    if (last.id != id) {
        alert('只能删除最近添加的锚点')
        return false;
    } else {
        riding.clear()
        last.routeLine && last.routeLine.hide()
        arr.splice(arr.length - 1, 1)
        console.log(arr, 'delArr')

        return true;
    }
    // arr = arr.filter(v => {
    //     return v.id != id;
    // })
}


function changArr(type, coordinates, geojson) {
    if (type == 3) {
        const name = geojson.properties.name
        addArr(coordinates, name)
    } else {
        return delArr(coordinates)
    }

    //     arr.length>1 && arr.reduce((v,k,i)=>{
    //         _riding_jump(v.id, k.id)
    //         return k;
    //    }, arr[0])
}


var driving = new AMap.Driving({
    map: map,
    panel: "panel"
});




var _riding_jump = (last) => {
    let start = arr[arr.length - 1]
    //根据起终点坐标规划骑行路线
    start && riding.search(start.id, last, function (status, result) {
        // result即是对应的公交路线数据信息，相关数据结构文档请参考  https://lbs.amap.com/api/javascript-api/reference/route-search#m_RidingResult
        if (status === 'complete') {
            console.log('骑行路线数据查询成功', result)
            if (result.routes && result.routes.length) {
                drawRoute(result.routes[0])
            }
        } else {
            console.log('骑行路线数据查询失败' + result)
        }
    });

}

var draw = (path) => {
    // console.log(path, 'path')
    // map.add(new AMap.Polyline({
    //     path: path,
    //     isOutline: true,
    //     outlineColor: '#ffeeee',
    //     borderWeight: 2,
    //     strokeWeight: 5,
    //     strokeColor: '#0091ff',
    //     strokeOpacity: 0.9,
    //     lineJoin: 'round'
    // }));

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
var LineArr; //所有的线
let PointAll;//所有的岔路口
function getGroup(geoJSON){
     PointAll = geoJSON.features.filter(v => {
        return v.geometry.type == 'Point' && v.properties.name
    })

     LineArr = geoJSON.features.filter(v => {
        return v.geometry.type == 'LineString'
    })

    LineArr.map((e)=>{
        PointAll.map((v)=>{
            const p = v.geometry.coordinates;
            const path = e.geometry.coordinates;
            let dis = AMap.GeometryUtil.isPointOnLine(p, path,1000);
            // let dis = AMap.GeometryUtil.distanceToSegment(p, path);
            // console.log(dis,'dis')
            if (dis){
                let include = e?.include;
                let item = {
                    name: v.properties.name,
                    coordinates: p
                }
                if (include){
                    include.push(item)
                }else{
                    include = [item]
                }
                e.include = include;
            }
        })
    })
    console.log(LineArr,'LineArr')
}


