<template>
  <div tabindex="-1" class="no-focus" @click="focusOnInput()">
    <div class="command-line" v-show="false">
      <div class="container" style="background-color: #222">
        <div>
          Starting bot... please wait
        </div>
        <div v-if="connected">
          <div class="suc">
            Bot started successfully
          </div>
          <div>
            Connecting to storage device... please wait
          </div>
          <div v-if="afterLogin">
            <div v-if="loggedIn" class="suc">
              Connected Successfully
            </div>
            <div v-else class="err">
              <template v-for="(reason, i) in conFailReasons">
                <div :key="i">
                  <span v-if="i > 0">-{{ i }}- </span>
                  {{ reason }}
                </div>
              </template>
              <div>
                <div class="war">
                  If you believe everything is just fine, type 'reconnect' to
                  start over
                </div>
              </div>
            </div>
            <div id="pusher"></div>
            <div>
              >
              <input
                @keypress.enter="runCommand()"
                @keydown.up="commandUp()"
                @keydown.down="commandDown()"
                ref="commander"
                v-model="command"
                placeholder="type --help for available commands"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <div>
      <webview
        v-show="true"
        width="100%"
        style="height: 800px"
        ref="storageView"
        :src="loginUrl"
      ></webview>
    </div>
  </div>
</template>

<style lang="scss">
.command-line {
  direction: ltr;
  text-align: left;
  hr {
    margin: 2px 0px;
  }
  input {
    color: white;
    font-family: monospace;
    width: 90%;
    outline: none;
  }
  div {
    font-family: monospace;
    color: white;
    &.suc,
    &.war,
    &.err {
      display: inline;
      font-style: italic;
    }
  }
  .suc,
  .suc * {
    color: var(--v-success-base);
  }
  .err,
  .err * {
    color: var(--v-error-base);
  }
  .war,
  .war * {
    color: var(--v-warning-base);
  }
}
</style>

