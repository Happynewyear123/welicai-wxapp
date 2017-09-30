const periods = [];
const years = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i * 12}期`);
    if (i <= 10) {
        years.push(`${i}年`);
    }
}
const excel = require('../../utils/excel.js');

Page({
    data: {
        // 数据
        total: 0,
        shoufu: 0,
        orgi_hopeRate: 10,
        hopeRate: 10,
        rate: 4.9,
        rent: 0,
        tax: 0,
        rentMult: 10000,
        taxMult: 10000,
        // 数据
        orgi_rate: 4.9,
        period: 20 * 12,
        periods: periods,
        periodIndex: 19,

        show: false,
        years: years,
        yearIndex: 4,
        year: 5,
        show: false,
        // 数组、
        typeIndex: 0,
        types: ['等额本息', '等额本金'],
        rentMults: [
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
        taxMults: [
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
        // todo
        // 1. 首付===房价，全款
        //
        let done = true;
        const t = this;
        const data = t.data;
        ['total', 'rate', 'shoufu'].forEach(function(id) {
            if (!data[id]) {
                done &&
                    wx.showToast({
                        title: '请填写正确字段',
                        image: '../../image/warn.png'
                    });
                done = false;
            }
        });
        let fz = data.rent * data.rentMult;
        let interest = 0;
        let total = data.total;
        let sf = data.shoufu;
        let dai = total - sf;
        let fee = data.tax * data.taxMult;
        let rate = data.rate / 12 / 100;
        let period = data.period | 0;
        let iperiod = data.year * 12;
        let temp = 0;
        let i = 1;
        let type = (data.typeIndex | 0) + 1;
        
        if (dai !== 0) {
            if (type === 1) {
                // 等额本息
                for (i = 1; i <= iperiod; i++) {
                    temp = parseFloat(
                        excel.IPMT(rate, i, period, -dai).toFixed(2)
                    );
                    interest += temp;
                }
                interest = interest.toFixed(2);
            } else {
                // 等额本金
                // 每期本金
                let b = dai / period;
                for (i = 0; i < iperiod; i++) {
                    // 上取整数
                    temp = -Math.floor(-(dai - b * i) * rate);
                    interest += temp;
                }
                interest = interest.toFixed(2);
            }
        } else {
            // 土豪全款买房，没有加杠杆
        }

        interest = parseFloat(interest);
        // 到期后的 房屋增值+房租收入 - 利息支出
        let earnings = parseFloat(
            (total * data.hopeRate / 100 + fz - interest).toFixed(2)
        );
        // 收益 = 总价 + 房屋增值+房租收入 - 利息支出 - 税费 - 首付
        // 投入
        let cost = sf + fee;
        let result;
        if (iperiod === 12) {
            // 一年直接算
            result = (earnings / cost * 100).toFixed(2);
        } else {
            // 复利计算
            let moneys = [-cost, cost + earnings];
            let dates = [
                new Date(2000, 0, 1),
                new Date(2000 + iperiod / 12, 1, 1)
            ];
            result = (excel.XIRR(moneys, dates) * 100).toFixed(2);
        }
        t.setData({
            show: true,
            interest: interest,
            result: result,
            earnings: earnings
        });
    },
    inputTotal: function(e) {
        this.setData({
            total: parseFloat(e.detail.value) * 10000
        });
    },
    inputHopeRate: function(e) {
        this.setData({
            hopeRate: parseFloat(e.detail.value)
        });
    },
    inputRent: function(e) {
        this.setData({
            rent: parseFloat(e.detail.value)
        });
    },
    inputTax: function(e) {
        this.setData({
            tax: parseFloat(e.detail.value)
        });
    },
    inputRate: function(e) {
        this.setData({
            rate: parseFloat(e.detail.value)
        });
    },
    inputShoufu: function(e) {
        this.setData({
            shoufu: parseFloat(e.detail.value) * 10000
        });
    },
    yearChange: function(e) {
        const val = e.detail.value | 0;

        this.setData({
            year: val + 1,
            yearIndex: val
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
    },
    rentChange: function(e) {
        const val = e.detail.value | 0;
        let radioItems = this.data.rentMults;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            rentMult: val,
            rentMults: radioItems
        });
    },
    taxChange: function(e) {
        const val = e.detail.value | 0;
        let radioItems = this.data.taxMults;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            taxMult: val,
            taxMults: radioItems
        });
    },
    shoufuChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.shoufuMoney;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            shoufuMoney: radioItems
        });
    }
});
