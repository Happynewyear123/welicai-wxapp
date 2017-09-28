Page({
    data: {
        // 数据
        showInput: true,
        money: '',
        rate: '',
        period: '',
        multiple: 1,
        periodType: '365',
        result: 0,
        total: 0,
        dayInterest: 0,
        // 数组、
        radioItems: [
            { name: '按年', value: '0' },
            { name: '按月', value: '1', checked: true },
            { name: '按天', value: '2', checked: false }
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
    radioChange: function(e) {
        const val = e.detail.value;
        let radioItems = this.data.radioItems;
        for (let i = 0, len = radioItems.length; i < len; ++i) {
            radioItems[i].checked = radioItems[i].value == val;
        }
        
        let showInput = val !== '2';
        this.setData({
            showInput: showInput,
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
