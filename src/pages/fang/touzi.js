const periods = [];
const years = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i*12}期`);
    years.push(`${i}年`);
}

Page({
    data: {
        // 数据
        wantRate: '10',
        rate: '4.9',
        // 数组、
        years: years,
        periods: periods,
        periodIndex: 19,
        typeIndex: 1,
        yearsIndex: 4,
        types: [
            '等额本息',
            '等额本金'
        ],
        shuiMoney: [
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
        shoufuMoney: [
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
        zongjiaMoneys: [
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
    yearChange: function(e) {
        this.setData({
            yearsIndex: e.detail.value | 0
        });
    },
    typeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value | 0
        });
    },
    periodChange: function(e) {
        this.setData({
            periodIndex: e.detail.value | 0
        });
    },
    zongjiaChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.zongjiaMoneys;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            zongjiaMoneys: radioItems
        });
    },
    shuiChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.shuiMoney;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            shuiMoney: radioItems
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
