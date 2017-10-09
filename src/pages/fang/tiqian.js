const periods = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i * 12}期`);
}
const excel = require('../../utils/excel.js');

const smonth = dateFormat(Date.now() - 365 * 3600 * 24 * 1e3, 'yyyy-MM');
const start = dateFormat(Date.now() - 10 * 365 * 3600 * 24 * 1e3, 'yyyy-MM');
const end = dateFormat(Date.now() + 5 * 365 * 3600 * 24 * 1e3, 'yyyy-MM');
const fmonth = dateFormat(Date.now(), 'yyyy-MM');
Page({
    onShareAppMessage: function(res) {
        return {
            title: '房贷提前还款计算器：房贷提前还款怎么选择后续贷款方式？',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        // 数据
        money: 0,
        reMoney: 0,
        orgi_rate: 4.9,
        rate: 4.9,
        smonth: smonth,
        fmonth: fmonth,
        start: start,
        end: end,
        periods: periods,
        periodIndex: 19,
        period: 20 * 12,
        show: false,
        // 数组、
        typeIndex: 0,
        types: ['等额本息', '等额本金']
    },
    periodChange: function(e) {
        this.setData({
            periodIndex: e.detail.value | 0
        });
    },
    doit: function() {
        let done = true;
        const t = this;
        const data = t.data;
        let type = (data.typeIndex | 0) + 1;

        // 还款期数
        let period = data.period | 0;
        let rate = parseFloat(data.rate);
        rate = rate < 1 ? rate : rate / 100;
        rate = rate / 12;
        let money = data.reMoney;
        let total = data.money;

        ['reMoney', 'rate', 'money', 'smonth', 'fmonth'].forEach(function(id) {
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
            let smonth = new Date(data.smonth);
            let fmonth = new Date(data.fmonth);

            if (+fmonth < +smonth) {
                wx.showToast({
                    title: '提前还款时间太早',
                    image: '../../image/warn.png'
                });
                return;
            }

            let years = fmonth.getYear() - smonth.getYear();
            let months = fmonth.getMonth() - smonth.getMonth();
            let doMonth = years * 12 + months + 1;

            // 剩余还款计划
            let r = repay(type, rate, period, total);
            // 原来剩余利息总额
            let oldInterest = 0;
            for (let i = doMonth + 1; i < period; i++) {
                oldInterest += r.i[i];
            }
            oldInterest = Math.floor(oldInterest);
            // 完成还款计划
            let exData = {};
            for (let i in r) {
                exData[i] = r[i].splice(0, doMonth);
            }
            // 剩余贷款
            let newTotal = total - money;
            //已利息
            let doInterest = 0;
            let doP = 0;
            let doS = 0;
            exData.p.forEach(function(v, i) {
                if (i < doMonth - 1) {
                    doInterest += exData.i[i];
                    doS += exData.s[i];
                    doP += exData.p[i];
                }
                newTotal -= v;
            });

            newTotal = Math.floor(newTotal);
            // 计算新的还款
            // 期数不变
            let newData1 = repay(type, rate, period - doMonth, newTotal);

            // 计算利息节省
            let newInterest1 = 0;
            newData1.i.forEach(function(v) {
                newInterest1 += v;
            });
            newInterest1 = Math.floor(newInterest1);
            newInterest1 = oldInterest - newInterest1;

            let dataS = r.p;
            let tTotal = newTotal;
            let newData2,
                newInterest2 = 0,
                end;
            // 月还款额度不变
            if (type === 2) {
                // 等额本金
                //月还款额不变是指月还款的本金不变
                let i;
                for (i = 0; i < period - doMonth; i++) {
                    if (tTotal <= 0) {
                        break;
                    }
                    tTotal -= dataS[i];
                }
                end = new Date(fmonth.getFullYear(), fmonth.getMonth() + i, 1);
                newData2 = repay(type, rate, i, newTotal);
                // 计算利息节省
                newData2.i.forEach(function(v) {
                    newInterest2 += v;
                });
                newInterest2 = Math.floor(newInterest2);
                newInterest2 = oldInterest - newInterest2;
            } else {
                let NMA = r.s[0];
                let endPeriod = Math.ceil(
                    Math.log(NMA / (NMA - tTotal * rate)) / Math.log(1 + rate)
                );
                end = new Date(
                    fmonth.getFullYear(),
                    fmonth.getMonth() + endPeriod,
                    1
                );
                newData2 = repay(type, rate, endPeriod, newTotal);
                // 计算利息节省
                newData2.i.forEach(function(v) {
                    newInterest2 += v;
                });
                newInterest2 = Math.floor(newInterest2);
                newInterest2 = oldInterest - newInterest2;
            }
            let lastPay = exData.s[exData.s.length - 1];
            t.setData({
                show: true,
                //已还信息
                doInterest: Math.floor(doInterest * 100) / 100,
                doS: Math.floor(doS * 100) / 100,
                doP: Math.floor(doP * 100) / 100,
                next: money + lastPay,
                // =========期数不变=========
                // 节省利息
                pfInterest: newInterest1,
                // 下月支付
                pfPay: newData1.s[0],
                pfEnd: dateFormat(
                    new Date(
                        smonth.getFullYear(),
                        smonth.getMonth() + period - 1,
                        1
                    ),
                    'yyyy-MM'
                ),

                // ========还款金额不变=========
                // 节省利息
                mfInterest: newInterest2,
                mfPay: newData2.s[0],
                mfEnd: dateFormat(end, 'yyyy-MM')
            });
            console.log(data);
        }
    },
    bindStartChange: function(e) {
        this.setData({
            smonth: e.detail.value
        });
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
    inputReMoney: function(e) {
        this.setData({
            reMoney: parseFloat(e.detail.value) * 10000
        });
    },

    bindFinishChange: function(e) {
        this.setData({
            fmonth: e.detail.value
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
    for (let i in o) {
        pattern = pattern.replace(new RegExp('(' + i + '+)', 'g'), function(
            a,
            b
        ) {
            return o[i] < 10 && b.length > 1 ? '0' + o[i] : o[i];
        });
    }
    return pattern;
}

function repay(type, rate, period, total) {
    type = type | 0;
    let dai = total;
    let data = {
        // 本金
        p: [],
        // 利息
        i: [],
        // 本息和值
        s: [],
        // 剩余
        r: []
    };
    if (type === 1) {
        // 等额本息
        let pmt = parseFloat(excel.PMT(rate, period, -total).toFixed(2));
        // 已经还了多少钱：本金+利息
        for (let i = 1; i <= period; i++) {
            let temp = parseFloat(
                excel.IPMT(rate, i, period, -total).toFixed(2)
            );
            // debugger
            data.i.push(temp);
            data.s.push(pmt);
            let p = parseFloat((pmt - temp).toFixed(2));
            data.p.push(p);
            dai = parseFloat((dai - p).toFixed(2));
            data.r.push(dai);
        }
    } else {
        // 等额本金
        let b = parseFloat((total / period).toFixed(2));
        for (let i = 0; i < period; i++) {
            // 上取证书
            let temp = parseFloat(((total - b * i) * rate).toFixed(2));
            data.i.push(temp);
            data.p.push(b);
            data.s.push(parseFloat((b + temp).toFixed(2)));
            data.r.push(parseFloat((total - b * (i + 1)).toFixed(2)));
        }
    }
    return data;
}
