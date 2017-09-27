const periods = [];
for (let i = 1; i <= 50; i++) {
    periods.push(`${i}年后`);
}

Page({
    data: {
        // 数据
        money: '',
        rate: '',
        period: '',
        multiple: 1,
        periodType: '365',
        result: 0,
        total: 0,
        dayInterest: 0,
        // 数组
        periodTypes: [
            {
                name: '天',
                value: 365,
                checked: true
            },
            {
                name: '月',
                value: 12,
                checked: false
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
    periodTypeChange: function(e){
        var radioItems = this.data.periodTypes;
        for (var i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == e.detail.value;
        }

        this.setData({
            periodTypes: radioItems
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
