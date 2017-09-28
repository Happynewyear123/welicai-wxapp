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
    periodTypeChange: function(e){
        let radioItems = this.data.periodTypes;
        const val = e.detail.value;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            periodTypes: radioItems
        });
    },
    backMoneyChange: function(e) {
        let radioItems = this.data.fMultiples;
        const val = e.detail.value;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            fMultiples: radioItems
        });
    }
});
