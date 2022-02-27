// 192.168.8.100 - 192.168.8.1
// 192.9.201.30
module.exports = {
  productionSourceMap: false,
  runtimeCompiler: true,
  transpileDependencies: ["vuetify"],
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "منظومة معمل الانتقاء  والتوجيه حرس الحدود",
        appId: "com.military.records",
        mac: {
          category: "public.app-category.business",
          icon: "public/icon.ico"
        },
        win: {
          icon: "public/icon.ico",
          requestedExecutionLevel: "requireAdministrator", // highestAvailable
          target: [
            {
              target: "nsis",
              arch: ["x64", "ia32"] // "ia32" //
            }
          ],
          publisherName: "المقدم / أحمد شبانة"
        },
        extraFiles: ["booster", "printer", "quit-er/app.exe"],
        nsis: {
          // GUID Must be unique, I used some random text ( Should not be changed ever )
          guid: "ev54s65ds4-564jhk-hj956k5tr4-xc315v1zx-m54n64yt5",
          // allowToChangeInstallationDirectory: true,
          oneClick: true,
          perMachine: true,
          runAfterFinish: true,
          allowElevation: true
          // license: "public/Licence.html",
          // uninstallerIcon: "public/icons/uninstallerIcon.ico",
          // installerIcon: "public/icons/installerIcon.ico",
          // installerHeader: "public/icons/installerHeader.bmp",
          // installerHeaderIcon: "public/icons/installerHeaderIcon.ico",
          // installerSidebar: "public/icons/installerSidebar.bmp",
          // uninstallDisplayName: "${productName} ${version}",
          // artifactName: "${productName} Setup ${version}.${ext}"
        }
      }
    }
  },
  pwa: {
    workboxOptions: {
      skipWaiting: true
    }
  },
  devServer: {
    host: "localhost",
    liveReload: true
  },
  chainWebpack: config => {
    config.module
      .rule("pdf")
      .test(/\.pdf$/)
      .use("file-loader")
      .loader("file-loader");
    config.plugin("html").tap(args => {
      args[0].title = "منظومة معمل الانتقاء والتوجيه  حرس الحدود";
      args[0].version = require("./package.json").version;
      args[0].description = require("./package.json").description;
      args[0].isFullApp = true;
      return args;
    });
    config.module
      .rule("exe")
      .test(/\.exe$/)
      .use("file-loader")
      .loader("file-loader");
  }
};
