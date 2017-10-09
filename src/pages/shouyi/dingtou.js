const excel = require('../../utils/excel.js');

Page({
    onShareAppMessage: function(res) {
        return {
            title: '定投计算器：定期固定投入一笔钱，n年之后计算下收益',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        // 数据
        money: 0,
        rate: 0,
        days: 0,
        period: 0,
        multiple: 1,

        periodType: 'month',
        longType: 0,

        result: 0,
        total: 0,
        rperiod: 0,
        interest: 0,
        show: false,
        showInput: false,
        // 数组、
        periodItems: [
            { name: '按年', value: 'year', checked: false },
            { name: '按月', value: 'month', checked: true },
            { name: '按天', value: 'day', checked: false }
        ],
        longItems: [
            {
                name: '期数',
                value: 0,
                checked: true
            },
            {
                name: '年限',
                value: 1,
                checked: false
            }
        ],
        fMultiples: [
            {
                name: '万元',
                value: 10000,
                checked: false
            },
            {
                name: '元',
                value: 1,
                checked: true
            }
        ]
    },
    inputRate: function(e) {
        this.setData({
            rate: parseFloat(e.detail.value)
        });
    },
    inputPeriod: function(e) {
        this.setData({
            period: parseInt(e.detail.value)
        });
    },
    inputDays: function(e) {
        this.setData({
            days: parseInt(e.detail.value)
        });
    },
    inputMoney: function(e) {
        this.setData({
            money: parseFloat(e.detail.value)
        });
    },

    longTypeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.longItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            longType: val | 0,
            longItems: radioItems
        });
    },

    periodTypeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.periodItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        let showInput = val === 'day';
        this.setData({
            periodType: val,
            showInput: showInput,
            periodItems: radioItems
        });
    },
    multChange: function(e) {
        let radioItems = this.data.fMultiples;
        const val = e.detail.value | 0;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            multiple: val,
            fMultiples: radioItems
        });
    },
    doit: function() {
        let done = true;
        const t = this;
        const data = t.data;
        ['money', 'period', 'rate'].forEach(function(id) {
            if (!data[id]) {
                done &&
                    wx.showToast({
                        title: '请填写正确字段',
                        image: '../../image/warn.png'
                    });
                done = false;
            }
        });
        if (done && data.periodType === 'day') {
            if (!data.days) {
                wx.showToast({
                    title: '请填写正确字段',
                    image: '../../image/warn.png'
                });
                done = false;
            }
        }
        // console.log(formula.FV(0.05/12, 1*12, 300, 1).toFixed(2))
        if (done) {
            let money = data.money * data.multiple;
            let rate = data.rate / 100;
            let period = data.period;
            let percent = data.periodType;
            let fm = 1;

            switch (percent) {
                case 'year':
                    break;
                case 'month':
                    fm = 12;
                    break;
                case 'day':
                    fm = 365 / data.days;
                    break;
            }

            let ptype = data.longType;

            if (ptype === 1) {
                period = fm * period;
            }
            let total = Math.floor((money * period * 100).toFixed(2)) / 100;
            let sum = -excel.FV(rate / fm, period, money, 1).toFixed(2);
            // console.log()
            let interest = (sum - total).toFixed(2);
            t.setData({
                show: true,
                rperiod: period,
                total: total,
                result: sum,
                interest: interest
            });
        }
    }
});
