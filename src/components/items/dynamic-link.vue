<template>
  <component :is="transformed"></component>
</template>

<script>
export default {
  name: "dynamic-link",
  props: {
    text: {
      type: String,
      default: ""
    }
  },
  data: () => ({}),
  methods: {
    convertHashtags(text) {
      let spanned = `<span>${text}</span>`;
      return spanned.replace(
        /#([\w]+)/g,
        '<router-link to="/soldiers_plus/$1">#$1</router-link>'
      );
    }
  },
  computed: {
    transformed() {
      const template = this.convertHashtags(this.text);
      return {
        template,
        props: this.$options.props
      };
    }
  }
};
</script>
