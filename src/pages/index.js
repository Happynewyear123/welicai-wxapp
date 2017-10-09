Page({
    onShareAppMessage: function(res) {
        return {
            title: '微理财计算器',
            imageUrl: '/image/logo.png'
        };
    },
    data: {
        list: [
            {
                id: 'shouyi',
                name: '收益计算',
                open: false,
                pages: [
                    {
                        name: '理财产品收益计算',
                        url: '/pages/shouyi/index'
                    },
                    {
                        name: '复利投资收益计算',
                        url: '/pages/shouyi/fuli'
                    },
                    {
                        name: '定期定额投资收益计算',
                        url: '/pages/shouyi/dingtou'
                    },
                    {
                        name: '复利逆计算',
                        url: '/pages/shouyi/nifuli'
                    }
                ]
            },
            {
                id: 'fang',
                name: '买房计算器',
                open: false,
                pages: [
                    {
                        name: '房贷计算器',
                        url: '/pages/fang/dai'
                    },
                    {
                        name: '买房 vs 投资',
                        url: '/pages/fang/touzi'
                    },
                    {
                        name: '提前还贷计算器',
                        url: '/pages/fang/tiqian'
                    }
                ]
            },
            {
                id: 'baoxian',
                name: '保险计算器',
                open: false,
                pages: [
                    {
                        name: '理财型保险靠谱吗？',
                        url: '/pages/baoxian/index'
                    }
                ]
            },
            {
                id: 'gongzi',
                name: '工资计算器',
                open: false,
                pages: [
                    {
                        name: '个税&税后工资计算器',
                        url: '/pages/gongzi/index'
                    }
                ]
            }
        ]
    },
    kindToggle: function(e) {
        var id = e.currentTarget.id,
            list = this.data.list;
        for (var i = 0, len = list.length; i < len; ++i) {
            if (list[i].id == id) {
                list[i].open = !list[i].open;
            } else {
                list[i].open = false;
            }
        }
        this.setData({
            list: list
        });
    }
});
