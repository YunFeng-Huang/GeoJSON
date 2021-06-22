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
    //     let last = arr[arr.length - 1]

    //    let lines = LineArr.filter(v=>{
    //        return v.include && v.include.some(k=>{
    //             return k.name == last.name;
    //         })
    //     })
    //     console.log(lines,'lines')
    //     // lines.map(v=>{
    //     //     console.log(v,'v')
    //     //     draw(v)

    //     // })


    //     let lines1 = lines?.map((v, i) => {
    //         const coordinates = v.geometry.coordinates
    //         return {
    //             "line_id": "110100010117" + i,
    //             "line_name": v.properties.name,
    //             "lnglat": coordinates
    //         }
    //     })
    //     layer1.setData(lines1, {
    //         lnglat: 'lnglat'
    //     }).render();


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


function changArr(type, coordinates) {
    start_planning(type, coordinates)
    if (type == 3) {
        // const name = geojson.properties.name
        addArr(coordinates, '')
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
function getGroup(geoJSON) {
    //  PointAll = geoJSON.features.filter(v => {
    //     return v.geometry.type == 'Point'
    // })
    LineArr = [];
    PointAll = [];

    LineArr = geoJSON.features.filter(v => {
        return v.geometry.type == 'LineString'
    })
    LineArr.map((v, i) => {
        const coordinates = v.geometry.coordinates
        PointAll = [...PointAll, coordinates[0], coordinates[coordinates.length -1]]
    })
    LineArr.map((e) => {
        PointAll.map((p) => {
            const path = e.geometry.coordinates;
            let dis = AMap.GeometryUtil.isPointOnLine(p, path, 500);
            // let dis = AMap.GeometryUtil.distanceToSegment(p, path);
            // console.log(dis,'dis')
            if (dis) {
                let include = e?.include;
                if (include) {
                    include.push(p)
                } else {
                    include = [p]
                }
                e.include = include;
            }
        })
    })
    console.log(LineArr, 'LineArr')
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
function start_planning(type, coordinates) {
    // let startPoint;
    let lines = []
    let points = []
    LineArr.map((v) => {
        const in_point = JSON.stringify(v.include);
        const current_point = JSON.stringify(coordinates);
// 这里要先对点位排序，参考点线段两端任选一点
        // selectionSort(arr)


        //点在线上
        if (in_point.includes(current_point)) {
            console.log(v, 'v', current_point)
            const inc = v.include;
            // 获取相邻点位 成立条件点位按远近排序
            inc.map((k, i) => {
                if (JSON.stringify(k) == current_point){
                    const left_point = i - 1 >= 0 ? inc[i - 1] : null;
                    const right_point = i + 1 <= inc.length-1 ? inc[i + 1] : null;
                    console.log(left_point, right_point)
                    left_point && points.push(left_point)
                    right_point && points.push(right_point)
                }
            })
        }
    })
    console.log(points, 'points')
    let markerList = points.map(v=>{
        return _marker('', v,
            defaultIcon1, {
            'id': v,
            'type': 3 
        });
    })
    console.log(markerList,'markerList')
    map.add(markerList);


}


function selectionSort(arr) {
    varlen = arr.length;
    varminIndex, temp;
    for (vari = 0; i < len - 1; i++) {
        minIndex = i;
        for (varj = i + 1; j < len; j++) {
            if (arr[j] < arr[minIndex]) {    // 寻找最小的数
                minIndex = j;                // 将最小数的索引保存
            }
        }
        temp = arr[i];
        arr[i] = arr[minIndex];
        arr[minIndex] = temp;
    }
    returnarr;
}