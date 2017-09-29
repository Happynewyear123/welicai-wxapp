const excel = require('../../utils/excel.js');

Page({
    data: {
        // 数据
        target: 0,
        money: 0,
        rate: 0,
        period: 0,
        tmultiple: 10000,
        multiple: 1,
        type: 'money',
        periodType: 'month',

        result: 0,
        rtotal: 0,
        rrate: 0,
        rperiod: 0,
        interest: 0,
        show: false,
        showMoney: false,

        // 数组、
        moneyTypes: [
            {
                name: '元',
                value: 1,
                checked: true
            },
            {
                name: '千元',
                value: 1000,
                checked: false
            }
        ],
        typeItems: [
            { name: '计算每期投资金额', value: 'money', checked: true },
            { name: '计算年收益率', value: 'rate', checked: false }
        ],
        periodItems: [
            { name: '按年', value: 'year', checked: false },
            { name: '按月', value: 'month', checked: true }
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
                checked: true
            },
            {
                name: '元',
                value: 1,
                checked: false
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
    inputTarget: function(e) {
        this.setData({
            target: parseInt(e.detail.value)
        });
    },
    inputMoney: function(e) {
        this.setData({
            money: parseFloat(e.detail.value)
        });
    },
    moneyChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.moneyTypes;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            multiple: val | 0,
            moneyTypes: radioItems
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
    typeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.typeItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            showMoney: val === 'rate',
            type: val,
            typeItems: radioItems
        });
    },

    periodTypeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.periodItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }
        this.setData({
            periodType: val,
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
            tmultiple: val,
            fMultiples: radioItems
        });
    },
    doit: function() {
        let done = true;
        const t = this;
        const data = t.data;
        [
            'target',
            'period',
            data.type === 'rate' ? 'money' : 'rate'
        ].forEach(function(id) {
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
            let targetMoney = data.target * data.tmultiple;
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
            }
            let ptype = data.longType;

            if (ptype === 1) {
                period = fm * period;
            }

            if (data.type === 'rate') {
                // 计算收益率
                let rrate = 0;
                let arr = [-targetMoney];
                let dates = [new Date(2000, 0, 1)];
                let money = data.money * data.multiple;
                let rtotal = 0;

                switch (percent) {
                    case 'year':
                        for (let i = 0; i < period; i++) {
                            dates.push(new Date(2000 + i, 0, 1));
                            arr.push(money);
                        }
                        rrate = excel.XIRR(arr, dates, 0.1);
                        break;
                    case 'month':
                        for (let i = 1; i <= period; i++) {
                            // console.log(now.add(i, 'months'))
                            dates.push(new Date(2000, i, 1));
                            arr.push(money);
                        }
                        rrate = excel.XIRR(arr, dates, 0.1);
                        break;
                }
                // 利率上取
                rrate = -Math.floor((rrate * 10000).toFixed(2)) / 100;
                rtotal = (money * period).toFixed(2);
                let interest = (targetMoney - rtotal).toFixed(2);
                t.setData({
                    rperiod: period,
                    show: true,
                    rrate: rrate,
                    rtotal: rtotal,
                    interest: interest
                });
            } else {
                // 计算投入金额, 上取
                let result = -Math.floor(
                    excel.PMT(rate / fm, period, 0, targetMoney)
                );
                let rtotal = (result * period).toFixed(2);
                let interest = (targetMoney - rtotal).toFixed(2);
                t.setData({
                    show: true,
                    rperiod: period,
                    result: result,
                    rtotal: rtotal,
                    interest: interest
                });
            }
        }
    }
});
