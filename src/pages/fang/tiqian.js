const periods = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i * 12}期`);
}
const date1 = dateFormat(Date.now() - 365 * 3600 * 24 * 1e3, 'yyyy-MM');
const date2 = dateFormat(Date.now(), 'yyyy-MM');
Page({
    data: {
        // 数据
        rate: '4.9',
        date1: date1,
        date2: date2,

        periods: periods,
        periodIndex: 19,
        // 数组、
        typeIndex: 1,
        types: ['等额本息', '等额本金']
    },
    periodChange: function(e) {
        this.setData({
            periodIndex: e.detail.value | 0
        });
    },
    bindDate1Change: function(e) {
        this.setData({
            date1: e.detail.value
        });
    },
    bindDate2Change: function(e) {
        this.setData({
            date2: e.detail.value
        });
    },
    typeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value | 0
        });
    }
});

function dateFormat(d, pattern) {
    pattern = pattern || 'yyyy-MM-dd';
    if (typeof d === 'number') {
        d = new Date(d);
    }
    let y = d.getFullYear().toString(),
        o = {
            M: d.getMonth() + 1, //month
            d: d.getDate(), //day
            h: d.getHours(), //hour
            m: d.getMinutes(), //minute
            s: d.getSeconds() //second
        };
    pattern = pattern.replace(/(y+)/gi, function(a, b) {
        return y.substr(4 - Math.min(4, b.length));
    });
    for (var i in o) {
        pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function(
            a,
            b
        ) {
            return o[i] < 10 && b.length > 1 ? '0' + o[i] : o[i];
        });
    }
    return pattern;
}
