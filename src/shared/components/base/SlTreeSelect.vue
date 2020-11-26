<template>
  <div>
    <Treeselect v-model="treeVal" :options="options" :props="defaultProps" />
  </div>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.min.css'
export default {
  name: 'SlTreeSelect',
  components: { Treeselect },
  data () {
    return {
      treeVal: undefined,
      defaultProps: {
        children: 'children',
        label: 'title'
      },
      options: [
        {
          id: '1',
          label: 'a',
          children: [
            {
              id: '1-1',
              label: 'aa',
              children: [
                {
                  id: '1-1-2',
                  label: 'aa'
                },
                {
                  id: '1-12',
                  label: 'ab'
                }
              ]
            },
            {
              id: '1-2',
              label: 'ab'
            }
          ]
        },
        {
          id: '2',
          label: 'b',
          children: [
            {
              id: '2-1',
              label: 'aa'
            },
            {
              id: '2-2',
              label: 'ab'
            }
          ]
        },
        {
          id: 'c',
          label: 'c'
        }
      ]
    }
  },
  created () {

  },
  mounted () {

  },
  methods: {

  }
}
</script>

<style scoped lang="scss">
</style>
