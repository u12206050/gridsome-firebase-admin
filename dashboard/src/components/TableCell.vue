<template>
  <el-popover v-if="field.type === 'object'" trigger="hover" placement="top">
    <div v-if="field.display" v-html="field.display(field, cell)"></div>
    <ul v-else>
      <template v-for="objField in field.object">
        <li :key="objField.key" style="display: flex" v-if="objField.type !== 'hidden'">
          {{objField.label}}: <TableCell :field="objField" :cell="cell[objField.key]" />
        </li>
      </template>
    </ul>
    <div slot="reference" class="name-wrapper">
      <el-tag size="medium" v-if="field.title">{{field.title(field, cell)}}</el-tag>
      <el-tag size="medium" v-else>{{Object.keys(cell).length}}</el-tag>
    </div>
  </el-popover>

  <el-popover v-else-if="field.type === 'map'" trigger="hover" placement="top">
    <div>
      <p v-for="prop in Object.keys(cell)" :key="prop" style="display: flex">
        <TableCell :field="field.map.key" :cell="prop" />: <TableCell :field="field.map.value" :cell="cell[prop]" />
      </p>
    </div>
    <div slot="reference" class="name-wrapper">
      <el-tag size="medium">{{field.title(field, cell)}}</el-tag>
    </div>
  </el-popover>

  <el-popover v-else-if="field.type === 'array'" trigger="hover" placement="top">
    <div v-if="field.display" v-html="field.display(field, cell)"></div>
    <ul v-else-if="field.arrayType">
      <li v-for="(val, arrIndex) in cell" :key="arrIndex">
        <TableCell :field="{type: field.arrayType, key: '__index__'}" :cell="val" />
      </li>
    </ul>
    <div v-else-if="field.array">
      <TableCell v-for="(val, arrIndex) in cell" :key="arrIndex" :field="field.array" :cell="val" />
    </div>
    <div slot="reference" class="name-wrapper">
      <el-tag v-if="field.title" size="medium">{{field.title(field, cell)}}</el-tag>
      <el-tag v-else size="medium">{{cell ? cell.length : 'none'}}</el-tag>
    </div>
  </el-popover>

  <g-image v-else-if="field.type === 'image' && cell" class="thumbnail" :src="cell" />
  <g-image v-else-if="field.type === 'image'" class="thumbnail" src="../assets/no-image.svg" />

  <i v-else-if="field.type === 'boolean'" :title="cell" :class="!!cell ? 'el-icon-success boolean-true' : 'el-icon-error boolean-false'"></i>

  <router-link v-else-if="field.type === 'reference'" :to="cell && cell.parent && cell.parent.path ? `/${cell.parent.path}?id=${cell.id}` : ''" class="reference-link">
    <i v-if="cell && !refData" class="el-icon-loading"></i>
    <i v-else-if="!cell || typeof refData[field.reference.key] === 'undefined'" class="el-icon-minus"></i>
    <TableCell v-else :field="field.reference" :cell="refData[field.reference.key]"/>
  </router-link>

  <el-popover v-else-if="field.type === 'textarea'" trigger="hover" placement="top" width="400">
    <p>{{cell}}</p>
    <div slot="reference" class="name-wrapper">
      {{cell ? cell.substr(0, 30) + '...' : '–––'}}
    </div>
  </el-popover>

  <span v-else-if="field.type === 'datetime'">{{ cell | datetime }}</span>

  <span v-else-if="field.type === 'color'" class="color" :style="{backgroundColor: cell}">{{ cell }}</span>

  <span v-else-if="field.title">{{ field.title(field, cell) }}</span>

  <span v-else>{{ String(cell) }}</span>
</template>

<script>
export default {
  name: 'TableCell',
  props: {
    field: { type: Object, required: true },
    cell: { required: true }
  },
  data () {
    return {
      refData: null
    }
  },
  watch: {
    cell() {
      this.onCell();
    }
  },
  mounted() {
    this.onCell();
  },
  filters: {
    datetime(value) {
      return value.toDate ? value.toDate().toLocaleString() : new Date(value).toLocaleString()
    }
  },
  methods: {
    onCell () {
      if (this.cell && this.field.type === 'reference' && !this.cell.hasOwnProperty('__data')) {
        let ref = this.cell
        if (typeof ref === 'string') ref = this.$db.collection(this.$store.collectionPath(this.field.collection)).doc(ref)
        if (!ref.get) throw new Error(this.field.key + ': Is not a valid reference object')
        ref.get()
          .then(doc => {
            let data = doc.data();
            data.__key__ = doc.id;
            this.refData = data;
          })
          .catch(err => this.$message({ type: 'error', message: `Invalid ${ref.path} Reference Field` }));
      }
    }
  }
};
</script>

<style lang="scss">
.sort-switch {
  transition: 0.2s;
  transform: rotate(0deg);

  &.toggle {
    transform: rotate(180deg);
  }
}

.boolean-true {
  font-size: x-large;
  color: #67c23a;
}

.boolean-false {
  font-size: x-large;
  color: #909399;
}

.thumbnail {
  border-radius: 20px;
  width: 40px;
  height: 40px;
  object-fit: cover;
}

.reference-link {
  display: block;
}

.color {
  padding: 4px 8px;
  text-align: center;
  color: #fff;
  text-shadow: 0px 0px 2px #000;
}
</style>

