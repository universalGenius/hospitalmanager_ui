// (function (window, $, undefined) {
  var accessid = '',
    accesskey = '',
    host = '',
    policyBase64 = '',
    signature = '',
    callbackbody = '',
    filename = '',
    suffix = '',
    key = '',
    expire = 0,
    g_object_name = '',
    g_object_name_type = '',
    now = timestamp = Date.parse(new Date()) / 1000;

  /**
   * @desc 发送 get请求获取服务端签名
   */
  function send_request() {
    return $.ajax({
      type: 'GET',
      url: 'https://oss.ilashou.com/oss/authorization?name=mjs',
      dataType: 'json',
      async: false

    }).responseJSON;
  }

  function random_string(len) {
    len = len || 32;
    var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789javascript9876543210abcdefghijklmnopqrstuvwxyz0986';
    var maxPos = chars.length;
    var pwd = '';
    for (var i = 0; i < len; i++) {
      // ~~ ===> Math.floor
      pwd += chars.charAt(~~(Math.random() * maxPos));
    }
    return pwd;
  }


  /**
   * @desc get 服务端签名
   */
  function get_signature() {
    //可以判断当前expire是否超过了当前时间,如果超过了当前时间,就重新取一下.3s 做为缓冲
    now = timestamp = Date.parse(new Date()) / 1000;

    if (expire < now + 3) {
      var body = send_request();
      if (body.code === 1200) {
        var obj = JSON.parse(body.data);
        console.log(obj);

        host = obj['host'];
        policyBase64 = obj['policy'];
        accessid = obj['accessid'];
        signature = obj['signature'];
        expire = parseInt(obj['expire']);
        callbackbody = obj['callback'];
        key = obj['dir'];
        return true;
      }
    }

    return false;
  }

  function get_suffix(filename, clearDot) {
    var pos = filename.lastIndexOf('.');
    suffix = '';
    if (pos !== -1) {
      suffix = filename.substring(clearDot ? pos + 1 : pos);
    }
    return suffix;
  }

  function getAccept(type, disableGif) {
    return type === 'videos'
      ? 'mpg,m4v,mp4,flv,3gp,mov,avi,rmvb,mkv,wmv'
      : '.jpg,.jpeg,.png,.bmp,.webp' + (disableGif ? '' : ',.gif');
  }

  /**
   *
   * @param {*} button
   * @param {*} options
   */
  function OssWebUploads(button, options) {
    // 初始化一下参数
    this.__init(button, options);

    var self = this;
    this.uploader = new Q.Uploader({
      url: 'http://oss.aliyuncs.com',
      target: button,
      upName: 'file',
      container: self.container,
      dataType: 'xml',
      allows: self.accept,
      multiple: self.multiple,
      html5: true,
      on: {
        // 添加之前触发
        add: function (task) {
          if (task.disabled) {
            return $.alertModal('error', {
              text: '允许上传的文件格式为：' + accept.replace(/,/g, ', ')
            });
          }

          // loading
          self.loadingHandler();
          self.set_upload_param('', false);
        },
        upload: function (task) {
          self.set_upload_param(task.name, true);
        },
        complete: function (task) {
          if (task.xhr.status === 200 && task.response !== undefined) {
            self.render(host +'/'+ g_object_name);
          }else {
            console.log('error', task);
          }
        }
      }
    });
  }

  OssWebUploads.prototype = {
    constructor: OssWebUploads,

    __init: function (selectButton, options) {
      this.options = options || {};

      this.container = options.container || selectButton.parentNode;
      this.$view = self.$view || $(this.container);
      this.$loading = options.loading || $('<p class="upload-loading"></p>');

      // uploader
      var disableGif = true;

      if (options.disableGif != null) {
        disableGif = options.disableGif;
      }

      this.accept = options.accept || getAccept(options.type, disableGif);
      this.folder = options.type === 'videos' ? 'web-test-videos/' : 'web-test-images/'
      this.multiple = options.multiple;

      // ossClip
      this.ossClip = options.clips || '';

      if (!this.ossClip) {
        var w = options.clipWidth || this.container.offsetWidth;
        var h = options.clipHeight || this.container.offsetHeight;
        this.ossClip = '?x-oss-process=image/format,png/resize,m_pad,w_'+ w +',h_'+ h +',color_f5f5f5';
      }

      this.closeHandler();
    },

    calculate_object_name: function (filename) {
      var object_name = this.folder + random_string(15) + (new Date() * 1);
      g_object_name = key + object_name + get_suffix(filename);
      return '';
    },

    set_upload_param: function (filename, ret) {
      if (ret === false) {
        ret = get_signature();
      }

      g_object_name = key;
      if (filename !== '') {
        suffix = get_suffix(filename);
        this.calculate_object_name(filename);
      }

      var data = {
        'Filename': g_object_name,
        'key': g_object_name,
        'policy': policyBase64,
        'OSSAccessKeyId': accessid,
        'success_action_status': '200', //让服务端返回200,不然，默认会返回204
        'callback': callbackbody,
        'signature': signature,
      };

      this.uploader.set({
        'url': host,
        'data': data,
      });
    },

    render: function (src) {
      var self = this;

      if (src.lastIndexOf('.gif') === -1) {
        // 不是gif 裁剪
        src = src + self.ossClip;
      }

      // 加载...
      var img = new Image();
      img.onload = img.onerror = img.onabort = function () {
        _renderHandler(this.src);
        img = null;
      };
      img.src = src;

      function _renderHandler(src) {
        var $uploadView = self.$view.find('.upload-image');

        if ($uploadView.length) {
          $uploadView.attr('src', src);
        }else {
          var html = '<div class="upload-view"><span class="upload-close"></span><div class="upload-mask"><p></p></div>';
          html += '<img class="upload-image" src="'+ src +'" alt=""></div>'; // img
          self.$view.append(html);
        }

        self.loadingHandler(true);
        self.setValue(src);
      }
    },

    loadingHandler: function (remove) {
      remove ? this.$view.find('.upload-loading').remove() : this.$view.append(this.$loading);
    },

    closeHandler: function () {
      var self = this;
      self.$view.on('click', '.upload-close', function () {
        self.$view.find('.upload-view').remove();
        self.setIconfont(true);
        self.setValue('');
        return false;
      });
    },

    setIconfont: function (fn) {
      this.$view.find('.iconfont').toggleClass('hide', fn);
    },

    // 设置隐藏的 input值
    setValue: function (value) {
      var $value = this.$view.find('[data-upload="upload_data"]');
      value = value.split('?')[0];
      $value.val(value);

      this.setIconfont();

      if ($value.parents('.form-group').find('.help-block.has-error').length) {
        $value.valid();
      }
    }
  };

  // 头像，logo上传
  $('.single-upload').each(function () {
    var ossUp = new OssWebUploads(this, {

    });
  });
// }(window, jQuery));