<script>
export default {
  name: "ControlStorage",
  data: () => ({
    connected: false,
    loggedIn: false,
    afterLogin: false,
    command: "",
    url: "http://px12-450r-2/",
    loginUrl: "http://px12-450r-2/manage/login.html",
    history: [],
    commands: {
      reconnect: "Try to connect to storage device again if failed.",
      shutdown: "Shutdown the storage device",
      restart: "Restart the storage device",
      "blink-light": "Blinking the front lights of storage device",
      clear: "Clear console log"
    },
    conFailReasons: [
      "Failed to connect because of one (or more) of these reasons",
      "You are offline or not connected to local network",
      "Your network configuration is not correct, Can you see any other devices in Network sharing center?",
      "Storage device is shutdown",
      "The switch in 7aseb room is turned off",
      "The switch in archive room is turned off (if you are connecting from there)"
    ]
  }),
  mounted() {
    this.connectStorage();
  },
  methods: {
    focusOnInput() {
      setTimeout(() => {
        const commander = this.$refs.commander;
        if (commander && document.activeElement !== commander) {
          commander.focus();
        }
      }, 100);
    },
    connectStorage() {
      const storage = this.$refs.storageView;
      let that = this;
      storage.addEventListener("did-stop-loading", async () => {
        that.$set(that, "connected", true);
        setTimeout(async () => {
          storage
            .executeJavaScript(
              `
            if (!document.getElementById('restartBtn')) {
              document.getElementById('mnglogin').value = 'admin';
              document.getElementById('mngpwd').value = 'admin';
              document.getElementById('btnSubmit').removeAttribute('disabled');
              document.getElementById('btnSubmit').click();
            }
            `
            )
            .then(() => {
              setTimeout(() => {
                that.$set(that, "afterLogin", true);
                that.$set(that, "loggedIn", true);
                that.focusOnInput();
              }, 1500);
            })
            .catch(() => {
              that.$set(that, "afterLogin", true);
              that.focusOnInput();
              // setTimeout(() => {
              //   that.commandPush(
              //     "Failed to connect. Maybe storage device is shutdown",
              //     "err"
              //   );
              // }, 500);
            })
            .finally(() => {});
        }, 1500);
      });
    },
    reconnectStorage() {
      this.$set(this, "connected", false);
      this.$set(this, "loggedIn", false);
      this.$set(this, "afterLogin", false);
      this.clearConsole();
      this.$refs.storageView.reload();
      setTimeout(() => {
        this.connectStorage();
      }, 100);
    },
    // async listenToRestart() {
    //   const storage = this.$refs.storageView;
    //   setTimeout(async () => {
    //     let loded = await storage.loadUrl(this.loginUrl);
    //     if (l) {
    //       clearInterval(intval);
    //     }
    //   }, 1000);
    // },
    commandPush(command, divClass) {
      let pusher = document.getElementById("pusher"),
        outerDiv = document.createElement("div"),
        div = document.createElement("div");
      div.style.fontFamily = "monospace";
      div.classList.add(divClass);
      div.innerHTML = `${divClass ? "" : "> "}${command}`;
      outerDiv.appendChild(div);
      pusher.appendChild(outerDiv);
    },
    async runCommand() {
      const storage = this.$refs.storageView;
      let that = this,
        loggedIn = this.loggedIn,
        cmd = this.command;
      this.commandPush(cmd);
      if (!this.history.includes(cmd)) {
        this.$set(this.history, this.history.length, cmd);
      }
      this.$set(this, "command", "");
      switch (cmd) {
        case "--help":
        case "help":
          let commands = this.commands,
            divs = [];
          Object.keys(commands).forEach((command, i) => {
            let desc = commands[command];
            divs.push(`<div>${command} <div class="war">${desc}</div> </div>`);
          });
          this.commandPush(
            `<div>
              Available commands
            </div>
            <div><hr /></div>
            ${divs.join("")}
            <div><hr /></div>
            `,
            "x"
          );
          break;
        case "reconnect":
          this.reconnectStorage();
          break;
        case "restart":
          this.commandPush("Requesting restart... please wait", "x");
          if (!loggedIn) {
            this.commandPush(
              "Storage device is not connected, Try to restart your connection",
              "err"
            );
            return;
          }
          await storage.executeJavaScript(
            `
            if (document.getElementById('restartBtn')) {
              document.getElementById('restartBtn').click();
            }
            `
          );
          setTimeout(async () => {
            await storage.executeJavaScript(
              `
              document.querySelector('div[aria-describedby="restartConfirmation"]').children[2].children[0].children[0].click()`
            );
            this.commandPush("Accepted", "suc");
            this.commandPush("Restarting...", "x");
            setTimeout(async () => {
              // commandPush(
              //   "Device is now shutdown, Once it starts i will tell you.",
              //   "suc"
              // );
              this.commandPush(
                "Device is now shutdown, It will start soon.",
                "suc"
              );
              // that.listenToRestart();
            }, 5000);
          }, 1000);
          break;
        case "shutdown":
          this.commandPush("Requesting shutdown... please wait", "x");
          if (!loggedIn) {
            this.commandPush(
              "Storage device is not connected, Try to restart your connection",
              "err"
            );
            return;
          }
          await storage.executeJavaScript(
            `
            if (document.getElementById('shutdownBtn')) {
              document.getElementById('shutdownBtn').click();
            }
            `
          );
          setTimeout(async () => {
            await storage.executeJavaScript(
              `
              document.querySelector('div[aria-describedby="shutdownConfirmation"]').children[2].children[0].children[0].click()`
            );
            this.commandPush("Accepted", "suc");
            this.commandPush("Shuting down...", "x");
            setTimeout(async () => {
              this.commandPush("Device is now shutdown.", "suc");
            }, 5000);
          }, 1000);
          break;
        case "blink-light":
          this.commandPush("Requesting light permission... please wait", "x");
          if (!loggedIn) {
            this.commandPush(
              "Storage device is not connected, Try to restart your connection",
              "err"
            );
            return;
          }
          await storage.executeJavaScript(
            `
            if (document.getElementById('blinkBtn')) {
              document.getElementById('blinkBtn').click();
            }
            `
          );
          setTimeout(async () => {
            this.commandPush("Accepted", "suc");
            this.commandPush("Light has been blinked successfully", "suc");
          }, 500);
          break;
        case "clear":
          this.clearConsole();
          break;
        default:
          this.commandPush(
            `Unknown command '${cmd}', Type --help to show available commands.`,
            "err"
          );
          break;
      }
    },
    clearConsole() {
      let pusher = document.getElementById("pusher");
      pusher.innerHTML = "";
    },
    commandUp() {
      // console.log(this.history);
      if (this.history.length > 0) {
        let cmd = this.command,
          index = this.history.indexOf(cmd),
          upCommand = this.history[index + 1];
        this.$set(this, "command", upCommand ? upCommand : "");
      }
    },
    commandDown() {
      // console.log(this.history);
      if (this.history.length > 0) {
        let cmd = this.command,
          index = this.history.indexOf(cmd),
          upCommand = this.history[index - 1];
        this.$set(this, "command", upCommand ? upCommand : "");
      }
    }
  }
};
</script>
