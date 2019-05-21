<script>
const toLower = text => {
  return (text + '').toString().toLowerCase()
}

export default {
  name: 'Table',
  data () {
    return {
      documents: false,
      filtered: false,
      selectedDocs: [],
      search: '',
      filterField: 0,
      sortAsc: '1',
      page: [],
      currentPage: 1,
      maxPages: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    filterKey () {
      return this.fields[this.filterField].key
    },
    selected () {
      return this.selectedDocs.length + ' of ' + this.documents.length + ' ' + (this.selectedDocs.length > 1 ? this.plural : this.singular)
    }
  },
  methods: {
    filter (items) {
      return items.filter(item => toLower(item[this.filterKey]).includes(toLower(this.search)))
    },
    onSearch () {
      this.filtered = this.documents && this.documents.length ? this.filter(this.documents) : []
      this.currentPage = 0
      this.maxPages = Math.ceil(this.filtered.length / this.itemsPerPage)
      this.pageTable()
    },
    pageTable (num) {
      this.currentPage += num || 0
      if (this.currentPage < 1) this.currentPage = 1
      if (this.currentPage > this.maxPages) this.currentPage = this.maxPages
      let endIndex = this.currentPage * this.itemsPerPage
      this.page = this.filtered.slice(endIndex - this.itemsPerPage, endIndex)
    },
    onSortSearch () {
      this.documents.sort((a, b) => {
        if (this.fields[this.filterField].type === 'reference') {
          if (a[this.filterKey] && b[this.filterKey]) return a[this.filterKey].id > b[this.filterKey].id ? this.sortAsc : -1 * this.sortAsc
          return a[this.filterKey] ? this.sortAsc : -1 * this.sortAsc
        }
        return a[this.filterKey] > b[this.filterKey] ? this.sortAsc : -1 * this.sortAsc
      })
      this.onSearch()
    },
    onSelect (items) {
      this.selectedDocs = items
    }
  }
}
</script>