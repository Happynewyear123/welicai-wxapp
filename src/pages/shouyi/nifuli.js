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
        showMoney: true,
        // 数组、
        typeItems: [
            { name: '计算每期投入金额', value: '0' },
            { name: '计算预期年化收益率', value: '1', checked: true }
        ],
        radioItems: [
            { name: '按年', value: '0' },
            { name: '按月', value: '1', checked: true }
        ],
        periodTypes: [
            {
                name: '期数',
                value: 1,
                checked: false
            },
            {
                name: '年限',
                value: 12,
                checked: true
            }
        ],
        moneyTypes: [
            {
                name: '千元',
                value: 1000,
                checked: true
            },
            {
                name: '元',
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
    periodTypeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.periodTypes;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            periodTypes: radioItems
        });
    },
    moneyChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.moneyTypes;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            moneyTypes: radioItems
        });
    },
    typeChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.typeItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }
        const show = val === '1';
        this.setData({
            showMoney: show,
            typeItems: radioItems
        });
    },
    radioChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.radioItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            radioItems: radioItems
        });
    },
    backMoneyChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.fMultiples;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }

        this.setData({
            fMultiples: radioItems
        });
    }
});
