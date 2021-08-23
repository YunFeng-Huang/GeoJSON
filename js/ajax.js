$.ajaxSetup({
    headers: {
        // 'token': getQueryString('token')
    },
    success(res) {
        console.log(res)

    },
    fail(err) {
        console.log(err)
    }
});
let urlHost = 'http://47.99.66.186:18801';
// let urlHost = location.href.includes('http') ? 'http://47.99.66.186:18801' : 'http://47.99.66.186:9999';
var oss = 'http://qixing.dqhtravel.com';
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURIComponent(r[2]);
    }
    return null;
}


function fetch(url, data = {}, type = 'POST') {
    data = { ...data, ...{ 'token': sessionStorage.token } }
    let _isFormData = data['lnglatGaode'];
    if (!_isFormData) {
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                url += `${url.includes('?') ? '&' : '?'}${key}=${element}`
            }
        }
    } else {
        var _data = new FormData();
        for (const key in data) {
            if (Object.hasOwnProperty.call(data, key)) {
                const element = data[key];
                _data.append(key, element);
            }
        }
        data = _data;
    }

    return new Promise((resolve, enject) => {
        $.ajax({
            type: type,
            url: url.includes('http') ? url : (urlHost + url),
            async: true,
            data: _isFormData ? data : JSON.stringify(data),
            dataType: 'json',
            processData: false,
            contentType: _isFormData ?  false: "application/json",
            success: (res) => {
                if (res.error) {
                   return alert(res.error)
                }
                resolve(res)
            },
            fail: (res) => {
                enject(res)
            }
        });
    })
}
