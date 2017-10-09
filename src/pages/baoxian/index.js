const excel = require('../../utils/excel.js');
const periods = [];
for (let i = 1; i <= 50; i++) {
    periods.push(`${i}年后`);
}

Page({
    onShareAppMessage: function(res) {
        return {
            title: '保险收益计算器：返现型保险是否真的合算呢？',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        // 数据
        fmoney: 0,
        xmoney: 0,
        xTypeIndex: 0,
        fTypeIndex: 0,
        backTypeIndex: 0,
        periodIndex: 19,
        backMoney: 0,
        fmultiple: 10000,
        backRate: 0,
        period: 20,
        // 结果
        show: false,
        fRate: 0,
        xRate: 0,
        fInterest: 0,
        margin: 0,
        xSum: 0,
        fSum: 0,
        // 数组
        fMultiples: [
            {
                name: '万元',
                value: 10000,
                checked: true
            },
            {
                name: '元',
                value: 1,
                checked: false
            }
        ],

        backTypes: ['固定金额', '缴费金额的百分比'],
        xTypes: ['按年缴费', '按月缴费'],
        fTypes: ['按年缴费', '按月缴费'],
        periods: periods
    },
    doit: function() {
        let arr = ['fmoney', 'xmoney'];
        const t = this;
        const data = t.data;
        let backType = data.backTypeIndex;
        arr.push(backType === 0 ? 'backMoney' : 'backRate'); // 0 按照金额
        let done = true;
        arr.forEach(function(id) {
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

            let fmoney = data.fmoney | 0;
            let xmoney = data.xmoney | 0;
            let ftype = data.fTypeIndex;
            let xtype = data.xTypeIndex;
            let fm = 1;
            let xm = 1;
            let yStep = 0;
            let mStep = 0;
            if (ftype === 1) {
                // 按月份
                fm = 12;
                mStep = 1;
            } else {
                yStep = 1;
            }
            if (xtype === 1) {
                //按月
                xm = 12;
            }
            let fPeriod = data.period * fm;
            let fSum = fmoney * fPeriod;
            let backMoney = data.backMoney;
            if (backType === 0) {
                // 按照金额来返还
                backMoney = backMoney * data.fmultiple;
            } else {
                backMoney = fSum * data.backRate / 100;
            }
            // 以返还为缴费周期为基准，计算每个缴费周期差额
            let margin = fmoney - xm / fm * xmoney;

            let dates = [new Date(2000, 0, 1)];
            let moneys = [-backMoney];
            let moneyx = [-backMoney];
            
            for (let i = 1; i < fPeriod; i++) {
                dates.push(new Date(2000 + yStep * i, 0 + mStep * i, 1));
                moneys.push(fmoney);
                moneyx.push(margin);
            }
            let rate = excel.XIRR(moneys, dates, 0.1);
            rate = -Math.floor((rate * 10000).toFixed(2)) / 100;

            let rate2 = excel.XIRR(moneyx, dates, 0.1);
            rate2 = -Math.floor((rate2 * 10000).toFixed(2)) / 100;

            // 最后纯消费型保险投入
            t.setData({
                xSum: xmoney * xm * data.period / 10000,
                fSum: fSum / 10000,
                margin: Math.floor((margin * 100).toFixed(2)) / 100,
                fRate: rate,
                xRate: rate2,
                fInterest: backMoney - fSum,
                show: true
            });
        }
    },
    inputRate: function(e) {
        this.setData({
            backRate: parseFloat(e.detail.value)
        });
    },
    inputXMoney: function(e) {
        this.setData({
            xmoney: parseFloat(e.detail.value)
        });
    },
    inputMoney: function(e) {
        this.setData({
            fmoney: parseFloat(e.detail.value)
        });
    },
    inputBackMoney: function(e) {
        this.setData({
            backMoney: parseFloat(e.detail.value)
        });
    },
    periodChange: function(e) {
        const val = e.detail.value | 0;
        this.setData({
            periodIndex: val,
            period: val + 1
        });
    },
    backTypeChange: function(e) {
        this.setData({
            backTypeIndex: e.detail.value | 0
        });
    },
    xTypeChange: function(e) {
        this.setData({
            xTypeIndex: e.detail.value | 0
        });
    },
    fTypeChange: function(e) {
        this.setData({
            fTypeIndex: e.detail.value | 0
        });
    },
    backMoneyChange: function(e) {
        let radioItems = this.data.fMultiples;
        const val = e.detail.value | 0;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            fmultiple: val,
            fMultiples: radioItems
        });
    }
});
