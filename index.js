const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },

    // 违禁词
  forbiddenWords: ['免费节点', '傻逼', '煞笔', '你妈', '尼玛'],
});
