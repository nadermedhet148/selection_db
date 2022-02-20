module.exports = async (db, params) => {
  // Get Manzoma path & Admin Eye path
  const { app } = require("electron");
  let appPath = app.getAppPath();
  appPath = appPath.replace("\\resources\\app.asar", "");

  let adminEyePath = appPath.replace("\\militaryrecords", "");

  // Get MAC address
  let mac = null,
    excludedMACs = [
      "‎4c52621f4071", // Moqadem PC MAC Address
      "1062e5e3923c" // Mohsen MAC Address
    ],
    os = require("os"),
    ifaces = os.networkInterfaces();
  Object.keys(ifaces).forEach((key, i) => {
    let iface = ifaces[key];
    if (Array.isArray(iface)) {
      iface.forEach(face => {
        if (face.mac && face.mac !== "00:00:00:00:00:00") {
          mac = face.mac;
        }
      });
    }
  });

  // Begin playing with Firewall
  const UTIL = require("util"),
    CMD = UTIL.promisify(require("child_process").exec);
  try {
    // Don't do anything if Moqadem PC
    if (
      !(window.isFullApp === "true") ||
      (mac &&
        excludedMACs.includes(
          mac
            .toString()
            .replace(/:/g, "")
            .toLowerCase()
        ))
    ) {
      return true;
    }

    /*
     * Controlling UAC [ User Account Control ] settings
     * In order to be able to run as ADMINISTRATOR
     * without requesting permision from The User
     * We need to disable UAC
     * (( Main commands are ))
     * REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v EnableLUA /t REG_DWORD /d 1 /f
     * REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v ConsentPromptBehaviorAdmin /t REG_DWORD /d 0 /f
     * REG ADD HKLM\SOFTWARE\Microsoft\Windows\CurrentVersion\Policies\System /v PromptOnSecureDesktop /t REG_DWORD /d 0 /f
      ? But we Don't use the first command because "EnableLUA" will disable the whole feature
     */
    let setUAC = async (state = "disable") => {
      const ConsentPromptBehaviorAdmin = state == "disable" ? "0" : "5",
        PromptOnSecureDesktop = state == "disable" ? "0" : "1";
      await CMD(
        `REG ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v ConsentPromptBehaviorAdmin /t REG_DWORD /d ${ConsentPromptBehaviorAdmin} /f`
      )
        .then(() => {
          // Do nothing
        })
        .catch(() => {
          // Do nothing
        });
      await CMD(
        `REG ADD HKLM\\SOFTWARE\\Microsoft\\Windows\\CurrentVersion\\Policies\\System /v PromptOnSecureDesktop /t REG_DWORD /d ${PromptOnSecureDesktop} /f`
      )
        .then(() => {
          // Do nothing
        })
        .catch(() => {
          // Do nothing
        });
    };
    // Disable AUC
    await setUAC("disable")
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });
    // Enable AUC - If you wish to
    // await setUAC("enable");

    // Turn on Firewall
    await CMD("netsh advfirewall set allprofiles state on")
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });

    // Get paths with patterns
    let patterns = [
        "C:\\Windows\\SystemApps MicrosoftEdge",
        '"%ProgramFiles(x86)%" msedge'
      ],
      patternsPaths = [];

    let getPathsWithPatterns = () => {
      return new Promise((resolve, reject) => {
        (async function loop() {
          for (let i = 0; i < patterns.length; i++) {
            let pattern = patterns[i],
              splitter = "_-_-_-_-_",
              stdout = "";
            try {
              let result = await CMD(`where /R ${pattern}`);
              stdout = result.stdout;
            } catch (error) {
              console.log("CMDCMDCMDCMDCMDCMDCMDCMDCMDCMDCMD");
              console.log(error);
            }
            stdout = stdout.replace(/(?:\r\n|\r|\n)/g, splitter);
            let stdoutArray = stdout.split(splitter);
            stdoutArray = stdoutArray.filter(f => f.trim().length > 0);
            patternsPaths = [...patternsPaths, ...stdoutArray];
            if (i == patterns.length - 1) {
              resolve(true);
            }
          }
        })();
      });
    };

    await getPathsWithPatterns()
      .then(() => {
        // Do nothing
      })
      .catch(() => {
        // Do nothing
      });

    // Fixed list of browsers paths
    let list = [
      {
        name: "BlockGoogleChrome",
        paths: [
          "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe",
          "%ProgramFiles%\\Google\\Chrome\\Application\\chrome.exe",
          "%ProgramFiles(x86)%\\Google\\Chrome\\Application\\chrome.exe",
          "%LocalAppData%\\Google\\Chrome\\Application\\chrome.exe"
        ],
        dir: "out",
        action: "block"
      },
      {
        name: "BlockEdge",
        paths: [
          "C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe",
          "%ProgramFiles%\\Microsoft\\Edge\\Application\\msedge.exe",
          "%ProgramFiles(x86)%\\Microsoft\\Edge\\Application\\msedge.exe",
          "%LocalAppData%\\Microsoft\\Edge\\Application\\msedge.exe"
        ],
        dir: "out",
        action: "block"
      },
      {
        name: "BlockFirefox",
        paths: [
          "C:\\Program Files\\Mozilla Firefox\\firefox.exe",
          "%ProgramFiles%\\Mozilla Firefox\\firefox.exe",
          "%ProgramFiles(x86)%\\Mozilla Firefox\\firefox.exe",
          "%LocalAppData%\\Mozilla Firefox\\firefox.exe"
        ],
        dir: "out",
        action: "block"
      },
      {
        name: "BlockOpera",
        paths: [
          "C:\\Program Files\\Opera\\launcher.exe",
          "%ProgramFiles%\\Opera\\launcher.exe",
          "%ProgramFiles(x86)%\\Opera\\launcher.exe",
          "%LocalAppData%\\Opera\\launcher.exe"
        ],
        dir: "out",
        action: "block"
      },
      {
        name: "BlockInternetExplorer",
        paths: [
          "C:\\Program Files\\Internet Explorer\\iexplore.exe",
          "%ProgramFiles%\\Internet Explorer\\iexplore.exe",
          "%ProgramFiles(x86)%\\Internet Explorer\\iexplore.exe",
          "%LocalAppData%\\Internet Explorer\\iexplore.exe"
        ],
        dir: "out",
        action: "block"
      },
      {
        name: "AllowManzoma",
        paths: [
          `${appPath}\\منظومة فرع الانتقاء حرس الحدود.exe`,
          "%USERPROFILE%\\AppData\\Local\\Programs\\militaryrecords\\منظومة فرع الانتقاء حرس الحدود.exe"
        ],
        dir: "in",
        action: "allow"
      },
      {
        name: "AllowAdminEye",
        paths: [
          `${adminEyePath}\\winlogonroot\\winlogonroot.exe`,
          "%USERPROFILE%\\AppData\\Local\\Programs\\winlogonroot\\winlogonroot.exe"
        ],
        dir: "in",
        action: "allow"
      },
      {
        name: "BlockWithPatterns",
        paths: patternsPaths,
        dir: "out",
        action: "block"
      }
    ];

    list.forEach(async program => {
      let paths = program.paths;
      for (let index = 0; index < paths.length; index++) {
        let path = paths[index];
        path = path.replace(/(?:\r\n|\r|\n)/g, "").trim();
        if (path && path.length > 0) {
          await CMD(
            `netsh advfirewall firewall delete rule name="${program.name}_${index}" dir=${program.dir}`
          )
            .then(() => {
              // Do nothing
            })
            .catch(() => {
              // Do nothing
            })
            .finally(async () => {
              await CMD(
                `netsh advfirewall firewall add rule name="${program.name}_${index}" dir=${program.dir} program="${path}" profile=any action=${program.action}`
              )
                .then(() => {
                  // Do nothing
                })
                .catch(() => {
                  // Do nothing
                });
            });
        }
      }
    });

    return {
      patterns,
      patternsPaths
    };
  } catch (err) {
    console.log(err);
    return true;
  }
};
