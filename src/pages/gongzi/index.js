const wxCharts = require('../../utils/wxcharts.js');
let windowWidth = 320;
try {
    let res = wx.getSystemInfoSync();
    windowWidth = res.windowWidth;
} catch (e) {
    console.error('getSystemInfoSync failed!');
}

const cityMap = {
    beijing: '北京',
    shanghai: '上海',
    guangzhou: '广州',
    shenzhen: '深圳',
    nanjing: '南京',
    hangzhou: '杭州',
    wuhan: '武汉',
    chongqing: '重庆',
    xi_an: '西安',
    tianjin: '天津',
    ji_nan: '济南',
    shenyang: '沈阳',
    nanchang: '南昌',
    suzhou: '苏州',
    chengdu: '成都',
    fuzhou: '福州',
    xiamen: '厦门',
    changsha: '长沙',
    zhengzhou: '郑州',
    hefei: '合肥',
    changchun: '长春',
    haerbin: '哈尔滨',
    kunming: '昆明',
    qingdao: '青岛',
    taiyuan: '太原',
    yinchuan: '银川',
    nanning: '南宁',
    guiyang: '贵阳',
    haikou: '海口',
    shijiazhuang: '石家庄',
    huhehaote: '呼和浩特',
    wulumuqi: '乌鲁木齐',
    xi_ning: '西宁',
    lanzhou: '兰州',
    zhuhai: '珠海'
};
const citys = [];
const cityPys = [];
for (let i in cityMap) {
    citys.push(cityMap[i]);
    cityPys.push(i);
}
Page({
    onShareAppMessage: function(res) {
        return {
            title: '工资个税计算器：到手工资怎么这么少，工资都哪里去了。。',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        // 数据
        canvasWidth: windowWidth,
        hidden: true,
        result: {},
        salary: 10000,
        sb: 10000,
        tsb: 10000,
        gjj: 10000,
        tgjj: 10000,
        gjjSwitch: true,
        curCity: 'beijing',
        cityIndex: 0,
        citys: citys
    },
    inputSalary: function(e) {
        const val = parseFloat(e.detail.value);
        this.setData({
            sb: val,
            gjj: val,
            tsb: val,
            tgjj: val,
            salary: val
        });
    },
    inputSb: function(e) {
        const val = parseFloat(e.detail.value);
        this.setData({
            sb: val
        });
    },
    inputGjj: function(e) {
        const val = parseFloat(e.detail.value);
        this.setData({
            gjj: val
        });
    },
    doit: function() {
        wx.showLoading({
            title: '加载中...'
        });
        const data = this.data;
        const url = 'https://salarycalculator.sinaapp.com/calculate';
        const self = this;
        wx.request({
            url: url,
            data: {
                city: data.curCity,
                origin_salary: data.salary,
                base_gjj: data.gjj,
                is_gjj: data.gjjSwitch,
                base_3j: data.sb,
                is_exgjj: false,
                factor_exgjj: 0.08
            },
            complete: function() {
                wx.hideLoading();
            },
            fail: function() {
                wx.showToast({
                    title: '请求失败，请稍后再试',
                    image: '../../image/warn.png'
                });
            },
            success: function(res) {
                const data = res.data;
                self.setData({
                    hidden: false,
                    result: data
                });
                // 画饼图
                const series = [];
                [
                    {
                        name: '养老',
                        value: 'personal_yanglao'
                    },
                    {
                        name: '失业',
                        value: 'personal_shiye'
                    },
                    {
                        name: '生育',
                        value: 'personal_shengyu'
                    },
                    {
                        name: '医疗',
                        value: 'personal_yiliao'
                    },
                    {
                        name: '工伤',
                        value: 'personal_gongshang'
                    },
                    {
                        name: '所得税',
                        value: 'tax'
                    },
                    {
                        name: '公积金',
                        value: 'personal_gjj'
                    },
                    {
                        name: '税后工资',
                        value: 'final_salary'
                    }
                ].forEach(function(v) {
                    let val = parseFloat(data[v.value]);
                    if (isNaN(val)) {
                        val = 0;
                    }
                    series.push({
                        name: v.name,
                        data: val
                    });
                });

                new wxCharts({
                    animation: true,
                    canvasId: 'pieCanvas',
                    type: 'pie',
                    series: series,
                    width: windowWidth,
                    height: 300,
                    dataLabel: true
                });
            }
        });
    },
    switchChange: function(e) {
        this.setData({
            gjjSwitch: e.detail.value
        });
    },
    cityPicker: function(e) {
        const index = e.detail.value | 0;
        this.setData({
            cityIndex: index,
            curCity: cityPys[index]
        });
    }
});
