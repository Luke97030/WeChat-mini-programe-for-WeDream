// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
      tabs: {
        type: Array,
        value: []
      }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * event handle
   */
  methods: {
    // 点击事件
    handleTabItemTap(e)
    {
        // 1. 获取点击的索引
        const index = e.currentTarget.dataset.index;
        //console.log(index);

        // 2. 触发父组件中的自定义事件
        this.triggerEvent("tabsItemChange", index);
    }
  }
})
