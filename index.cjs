const Application = require('@waline/vercel');

module.exports = Application({
  plugins: [],
  async postSave(comment) {
    // do what ever you want after comment saved
  },


// 用于生成邮箱的 MD5 哈希值的函数
function generateMD5(email) {
    return new Promise((resolve, reject) => {
        const crypto = require('crypto');  // 需要 Node.js 内置的 crypto 模块
        const hash = crypto.createHash('md5');
        hash.update(email);
        resolve(hash.digest('hex'));
    });
}

  /*
此方法或传入一个 comment 对象，你可以通过 comment.mail 获取邮箱。若返回值为 string 类型，则会直接调用返回值作为头像地址，否则正常生成 MD5。
*/
async avatarUrl(comment) {
    const reg = new RegExp('(\\d+)@qq\\.com$', 'i');
    const mail = comment.mail;

    // 匹配 QQ 邮箱
    if (reg.test(mail)) {
      const q = mail.replace(/@qq\.com/i, '').toLowerCase();
      return 'https://q1.qlogo.cn/headimg_dl?dst_uin=' + q + '&spec=4';
    }

    // 匹配非 QQ 邮箱
    if (!reg.test(mail)) {
        // 生成邮箱的 MD5 哈希值
        const md5Hash = await generateMD5(mail.trim().toLowerCase());
        // 返回 Gravatar 头像链接
        return 'https://gravatar.loli.net/avatar/' + md5Hash;
    }
  },

});
