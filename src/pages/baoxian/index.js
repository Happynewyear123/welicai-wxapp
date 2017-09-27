const periods = [];
for (let i = 1; i <= 50; i++) {
    periods.push(`${i}年后`);
}

Page({
    data: {
        // 数据
        fmoney: '',
        xmoney: '',
        xTypeIndex: 0,
        fTypeIndex: 0,
        backTypeIndex: 0,
        periodIndex: 19,
        backMoney: '',
        fmultiple: '10000',
        backRate: '',
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
        fTypes: ['按年缴费', '按月缴费'],
        periods: periods
    },
    periodChange: function(e) {
        this.setData({
            periodIndex: e.detail.value | 0
        });
    },
    backTypeChange: function(e) {
        console.log(e.detail);
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
        var radioItems = this.data.fMultiples;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            fMultiples: radioItems
        });
    }
});
