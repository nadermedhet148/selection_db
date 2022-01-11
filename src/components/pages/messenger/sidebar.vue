<template>
  <v-navigation-drawer permanent right width="400" v-model="drawer">
    <v-text-field
      filled
      v-model="search"
      prepend-inner-icon="mdi-magnify"
      hide-details
    ></v-text-field>
    <div class="list-container">
      <div v-if="users_ordered.length == 0">
        <template v-for="n in renderedSkeleton">
          <v-skeleton-loader
            :key="n"
            type="list-item-two-line"
          ></v-skeleton-loader>
          <v-divider :key="n + '_d'" v-if="renderedSkeleton > n"></v-divider>
        </template>
      </div>
      <v-list v-else>
        <v-list-item-group
          mandatory
          v-model="local.selected_chat"
          @input="$emit('update:selected_chat', local.selected_chat)"
          @keyup="$emit('update:selected_chat', local.selected_chat)"
          @change="$emit('update:selected_chat', local.selected_chat)"
          color="primary"
        >
          <template v-for="(user, i) in users_ordered">
            <v-list-item
              v-if="!search || user.realName.includes(search)"
              :value="user.userId.toString()"
              :key="user.userId"
            >
              <v-list-item-avatar>
                <v-img
                  :src="
                    user.avatar
                      ? user.avatar
                      : require('@/assets/inapp/user-placeholder.jpg')
                  "
                ></v-img>
              </v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title v-text="user.realName"></v-list-item-title>
                <v-list-item-subtitle>
                  <div v-if="user.messengerLastMsg">
                    {{
                      user.messengerLastMsg.sender &&
                      user.messengerLastMsg.sender !== user.userId
                        ? "أنت : "
                        : ""
                    }}
                    {{ user.messengerLastMsg.msg }}
                  </div>
                </v-list-item-subtitle>
              </v-list-item-content>
              <v-list-item-action-text class="text-end">
                <div v-if="$store.state.sockets._connected[user.userId]">
                  <v-icon small color="success">mdi-circle</v-icon>
                </div>
                <div
                  v-if="user.messengerLastMsg && user.messengerLastMsg.date"
                  class="text-caption"
                >
                  {{ user.messengerLastMsg.date | moment("from", "now") }}
                </div>
              </v-list-item-action-text>
            </v-list-item>
            <v-divider
              :key="i + '_d'"
              v-if="
                users_ordered.length > i + 1 &&
                  (!search || user.realName.includes(search))
              "
            ></v-divider>
          </template>
        </v-list-item-group>
      </v-list>
    </div>
  </v-navigation-drawer>
</template>

<style lang="scss" scoped>
.list-container {
  height: calc(100vh - 64px - 57px - 50px);
  .v-list {
    height: inherit;
    overflow: auto;
    .v-list-item-group {
      height: inherit;
    }
  }
}
</style>

<script>
export default {
  name: "messenger-sidebar",
  props: {
    selected_chat: String
  },
  data: () => ({
    drawer: true,
    renderedSkeleton: 9,
    users: [],
    search: "",
    local: {
      selected_chat: ""
    }
  }),
  computed: {
    users_ordered: {
      get() {
        let users = this.users;
        users
          .sort((a, b) => {
            return a.section - b.section;
          })
          .sort((a, b) => {
            let dateA = new Date(
              a.messengerLastMsg.date ? a.messengerLastMsg.date : "01-01-1900"
            );
            let dateB = new Date(
              b.messengerLastMsg.date ? b.messengerLastMsg.date : "01-01-1900"
            );
            return dateB - dateA;
          });
        return users;
      },
      set(users) {
        return users;
      }
    }
  },
  mounted() {
    this.fetchUsers();
  },
  sockets: {
    recievedNewLatestMsg(msg) {
      let { userId } = this.$store.state.currentUser,
        { user1, user2 } = msg,
        pushTo = userId == user1 ? user2 : user1,
        pushIndex = this.users.findIndex(u => u.userId == pushTo);
      this.$set(this.users[pushIndex], "messengerLastMsg", msg);
    }
  },
  methods: {
    fetchUsers() {
      let { userId } = this.$store.state.currentUser;
      this.api("tables/users/visible_users_with_latest_msg", {
        userId
      })
        .then(record => {
          let users = record.data.filter(
            // Remove current user from the list
            u => u.userId !== userId
          );
          this.$set(this, "users", users);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }
};
</script>
