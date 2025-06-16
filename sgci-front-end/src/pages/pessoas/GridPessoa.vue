<template>
  <div class="q-pa-md bg">
    <div class="bg"></div>
    <div class="main-container">
      <div class="q-mb-md">
        <h4 class="title"> Gerir Pessoas</h4>
        <div class="divisor-inline"></div>
      </div>

      <q-table flat bordered ref="tableRef" class="my-sticky-last-column-table" :rows="rows" :columns="columns"
        :rows-per-page-options="pagination.perpageOptions" row-key="id" v-model:pagination="pagination"
        :loading="loading" binary-state-sort @request="buscarPessoas">

        <template v-slot:header="props">
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props"
              :class="col.label === 'Acções' ? 'action_column' : ''">
              {{ col.label }}
            </q-th>
          </q-tr>
          <q-tr :props="props">
            <q-th v-for="col in props.cols" :key="col.name" :props="props"
              :class="col.label === 'Acções' ? 'action_column' : ''">
              <q-input v-if="col.name != 'actions'" :model-value="filtros[col.name]"
                @change="val => filtroTrocado(col.name, val)" filled dense>
              </q-input>
            </q-th>
          </q-tr>
        </template>

        <template v-slot:body-cell-actions="props">
          <q-td :props="props" class="q-gutter-x-sm text-center action_column">
            <q-btn class="btn-action q-ml-none" size="sm" round flat icon="visibility" @click="visualizar(props.row)">
              <q-tooltip>Visualizar</q-tooltip>
            </q-btn>
            <q-btn class="btn-action" size="sm" style="margin-right: 5px;" round flat icon="border_color"
              @click="editar(props.row)">
              <q-tooltip>Editar Registro</q-tooltip>
            </q-btn>
            <q-btn class="btn-action" size="sm" round flat icon="cancel" @click="confirmarRemocao(props.row)">
              <q-tooltip>Excluir Registro</q-tooltip>
            </q-btn>
          </q-td>
        </template>
      </q-table>

      <div class="row">
        <div class="col-12">
          <div style="float: right; margin-top: 40px">
            <q-btn @click="exportar" style="margin-right: 10px;" label="Exportar" no-caps class="btn-voltar" />
            <q-btn @click="cadastrar" label="Cadastrar" no-caps class="btn-cadastrar" />
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import { ref, onMounted } from 'vue'
import { pessoaService } from 'src/services/sgci-api-service'
import { useQuasar } from 'quasar'

const columns = [
  { name: 'id', align: 'center', label: 'Id', field: 'id' },
  { name: 'nome', align: 'left', label: 'Nome', field: 'nome' },
  { name: 'documento', align: 'left', label: 'Documento', field: 'documento' },
  { name: 'profissao', align: 'left', label: 'Profissão', field: 'profissao' },
  { name: 'estadoCivil', align: 'left', label: 'Estado Cívil', field: 'estadoCivil' },
  { name: 'actions', required: true, align: 'center', field: 'actions' }
]

export default {
  setup() {
    const $q = useQuasar()
    const tableRef = ref()
    const rows = ref([])
    const loading = ref(false)
    const filtros = {}
    const pagination = ref({
      sortBy: 'desc',
      descending: false,
      page: 1,
      rowsPerPage: 3,
      perpageOptions: [1, 3, 5, 10, 20]
    })

    function buscarPessoas(props) {
      loading.value = true
      const { page, rowsPerPage, sortBy, descending } = props === undefined ? pagination.value : props.pagination
      const pageAt = page - 1
      const fetchCount = rowsPerPage
      pagination.value.rowsPerPage = fetchCount

      const req = { page: pageAt, size: fetchCount, direction: pagination.value.descending ? 'DESC' : 'ASC', ordenarPor: 'id' }
      console.log(req)
      pessoaService.findAll(prepararFiltros(req)).then(retorno => {
        console.log(retorno)
        rows.value.splice(0, rows.value.length, ...retorno.data.data)
        pagination.value.page = retorno.data.page + 1
        pagination.value.rowsNumber = retorno.data.totalRecords
        pagination.value.sortBy = sortBy
        pagination.value.descending = descending
        loading.value = false
      })


    }

    function prepararFiltros(req) {
      const request = {}
      Object.assign(request, filtros)
      for (const key of Object.keys(request)) {
        if (request[key] === null) {
          delete request[key]
          continue
        }
        if (typeof request[key] === 'object') {
          if (Array.isArray(request[key])) {
            continue
          }
          delete request[key]
          if (request[key].id) {
            request[key] = request[key].id
            continue
          }
          request[key] = request[key].value
        }
      }
      Object.assign(request, req)
      return request
    }

    onMounted(() => {
      // get initial data from server (1st page)
      tableRef.value.requestServerInteraction()
    })

    return {
      $q,
      tableRef,
      loading,
      pagination,
      columns,
      rows,
      buscarPessoas,
      filtros
    }
  },
  methods: {
    exportar() {
      pessoaService.exportar().then(resultado => {
        this.dowloadArquivoCsv(resultado.data, 'pessoas.csv')
        this.$q.notify({ message: 'Ficheiro exportado com sucesso!', color: 'positive', textColor: 'white' })
      })
    },
    dowloadArquivoCsv(base64, nomeFicheiro) {
      const byteChars = atob(base64)
      const byteArrays = new Uint8Array(byteChars.length)
      for (let i = 0; i < byteChars.length; i++) {
        byteArrays[i] = byteChars.charCodeAt(i)
      }

      const blob = new Blob([byteArrays], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')

      link.href = url
      link.download = nomeFicheiro
      link.click()

      URL.revokeObjectURL(url)
    },
    filtroTrocado(campoNome, valor) {
      if (valor === null || valor === '') {
        delete this.filtros[campoNome]
      } else {
        this.filtros[campoNome] = valor
      }
      this.buscarPessoas()
    },
    cadastrar() {
      this.$router.push('/pessoas/form')
    },
    editar(row) {
      this.$router.push('/pessoas/form/' + row.id)
    },
    visualizar(row) {
      this.$router.push('/pessoas/view/' + row.id)
    },
    confirmarRemocao(row) {
      this.$q.dialog({
        title: 'Atenção',
        message: 'Tem a certeza que deseja eliminar o registo do <<' + row.nome + '>>',
        style: 'width: 300px',
        ok: {
          label: 'Eliminar',
          push: true,
          color: 'red'
        },
        cancel: {
          label: 'Cancelar',
          push: true,
          outline: true,
          color: 'blue'
        },
        persistent: true
      }).onOk(() => {
        pessoaService.delete(row.id).then(() => {
          this.$q.notify({ message: 'Registo eliminado com sucesso', color: 'positive', textColor: 'white' })
          this.buscarPessoas()
        }).catch(erro => {
          console.log(erro)
        })
      })
    }
  }
}
</script>
<style lang="sass">
.my-sticky-last-column-table
  /* specifying max-width so the example can
    highlight the sticky column on any browser window */
  max-width: 100%

  thead tr:last-child th:last-child
    /* bg color is important for th; just specify one */
    background-color: #00b4ff

  td:last-child
    background-color: #00b4ff

  th:last-child,
  td:last-child
    position: sticky
    right: 0
    z-index: 1
</style>
