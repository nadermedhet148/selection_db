<template>
  <div>
    <afraad-db></afraad-db>
  </div>
</template>

<script>
export default {
  name: "linked-databases",
  components: {
    AfraadDb: () =>
      import("@/components/sections/admin/linked-databases/afraad.vue")
  },
  data: () => ({})
};
</script>
