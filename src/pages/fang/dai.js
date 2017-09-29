const periods = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i * 12}期`);
}
const excel = require('../../utils/excel.js');

Page({
    data: {
        // 数据
        money: 0,
        orgi_rate: 4.9,
        rate: 4.9,
        period: 20 * 12,
        periods: periods,
        periodIndex: 19,

        show: false,
        // 数组、
        typeIndex: 0,
        types: ['等额本息', '等额本金']
    },
    doit: function(e) {
        const t = this;
        let done = true;
        const data = t.data;
        let rate = data.rate / 12 / 100;
        ['money', 'rate'].forEach(function(id) {
            if (!data[id]) {
                done &&
                    wx.showToast({
                        title: '请填写正确字段',
                        image: '../../image/warn.png'
                    });
                done = false;
            }
        });

        if (done) {
            let type = (data.typeIndex | 0) + 1;
            // 还款期数
            let period = data.period | 0;
            // 总利息
            let interest = 0;
            let i = 0;
            let r = {
                // 本金
                p: [],
                // 利息
                i: [],
                // 本息和值
                s: [],
                // 剩余
                r: []
            };
            let temp;
            let total = data.money;
            let dai = total;
            console.log(period, dai, rate);
            if (type === 1) {
                // 等额本息
                let pmt = parseFloat(
                    excel.PMT(rate, period, -total).toFixed(2)
                );
                for (let i = 1; i <= period; i++) {
                    temp = parseFloat(
                        excel.IPMT(rate, i, period, -total).toFixed(2)
                    );
                    // debugger
                    r.i.push(temp);
                    r.s.push(pmt);
                    let p = parseFloat(pmt - temp).toFixed(2);
                    r.p.push(p);
                    dai = parseFloat(dai - p).toFixed(2);
                    r.r.push(dai);
                    interest += temp;
                }
                interest = interest.toFixed(2);
            } else {
                // 等额本金
                // 每期本金
                let b = parseFloat((total / period).toFixed(2));
                for (let i = 0; i < period; i++) {
                    // 上取证书
                    temp = parseFloat(((total - b * i) * rate).toFixed(2));
                    interest += temp;
                    r.i.push(temp);
                    r.p.push(b);
                    r.s.push(parseFloat((b + temp).toFixed(2)));
                    r.r.push(parseFloat((total - b * (i + 1)).toFixed(2)));
                }
                interest = interest.toFixed(2);
            }
            t.setData({
                resultI: r.i,
                resultP: r.p,
                resultR: r.r,
                resultS: r.s,
                show: true,
                interest: interest
            });
        }
    },
    inputRate: function(e) {
        this.setData({
            rate: parseFloat(e.detail.value)
        });
    },
    inputMoney: function(e) {
        this.setData({
            money: parseFloat(e.detail.value) * 10000
        });
    },
    periodChange: function(e) {
        const val = e.detail.value | 0;
        this.setData({
            period: (val + 1) * 12,
            periodIndex: val
        });
    },
    typeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value | 0
        });
    }
});
