/**
 * 楼盘表定位模块
 */
export default {
  data() {
    return {
      states: {
        locate: {
          key: 0, // 刷新key
          house: null // 定位房屋
        }
      }
    }
  },
  methods: {
    // 定位房屋
    setLocateHouse(params) {
      const house = this._query.queryHouseByUnitAndName(params)
      this.states.locate.key++
      this.states.locate.house = house
    },
    // 清除定位房屋
    clearLocateHouse() {
      this.states.locate.key++
      this.states.locateHouse = null
    }
  }
}
