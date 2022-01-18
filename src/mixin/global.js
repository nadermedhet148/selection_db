import Vue from "vue";
Vue.mixin({
  filters: {
    fileSize(bytes = 0) {
      let kb = bytes / 1024,
        mega = kb / 1024,
        giga = mega / 1024,
        returner = "";
      if (giga > 1) {
        returner = giga.toFixed(2) + "GB";
      } else if (mega > 1) {
        returner = mega.toFixed(2) + "MB";
      } else if (kb > 1) {
        returner = kb.toFixed(2) + "KB";
      }
      return returner;
    }
  },
  methods: {
    isEmptyObj(obj) {
      for (const key in obj) {
        if (Object.hasOwnProperty.call(obj, key)) return false;
      }
      return true;
    },
    focusEl(ref) {
      this.$nextTick(() => {
        const FieldRefs = this.$refs[ref];
        const Field =
          Array.isArray(FieldRefs) && FieldRefs.length
            ? FieldRefs[0]
            : FieldRefs;
        if (Field.$el) {
          setTimeout(() => {
            Field.focus();
          }, 0);
        }
      });
    },
    isHodod(obj) {
      let identifier = obj.militaryId.slice(6, 8);
      let isHodod =
        ["52", "18", "04", "66", "77", "88"].includes(identifier) &&
        (obj.forceId == 52 || obj.forceId == null);
      return isHodod;
    },
    fetchUnseenMsgs() {
      this.api("global/count", {
        table: "messengerChats",
        where: {
          $or: [
            {
              seen: false
            },
            {
              seen: {
                $is: null
              }
            }
          ],
          sender: {
            $not: this.$store.state.currentUser.userId
          },
          $or: [
            {
              user1: this.$store.state.currentUser.userId
            },
            {
              user2: this.$store.state.currentUser.userId
            }
          ]
        }
      })
        .then(x => {
          console.log(x);
          this.$set(
            this.$store.state.notifications,
            "unSeenMsgsCounter",
            x.data
          );
        })
        .catch(error => {
          console.log(error);
        });
    },
    pushNotification({
      title = "",
      body = "",
      icon = require("@/assets/logo.png"),
      onclick = () => {},
      onerror = () => {},
      onclose = () => {},
      onshow = () => {}
    }) {
      let notification = new Notification(title, {
        dir: "rtl",
        lang: "AR",
        icon,
        requireInteraction: true,
        body
      });
      notification.onclick = onclick;
      notification.onerror = onerror;
      notification.onclose = onclose;
      notification.onshow = onshow;
    },
    async addModification(militaryId = "", changeTypeId = 1, formId = 1) {
      if (!militaryId) {
        console.log("Add Modification Rejected");
        return;
      }
      let changeTypes = ["اضافة", "تعديل", "حذف"],
        forms = [
          // 1
          "الصفحة الشخصية للمنتهى خدمتهم",
          // 2 -- no
          "استلام الكارت 2س بقسم الهروب",
          // 3
          "تسجيل عقوبة",
          // 4
          "بيانات الهروب",
          // 5
          "الحالات الاصابية والمرضية",
          // 6
          "محو الاميه",
          // 7
          "تحرك النموذج (25س)",
          // 8
          "تسجيل العقوبات ومدد الفقد",
          // 9
          "البيانات الاساسية",
          // 10
          "شاشة تسجيل الشهداء",
          // 11
          "خطابات انهاء الخدمة",
          // 12
          "شاشة إنشاء كشوف الميكروفيلم",
          // 13
          "مراجعة طبعة السجلات",
          // 14
          "تجهيز بيانات دفعة النقل على الاحتياط",
          // 15
          "مراجعة الطبعة مع الوحدات",
          // 16
          "تحرك النموذج (1س) الاصل",
          // 17
          "S25ReceptionSearch",
          // 18
          "",
          // 19
          "",
          // 20
          "نقل مجمع الكارت (  2 س )",
          // 21
          "اشارات انهاء الخدمة",
          // 22
          "طباعة خطاب الواجب المدرب عليه",
          // 23
          "تحقيقات ومحاكم",
          // 24
          "حوادث ودوريات",
          // 25
          "سجل الشطب والملاحظات",
          // 26
          "كشف الأربعين",
          // 27
          "المجلس الطبي",
          // 28
          "بيانات الهروب",
          // 29
          "بيانات الهارب الأساسية"
        ];
      let date = new Date(),
        modifiedBy = this.$store.state.currentUser.username,
        form = forms[formId - 1],
        changeType = changeTypes[changeTypeId - 1],
        conscripte = await this.api("global/get_one", {
          table: "conscriptes",
          where: {
            militaryId
          },
          attrs: ["fullName", "typeId"],
          include: [
            {
              model: "units"
            },
            {
              model: "dutyStates"
            }
          ]
        }),
        c = conscripte.data,
        fullName = c ? c.fullName : "",
        unit = c && c.unit ? c.unit.unitText : "",
        state = c && c.dutyState ? c.dutyState.text : "",
        personTypeId = c.typeId == 1 ? 0 : 1,
        card2SPlace = 0,
        section = this.$store.state.currentUser.section;
      console.log("Run Function");
      this.api("global/create_one", {
        table: "modifications",
        where: {
          date,
          militaryId,
          fullName,
          unit,
          state,
          changeType,
          form,
          modifiedBy,
          isVerified: false,
          delete: false,
          isConfirmed: false,
          personTypeId,
          card2SPlace,
          section
        }
      })
        .then(x => {
          // Done
        })
        .catch(error => {
          console.log("تعذر حفظ المراجعة للعملية");
          console.log(error);
        });
    },
    countDays(from, to, plusOne = false) {
      return (
        Math.ceil((new Date(to) - new Date(from)) / 1000 / 60 / 60 / 24) +
        (plusOne ? 1 : 0)
      );
    },
    async updateAppProp(property = "") {
      if (property && this.$store.state.appProps[property]) {
        let value = this.$store.state.appProps[property].value;
        this.api("global/update_one", {
          table: "appProps",
          where: {
            property
          },
          update: {
            value
          }
        })
          .then(x => {
            console.log("AppProp Updated");
          })
          .catch(error => {
            console.log(`Error Updating AppProp ${property}`);
            console.log(error);
          });
      }
    },
    getNearestDay(d = new Date()) {
      return new Date(d).toISOString().substring(0, 10);
      let date = new Date(d),
        hours = date.getHours(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        newDate = new Date(`${year}-${month}-${day}`),
        newHours = newDate.getHours();
      return hours >= 12 || (hours == 0 && `${day}`.length == 1)
        ? new Date(new Date(newDate).setDate(new Date(newDate).getDate() + 1))
            .toISOString()
            .substring(0, 10)
        : new Date(newDate).toISOString().substring(0, 10);
    },
    checkFileExists(url) {
      let that = this;
      return new Promise((success, failure) => {
        that.axios
          .get(url)
          .then(() => {
            success(true);
          })
          .catch(() => {
            success(false);
          });
      });
    },
    async pushDownload(link, filename) {
      let isExists = await this.checkFileExists(link);
      if (!isExists) {
        this.showError("تم حذف هذا الملف من السيرفر");
        return;
      }
      let a = document.createElement("a");
      a.setAttribute("href", link);
      a.setAttribute("download", filename);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    },
    getSockets() {
      let currentUser = this.$store.state.currentUser
          ? { ...this.$store.state.currentUser }
          : null,
        userId = currentUser && currentUser.userId ? currentUser.userId : null;
      this.$socket.client.emit("getSockets", userId);
      if (currentUser) {
        delete currentUser.password;
        this.$socket.client.emit("setSocketMeta", currentUser);
      }
    },
    isAdmin() {
      let section = this.$store.state.currentUser.section;
      return [0, 12].includes(section);
    },
    // TODO: speerate them.
    isTasgilOrEnhaa() {
      let section = this.$store.state.currentUser.section;
      return [1, 3].includes(section);
    },
    isGate() {
      let section = this.$store.state.currentUser.section;
      return section == "6";
    },
    openDbProcs(procedureType = 0, situationType = 0, situationId = 0) {
      this.$set(this.$store.state.dbprocs, "procedureType", procedureType);
      this.$set(this.$store.state.dbprocs, "situationType", situationType);
      this.$set(this.$store.state.dbprocs, "situationId", situationId);
      this.$set(this.$store.state.dbprocs, "model", true);
    },
    periodToDate(period, addDay = true, inDays = false) {
      if (!period) {
        return {
          year: 0,
          month: 0,
          day: 0
        };
      }
      // 8640000000
      period = period / (inDays ? 1 : 86400000) + (addDay ? 1 : 0); // Period in days
      let years = Math.floor(Number(period) / (12 * 30)),
        months = Math.floor((Number(period) - years * (12 * 30)) / 30),
        days = Number(period) - years * (12 * 30) - months * 30;
      return {
        year: Math.round(years),
        month: Math.round(months),
        day: Math.round(days)
      };
    },
    // deleteRoute(index) {
    //   let length = this.$store.state.routes.length;
    //   if (length > 1) {
    //     this.$set(this.$store.state, "current_route", index == 0 ? 1 : 0);
    //   }
    //   let intValParent = setInterval(() => {
    //     this.$store.state.routes.splice(index, 1);
    //     if (this.$store.state.routes && this.$store.state.routes.length == 0) {
    //       let intVal = setInterval(() => {
    //         let goto = this.$route.fullPath == "/" ? "/no_tab_error" : "/";
    //         this.$router.push(goto);
    //         clearInterval(intVal);
    //       }, 10);
    //     }
    //     clearInterval(intValParent);
    //   }, 500);
    // },
    focusOnRoot() {
      let intval = setInterval(() => {
        if (this.$refs.root_div) {
          this.$refs.root_div.focus();
        }
        clearInterval(intval);
      }, 500);
    },
    deleteCurrentRoute() {
      let index = this.$store.state.current_route;
      // this.$store.state.routes.splice(index, 1);
      this.$store.commit("hideRoute", index);
      if (
        this.$store.state.routes &&
        this.$store.state.routes.filter(r => !r.isHidden).length == 0
      ) {
        let intVal = setInterval(() => {
          let goto = this.$route.fullPath == "/" ? "/no_tab_error" : "/";
          this.$router.push(goto);
          this.focusOnRoot();
          clearInterval(intVal);
        }, 10);
      } else {
        this.fixRoutePath();
      }
    },
    deleteRoute(index) {
      // this.$store.state.routes.splice(index, 1);
      this.$store.commit("hideRoute", index);
      if (
        this.$store.state.routes &&
        this.$store.state.routes.filter(r => !r.isHidden).length == 0
        // this.$store.state.routes.length == 0
      ) {
        let intVal = setInterval(() => {
          let goto = this.$route.fullPath == "/" ? "/no_tab_error" : "/";
          this.$router.push(goto);
          this.focusOnRoot();
          clearInterval(intVal);
        }, 10);
      } else {
        this.fixRoutePath();
      }
    },
    deleteRouteByName(name) {
      let index = this.$store.state.routes.findIndex(f => f.name == name);
      if (index > -1) {
        // this.$store.state.routes.splice(index, 1);
        this.$store.commit("hideRoute", index);
        if (
          this.$store.state.routes &&
          this.$store.state.routes.filter(r => !r.isHidden).length == 0
        ) {
          let intVal = setInterval(() => {
            let goto = this.$route.fullPath == "/" ? "/no_tab_error" : "/";
            this.$router.push(goto);
            this.focusOnRoot();
            clearInterval(intVal);
          }, 10);
        } else {
          this.fixRoutePath();
        }
      }
    },
    fixRoutePath() {
      let intval = setInterval(() => {
        let index = this.$store.state.current_route,
          route = this.$store.state.routes[index],
          isHidden = route.isHidden,
          fullPath = this.$route.fullPath;
        // console.log("fullPath", fullPath);
        // console.log("route.fullPath", route.fullPath);
        // console.log("isHidden");
        // console.log(isHidden);
        if (isHidden) {
          // ? This condition will never happen
          let intval2 = setInterval(() => {
            let anyRouteVisible = this.$store.state.routes.filter(
              f => !f.isHidden
            )[0];
            this.$router.push(anyRouteVisible.fullPath);
            clearInterval(intval2);
          }, 100);
        } else {
          if (fullPath !== route.fullPath) {
            this.$router.push(route.fullPath);
          }
        }
        clearInterval(intval);
      }, 100);
    },
    consoleLog(x) {
      console.log(x);
    },
    slideRouteForward() {
      let index = this.$store.state.current_route,
        length = this.$store.state.routes.length,
        nextIndex = 0;
      if (length > 1) {
        if (index < length - 1) {
          nextIndex = index + 1;
          if (index == 0) {
            nextIndex = 1;
          }
        }
        this.$set(this.$store.state, "current_route", nextIndex);
        this.focusOnRoot();
      }
    },
    slideRouteBackward() {
      let index = this.$store.state.current_route,
        length = this.$store.state.routes.length,
        nextIndex = 0;
      if (length > 1) {
        if (index < length) {
          nextIndex = index - 1;
          if (index == 0) {
            nextIndex = length - 1;
          }
        }
        this.$set(this.$store.state, "current_route", nextIndex);
        this.focusOnRoot();
      }
    },
    lightbox(imgs = [], value = null) {
      imgs = [...new Set(imgs)];
      imgs = imgs.filter(i => i);
      this.$set(
        this.$store.state.lightbox,
        "imgs",
        !Array.isArray(imgs) || imgs.length == 0 ? [] : [...imgs]
      );
      this.$set(this.$store.state.lightbox, "value", value);
      this.$set(this.$store.state.lightbox, "model", true);
    },
    base64ToImg(base64 = "") {
      if (base64 && base64.length > 0) {
        return `data:image/jpeg;base64,${base64}`;
      }
      return null;
    },
    isCurrentRoute(name) {
      let index = this.$store.state.current_route;
      return this.$store.state.routes[index].name == name;
    },
    setRouterTitle(title = "", route = "") {
      let index = !route
        ? this.$store.state.current_route
        : this.$store.state.routes.findIndex(r => r.name == route);
      if (index > -1) {
        this.$set(this.$store.state.routes[index].meta, "title", title);
      }
      return;
    },
      cleanObject(obj) {
            for (var prop in obj) {
                if (obj[prop] === null || obj[prop] === undefined) {
                    delete obj[prop];
                }
            }
            return Object.keys(obj).length > 0 ? obj : null;
      },
    copyText(text) {
      navigator.permissions
        .query({
          name: "clipboard-write"
        })
        .then(async result => {
          if (["granted", "prompt"].includes(result.state)) {
            await navigator.clipboard.writeText(text);
          } else {
            console.log(result);
            this.showError("تعذر نسخ المطلوب");
          }
        })
        .catch(error => {
          console.log(error);
          this.showError("تعذر أخذ الإذن بالنسخ");
        });
    },
    goThere(path = "/", silentError = false) {
      if (this.$route.fullPath !== path) {
        this.$router.push(path);
      } else {
        // if (!silentError) {
        //   this.showError("أنت بالفعل في الصفحة المطلوبة.");
        // }
      }
      return;
    },
    goBack() {
      let path = this.$store.state.router_obj.before;
      this.$router.push(path);
      return;
    },
    goBackHistory() {
      history.back();
      return;
    },
    goForwardHistory() {
      history.forward();
      return;
    },
    hidePreloader() {
      let preloader = document.querySelector("#app-preloader");
      if (preloader) {
        preloader.parentNode.removeChild(preloader);
      }
    },
    getLang: function(...expression) {
      let returner = "";
      for (let t of expression) {
        returner += `${this.$vuetify.lang.t("$vuetify." + t)} `;
      }
      return returner.substring(0, returner.length - 1);
    },
    // Side-Functions used to calculate demobilization date for each soldier
    dateDiff($to, $from, $fullDetails = false) {
      let $n = 86400000,
        ms = new Date($to) - new Date($from) + $n,
        days = ms / $n,
        months = days / 30,
        years = months / 12;
      if (!$fullDetails) {
        return Math.ceil(days);
      } else {
        if (days > 30) {
          if (months > 12) {
            let new_years = Math.floor(years),
              new_months = (years - new_years) * 12,
              other_new_months = Math.floor(new_months),
              new_days = (new_months - other_new_months) * 30;
            return {
              days: Math.ceil(new_days),
              months: Math.ceil(other_new_months),
              years: Math.ceil(new_years)
            };
          } else {
            let new_months = Math.floor(months),
              new_days = (months - new_months) * 30;
            return {
              days: Math.ceil(new_days),
              months: Math.ceil(new_months),
              years: 0
            };
          }
        } else {
          return {
            days: Math.ceil(days),
            months: 0,
            years: 0
          };
        }
      }
    },
    appConnection() {
      return this.$store.state.isOnline;
    },
    loadView(name) {
      return function(resolve) {
        require([`@/views/${name}.vue`], resolve);
      };
    },
    localTable(tbl, id = "") {
      let tables = require("@/mixin/localTables").objs,
        table = tbl && tbl.length > 0 && tables[tbl] ? tables[tbl] : [],
        value =
          id && id.length > 0 && table.find(t => t.id == id)
            ? table.find(t => t.id == id).displayedText
            : null;
      return value ? value : table;
    },
    fixName(fullname) {
      let endOfText = ["ى", "ي"],
        startOfText = ["أ", "ا", "إ"];
      endOfText.forEach(letter => {
        let splitter = fullname.split(" ");
        splitter.forEach(word => {
          if (word[word.length - 1] == letter) {
            fullname = fullname.replace(
              word,
              word.substring(0, word.length - 1) + "%"
            );
          }
        });
      });
      startOfText.forEach(letter => {
        let splitter = fullname.split(" ");
        splitter.forEach(word => {
          if (word[0] == letter) {
            fullname = fullname.replace(
              word,
              "%" + word.substring(1, word.length)
            );
          }
        });
      });
      fullname = fullname.replace(/عبد /g, "عبد").replace(/عبد/g, "عبد%");
      return fullname;
    },
    fixNumbers(str) {
      let p_numbers = [
          /٠/g,
          /١/g,
          /٢/g,
          /٣/g,
          /٤/g,
          /٥/g,
          /٦/g,
          /٧/g,
          /٨/g,
          /٩/g
        ],
        a_numbers = [
          /٠/g,
          /١/g,
          /٢/g,
          /٣/g,
          /٤/g,
          /٥/g,
          /٦/g,
          /٧/g,
          /٨/g,
          /٩/g
        ];
      if (typeof str === "string") {
        for (let i = 0; i < 10; i++) {
          str = str.replace(p_numbers[i], i).replace(a_numbers[i], i);
        }
      }
      return str;
    },
    /**
     * كل وظيفة الفنكشن دي إنها توحد شكل التاريخ في المنظومة
     * هتخليه دايماً يرجع بالصيغة دي
     * YYYY-MM-DD
     * مهما كانت الصيغة اللي انت دخلتها
     */
    fixDate(date) {
      if (date) {
        let fixed = new Date(date);
        if (fixed == "Invalid Date") {
          return null;
        } else {
          return `${fixed.getFullYear()}-${
            Number(fixed.getMonth() + 1).toString().length > 1
              ? Number(fixed.getMonth() + 1)
              : "0" + Number(fixed.getMonth() + 1)
          }-${
            fixed.getDate().toString().length > 1
              ? fixed.getDate()
              : "0" + fixed.getDate()
          }`;
        }
      } else {
        return date;
      }
    },
    async openExternal(path) {
      if (path && path.length > 0) {
        let fixedPath = path.replace(/\//g, "\\").replace("//", "/");
        await this.api("server/open-item", {
          path: fixedPath
        });
      }
    },
    fixDateTime(date) {
      if (date) {
        let fixed = new Date(date);
        if (fixed == "Invalid Date") {
          return null;
        } else {
          // 2020-12-16T10:15
          return `${fixed.getFullYear()}-${
            Number(fixed.getMonth() + 1).toString().length > 1
              ? Number(fixed.getMonth() + 1)
              : "0" + Number(fixed.getMonth() + 1)
          }-${
            fixed.getDate().toString().length > 1
              ? fixed.getDate()
              : "0" + fixed.getDate()
          }T${
            fixed.getHours().toString().length > 1
              ? fixed.getHours()
              : "0" + fixed.getHours()
          }:${
            fixed.getMinutes().toString().length > 1
              ? fixed.getMinutes()
              : "0" + fixed.getMinutes()
          }`;
        }
      } else {
        return date;
      }
    },
    fixDateTimes(array = [], dates = [], nest = false) {
      if (!dates || dates.length == 0) {
        return array;
      }
      array.forEach(el => {
        dates.forEach(date => {
          if (nest) {
            let distroy = date.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element) {
              el[date] = this.fixDateTime(element);
            }
          } else {
            el[date] = this.fixDateTime(el[date]);
          }
        });
      });
      return array;
    },
    fixDates(array = [], dates = [], nest = false) {
      // console.log("Got Array to Fix");
      array.forEach(el => {
        dates.forEach(date => {
          if (nest) {
            // date = medicalCommittees.committeeDate
            let distroy = date.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element) {
              // console.log(element);
              el[date] = this.fixDate(element);
              // console.log(el[date]);
            }
          } else {
            el[date] = this.fixDate(el[date]);
            // console.log(el[date]);
          }
        });
      });
      return array;
    },
    fixDatesChilds(array = [], dates = [], nest = false) {
      array.forEach(els => {
        els.items.forEach(el => {
          dates.forEach(date => {
            if (nest) {
              // date = medicalCommittees.committeeDate
              let distroy = date.split("."),
                element = el;
              distroy.forEach(v => {
                element = element[v] ? element[v] : element;
              });
              if (element) {
                el[date] = this.fixDate(element);
              }
            } else {
              el[date] = this.fixDate(el[date]);
            }
          });
        });
      });
      return array;
    },
    localDate(date) {
      let newDate = date ? new Date(date.replace(/-/g, "/")) : null;
      return newDate;
    },
    dbDate(date) {
      return date;
    },
    dbDates(array = [], dates = [], nest = false) {
      array.forEach(el => {
        dates.forEach(date => {
          if (nest) {
            // date = medicalCommittees.committeeDate
            let distroy = date.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element && element.length > 0) {
              el[date] = this.dbDate(new Date(element));
            }
          } else {
            el[date] =
              el[date] && el[date].length > 0
                ? this.dbDate(new Date(el[date]))
                : null;
          }
        });
      });
      return array;
    },
    originalDates(array = [], dates = [], nest = false) {
      array.forEach(el => {
        dates.forEach(date => {
          if (nest) {
            // date = medicalCommittees.committeeDate
            let distroy = date.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element && element.length > 0) {
              element = element.replace(/-/g, "/");
              el[date] = new Date(element);
            }
          } else {
            el[date] =
              el[date] && el[date].length > 0
                ? el[date].replace(/-/g, "/")
                : null;
            el[date] =
              el[date] && el[date].length > 0 ? new Date(el[date]) : null;
          }
        });
      });
      return array;
    },
    selectToArray(array = [], keys = [], nest = false) {
      array.forEach(el => {
        keys.forEach(key => {
          if (nest) {
            // date = medicalCommittees.committeeDate
            let distroy = key.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element && element.length > 0) {
              el[key] = element
                .split(" ")
                .join("")
                .trim()
                .split(",");
            }
          } else {
            if (el[key]) {
              el[key] =
                el[key] && el[key].length > 0
                  ? el[key]
                      .split(" ")
                      .join("")
                      .trim()
                      .split(",")
                  : [];
            }
          }
        });
      });
      return array;
    },
    arrayToSelect(array = [], keys = [], nest = false) {
      array.forEach(el => {
        keys.forEach(key => {
          if (nest) {
            // date = medicalCommittees.committeeDate
            let distroy = key.split("."),
              element = el;
            distroy.forEach(v => {
              element = element[v] ? element[v] : element;
            });
            if (element && element.length > 0) {
              el[key] = element.join(", ");
            }
          } else {
            if (el[key]) {
              console.log(el[key]);
              el[key] =
                el[key] && el[key].length > 0 ? el[key].join(", ") : null;
            }
          }
        });
      });
      return array;
    },
    getAppDefaults(refresh = false) {
      // Fetch Current Theme and Language
      let langs = ["ar", "en"],
        lang = this.$ls.get("app_lang", "ar"),
        zoom_factor = this.$ls.get("app_zoom_factor", 1),
        dark_theme = this.$ls.get("app_dark_theme", "false");
      this.setZoomFactor(zoom_factor);
      this.$vuetify.theme.dark = dark_theme == "false" ? false : true;
      if (langs.includes(lang)) this.changeLang(lang);
      // Fetch Theme Options and colors
      let lights = this.$vuetify.theme.themes.light,
        darks = this.$vuetify.theme.themes.dark;
      for (let l in lights) {
        let v = this.$ls.get("app_theme_light" + "_" + l, null);
        if (v) {
          this.$vuetify.theme.themes.light[l] = v;
        }
      }
      for (let d in darks) {
        let v = this.$ls.get("app_theme_dark" + "_" + d, null);
        if (v) {
          this.$vuetify.theme.themes.dark[d] = v;
        }
      }
      if (refresh) {
        let href = document.location.href;
        document.location.href = href;
      }
    },
    changeLang: function(lang) {
      let langs = ["ar", "en"];
      lang = langs.includes(lang) ? lang : "ar";
      this.$vuetify.lang.current = lang;
      this.$ls.set("app_lang", lang);
      this.$vuetify.rtl = lang == "ar" ? true : false;
      return;
    },
    getUdata(data, alt) {
      return this.$store.state.currentUserPublic &&
        this.$store.state.currentUserPublic[data] &&
        this.$store.state.currentUserPublic[data].trim() !== ""
        ? this.$store.state.currentUserPublic[data]
        : alt
        ? alt
        : "--";
    },
    // getLang: function(...expression) {
    //   let returner = "";
    //   for (let t of expression) {
    //     returner += `${this.$vuetify.lang.t("$vuetify." + t)} `;
    //   }
    //   return returner.substring(0, returner.length - 1);
    // },
    defaultUserAvatar: function() {
      // return require("@/assets/media/imgs/user-placeholder.jpg");
    },
    currentUser() {
      return this.$store.state.currentUser;
    },
    isServer() {
      if (
        this.$store.state.currentUser &&
        this.$store.state.servers &&
        this.$store.state.servers.length > 0
      ) {
        return true;
      }
      return false;
    },
    isApproved() {
      if (
        this.$store.state.currentUser &&
        this.$store.state.servers &&
        this.$store.state.servers.length > 0 &&
        this.$store.state.currentUserApproved
      ) {
        return true;
      }
      return false;
    },
    showError(code) {
      if (code) {
        if (typeof code == "object") {
          this.$set(
            this.$store.state.appError,
            "name",
            code.name ? code.name : "حدث خطأ"
          );
          this.$set(
            this.$store.state.appError,
            "msg",
            code.data ? code.data : "Undefined Message"
          );
        } else {
          this.$set(this.$store.state.appError, "msg", code);
        }
        this.$set(this.$store.state.appError, "model", true);
      }
    },
    showSuccess(code) {
      if (code) {
        if (typeof code == "object") {
          this.$set(
            this.$store.state.appSuccess,
            "name",
            code.name ? code.name : "تمت العملية"
          );
          this.$set(
            this.$store.state.appSuccess,
            "msg",
            code.data ? code.data : "Undefined Message"
          );
        } else {
          this.$set(this.$store.state.appSuccess, "msg", code);
        }
        this.$set(this.$store.state.appSuccess, "model", true);
      }
    },
    showInfo(code) {
      if (code) {
        if (typeof code == "object") {
          this.$set(
            this.$store.state.appInfo,
            "name",
            code.name ? code.name : "تنبيه"
          );
          this.$set(
            this.$store.state.appInfo,
            "msg",
            code.data ? code.data : "Undefined Message"
          );
        } else {
          this.$set(this.$store.state.appInfo, "msg", code);
        }
        this.$set(this.$store.state.appInfo, "model", true);
      }
    },
    showSnackbar(text, color = "default") {
      if (text) {
        this.$set(this.$store.state.snackbar, "text", text);
        this.$set(this.$store.state.snackbar, "color", color);
        this.$set(this.$store.state.snackbar, "model", true);
      }
    },
    logout() {
      // Close active tabss
      this.$set(this.$store.state, "routes", []);
      if (this.$store.state.routes && this.$store.state.routes.length == 0) {
        if (this.$route.fullPath == "/") {
          this.goThere("/no_tab_error");
          let intVal = setInterval(() => {
            this.$set(this.$store.state, "routes", []);
            this.goThere("/");
            clearInterval(intVal);
          }, 10);
        } else {
          this.goThere("/");
        }
      }
      this.$ls.remove("currentUser");
      this.$set(this.$store.state, "currentUser", null);
      this.$socket.client.emit("userLoggedOut");
    },
    ucFirst($text) {
      let ucfirst = $text
        .replace("_", " ")
        .toLowerCase()
        .split(" ")
        .map(s => s.charAt(0).toUpperCase() + s.substring(1))
        .join(" ");
      return ucfirst;
    },
    arr_obj_unique(arr, comp) {
      let unique = arr
        .map(e => e[comp])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => arr[e])
        .map(e => arr[e]);
      return unique;
    },
    // getAnim(name) {
    //   let data = require("@/assets/animation/" + name + ".json");
    //   return data;
    // },
    changeTheme(c) {
      this.$ls.set("app_dark_theme", c);
      this.$vuetify.theme.dark = c;
    },
    changeWidth() {
      let w = this.$store.state.app.width;
      if (w < 3) {
        this.$store.state.app.width = w + 1;
      } else {
        this.$store.state.app.width = 1;
      }
    },
    fileSize(bytes = 0) {
      let kb = bytes / 1024,
        mega = kb / 1024,
        giga = mega / 1024,
        returner = "";
      if (giga > 1) {
        returner = giga.toFixed(2) + "GB";
      } else if (mega > 1) {
        returner = mega.toFixed(2) + "MB";
      } else if (kb > 1) {
        returner = kb.toFixed(2) + "KB";
      }
      return returner;
    },
    getDateFormat(nationalId, birthDate) {
      if (
        !(
          nationalId &&
          nationalId.length == 14 &&
          birthDate &&
          birthDate.length
        )
      ) {
        // if the is no nation id or birthdate then we use the ddmmyyy as current military web pdf
        return DDMMYYFormat;
      }
      const DDMMYYFormat = "DDMMYYYY";
      const MMDDYYFormat = "MMDDYYYY";
      const defaultFormat = MMDDYYFormat;
      let NIDate,
        century = nationalId.slice(0, 1),
        year = nationalId.slice(1, 3),
        month = nationalId.slice(3, 5),
        day = nationalId.slice(5, 7);
      switch (century) {
        case "2":
          NIDate = day + "-" + month + "-" + "19" + year;
          break;

        case "3":
          NIDate = day + "-" + month + "-" + "20" + year;
          break;
      }
      if (NIDate.trim() == birthDate.trim()) {
        return DDMMYYFormat;
      }
      return defaultFormat;
    },
    daysToDate(period, isBasic = false) {
      period = Number(period);
      let daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31],
        yearInDays = 365;
      if (isBasic) {
        daysInMonth = [30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30, 30];
      }
      let years = Math.floor(period / yearInDays),
        remainDays = period - years * yearInDays,
        breakReduce = false,
        months = daysInMonth.reduce((total, curr, i) => {
          if (curr <= remainDays && !breakReduce) {
            remainDays -= curr;
            total++;
          } else {
            breakReduce = true;
          }
          return total;
        }, 0),
        days = Math.round(remainDays);

      return { years, months, days };
    }
  }
});
