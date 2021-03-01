module.exports = {

  runtimeCompiler: true,

  filenameHashing:true,
  devServer:{
    //proxy:{'/api':{}},代理器中设置/api,项目中请求路径为/api的替换为target
    // https: true,
    proxy:{
      'api/':{
        // target: 'https://php7.foodhwy.net/',//代理地址，这里设置的地址会代替axios中设置的baseURL
        target: 'https://sandbox.foodhwy.com',//代理地址，这里设置的地址会代替axios中设置的baseURL
        changeOrigin: true,// 如果接口跨域，需要进行这个参数配置
        ws: true,
        pathRewrite: {
          'api/': 'api/'
        }
      }
    }
  },

  pluginOptions: {
    electronBuilder: {
      chainWebpackRendererProcess(config) {
        config.plugins.delete('workbox')
        config.plugins.delete('pwa')
      }
    }
  }
}
