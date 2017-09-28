const periods = [];
for (let i = 1; i <= 30; i++) {
    periods.push(`${i}年 - ${i * 12}期`);
}
Page({
    data: {
        // 数据
        rate: '4.9',
        periods: periods,
        periodIndex: 19,
        // 数组、
        typeIndex: 1,
        types: ['等额本息', '等额本金']
    },
    periodChange: function(e) {
        this.setData({
            periodIndex: e.detail.value | 0
        });
    },
    typeChange: function(e) {
        this.setData({
            typeIndex: e.detail.value | 0
        });
    }
});
