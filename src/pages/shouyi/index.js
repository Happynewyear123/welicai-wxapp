const periods = [];
for (let i = 1; i <= 50; i++) {
    periods.push(`${i}年后`);
}

Page({
    data: {
        // 数据
        money: 10,
        rate: 6.0,
        period: 5,
        multiple: 10000,
        periodType: 12,
        result: 0,
        total: 0,
        show: false,
        dayInterest: 0,
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
        let done = true;
        const data = t.data;
        ['money', 'rate', 'period'].forEach(function(id) {
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
            let money = (data.money | 0) * (data.multiple | 0);
            let rate = data.rate / data.periodType / 100;
            let period = data.period;
            let fm = data.periodType;

            let result = parseFloat((money * rate * period).toFixed(2));
            let total = parseInt(money) + result;
            let days = period;
            switch (fm) {
                case '1':
                    // 年
                    days = period * 365;
                    break;
                case '12':
                    days = period * 30;
                    break;
            }
            let dayInterest = (result / days).toFixed(2);
            t.setData({
                show: true,
                result: result,
                total: total,
                dayInterest: dayInterest
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
            money: e.detail.value | 0
        });
    },
    inputPeriod: function(e) {
        this.setData({
            period: e.detail.value | 0
        });
    },
    periodTypeChange: function(e) {
        let radioItems = this.data.periodTypes;
        const val = e.detail.value | 0;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            periodType: val,
            periodTypes: radioItems
        });
    },
    multChange: function(e) {
        const val = e.detail.value | 0;
        let radioItems = this.data.fMultiples;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            multiple: val,
            fMultiples: radioItems
        });
    }
});
