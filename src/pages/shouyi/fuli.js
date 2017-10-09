Page({
    onShareAppMessage: function(res) {
        return {
            title: '复利计算器：一笔钱循环购买一款理财产品，计算收益率',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        // 数据
        money: 0,
        rate: 0,
        period: 0,
        long: 0,
        multiple: 10000,
        periodType: 12,
        show: true,
        result: 0,
        total: 0,
        // 数组
        periodTypes: [
            {
                name: '天',
                value: 365,
                checked: false
            },
            {
                name: '月',
                value: 12,
                checked: true
            },
            {
                name: '年',
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
    doit: function() {
        const t = this;
        const data = t.data;
        let done = true;
        ['money', 'rate', 'period', 'long'].forEach(function(id) {
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
            let money = data.money * data.multiple;
            let period = data.period;
            let rate = data.long * (data.rate / data.periodType) / 100;
            let result = Math.pow(1 + rate, period) * money;
            result = parseFloat(result.toFixed(2));
            //计算总投入
            let interest = parseFloat((result - money).toFixed(2));
            t.setData({
                show: true,
                result: result,
                principal: money,
                interest: interest
            });
        }
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
    inputMoney: function(e) {
        this.setData({
            money: parseFloat(e.detail.value)
        });
    },
    inputLong: function(e) {
        this.setData({
            long: e.detail.value | 0
        });
    },
    periodTypeChange: function(e) {
        let radioItems = this.data.periodTypes;
        const val = e.detail.value;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            periodType: val,
            periodTypes: radioItems
        });
    },
    multChange: function(e) {
        let radioItems = this.data.fMultiples;
        const val = e.detail.value;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            multiple: val,
            fMultiples: radioItems
        });
    }
});
