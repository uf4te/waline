const Application = require('@waline/vercel');
const crypto = require('crypto'); // 将 crypto 模块放在最顶部
const LinkInterceptor = require('waline-link-interceptor'); // 跳转中间页

// 用于生成邮箱的 MD5 哈希值的函数
function generateMD5(email) {
    return new Promise((resolve, reject) => {
        const hash = crypto.createHash('md5');
        hash.update(email);
        resolve(hash.digest('hex'));
    });
}

module.exports = Application({
  plugins: [
      LinkInterceptor({
      whiteList: [
        'uf4te.cn'
      ],
      // blackList: [],
      // interceptorTemplate: `hello __URL__ `,   // 如果下面自定义了跳转地址，那么此处模板不生效
      redirectUrl: "https://www.uf4te.cn/go.html", // 填写中间页的具体 html 地址。
      encodeFunc: (url) => {
          return "target=" + Buffer.from(url).toString('base64'); // 填入一个外链 url 的 base64
      }
    })
  ],


  async postSave(comment) {
    // do what ever you want after comment saved
  },

  /*
  此方法会传入一个 comment 对象，你可以通过 comment.mail 获取邮箱。若返回值为 string 类型，则会直接调用返回值作为头像地址，否则正常生成 MD5。
  */
  async avatarUrl(comment) {
    const mail = comment.mail;

    // 检查是否填写邮箱，若未填写，则不处理头像
    if (!mail || mail.trim() === '') {
      return null;  // 未填写邮箱，返回 null
    }
    
    const reg = new RegExp('(\\d+)@qq\\.com$', 'i');

    // 匹配 QQ 邮箱
    if (reg.test(mail)) {
      const q = mail.replace(/@qq\.com/i, '').toLowerCase();
      return 'https://q1.qlogo.cn/headimg_dl?dst_uin=' + q + '&spec=4';
    }

    // 匹配非 QQ 邮箱
    else {
      // 生成邮箱的 MD5 哈希值
      const md5Hash = await generateMD5(mail.trim().toLowerCase());
      // 返回 Gravatar 头像链接
      // return 'https://gravatar.loli.net/avatar/' + md5Hash;
      return 'https://cn.cravatar.com/avatar/' + md5Hash;
    }
  },

});
