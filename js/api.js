

// 各类型点位列表接口 点位查询
function dqh_wcList(startPointId, endPointId) {

    fetch(`/PCodeClient/api.ashx?cmd=dqh_wcList`, { types: '主入口,出入口,节岔点' }).then((res) => {
        console.log(res, 'res');
        let path = res.msg.ds;
        const m = path.map(v => {
            v.type_n = v.type;
            delete v.type;
            return _marker(v.name, [v.lngGaode, v.latGaode],
                defaultIcon0, {
                ...{
                    'type': 3 // 0 默认值 1 起点 2 终点
                }, ...v
            });

        })
        map.add(m);
    })
}

var activePath ;
//相邻节点及路线信息查询接口
function dqh_pointLine(id) {
   return new Promise(resolve=>{
       fetch(`/PCodeClient/api.ashx?cmd=dqh_pointLine`, {
           id
       }).then((res) => {
           console.log(res, 'res');
           activePath = res.msg.ds1;
           nextPolyline.map(v => map.remove(v));
           selectLine = [];
           activePath.map(v => {
               let p = JSON.parse(v.lnglat);
               let _path = p.map(v => [+v.lng, +v.lat])
               draw(_path);
               selectLine.push(_path);
           })
           resolve()
           // map.add(m);
       })
   })
}



//起点终点途径点 路径规划
function start_end(type, obj, id, pointList) {

    console.log(pointList,'pointList')
    let ids = '';
    if ( !pointList || pointList.length == 0){
        if (type == 'end') {
            ids = `${obj.start},${obj.end}`
        } else {
            id_s.push(id);
            ids = `${obj.start},`
            id_s.map(v => {
                ids += `${v},`
            })
            ids += `${obj.end}`;
        }
    }else{
        pointList.map(v=>{
            ids += `${v.id},`
            id_s.push(v.id)
        })
    }
   
    nextPolyline.map(v => map.remove(v));
    _dqh_walkPathPlan({
        ids: ids
    })
}


function _dqh_walkPathPlan(data){
    fetch(`/PCodeClient/api.ashx?cmd=dqh_walkPathPlan`,data).then((res) => {
        console.log(res, 'res');
        let path = res.msg.ds1[0].lnglatGaode;
        path = JSON.parse(path);
        let _path = path.map(v => [v.lng, v.lat])
        if (!pointList || pointList.length == 0) {
            draw(_path);
            userType2Path = _path
        }
    })
}
function deleteId(v){
    let index = id_s.indexOf(v);
    if (index != -1){
        id_s.splice(index,1)
    }
    console.log(id_s, 'id');
}


// 添加步道推荐路线
function dqh_addRecommendWalkRoad(data) {
    if (!data.title){
        return showToast('请添加标题');
    }
    fetch(`/PCodeClient/api.ashx?cmd=dqh_addRecommendWalkRoad`, data).then((res) => {
        showToast(`路线添加${res.msg.ds[0].msg}`);
        if (getQueryString('form')){
            let id = res.msg.ds1[0].id;
            iframe.postMsg(id)
        }
       
        // path = JSON.parse(path);
        // let _path = path.map(v => [v.lng, v.lat])
        // if (!pointList || pointList.length == 0) {
        //     draw(_path);
        //     let a = ''
        //     id_s.map(v => {
        //         a += `${v},`
        //     })
        // }

    })
}



function dqh_punchSetting(data) {
    fetch(`/PCodeClient/api.ashx?cmd=dqh_punchSetting`,data).then((res) => {
        // showToast('打卡成功')
    })
}


// http://47.99.66.186:9999/PCodeClient/api.ashx?cmd=dqh_addRecommendWalkRoad