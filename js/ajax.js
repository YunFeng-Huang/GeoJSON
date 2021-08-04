$.ajaxSetup({
    headers: {
        // 'token': getQueryString('token')
    },
    success(res){
        console.log(res)
        
    },
    fail(err){
        console.log(err)
    }
});
let urlHost = 'http://47.99.66.186:9999'

function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}


function fetch(url, data={}, type = 'POST') {
    data = {...data,...{'token': '807BB0364FC5EC081D396599D7D3D4A6'}}
    if (!data['lnglatGaode']){
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                url += `${url.includes('?') ? '&' : '?'}${key}=${element}`
            }
        }
    }
    
    return new Promise((resolve, enject) => {
        $.ajax({
            type: type,
            url: url.includes('http')?url:( urlHost + url),
            async: true,
            data: JSON.stringify(data),
            contentType: "application/json",
            dataType: 'json',
            success: (res)=>{
                if(res.error){
                    alert(res.error)
                }
                resolve(res)
            },
            fail: (res)=>{
                enject(res)
            }
        });
    })
}
