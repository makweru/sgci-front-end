<template>
  <div>
    <q-form greedy ref="fmPessoa" id="fmPessoa" @submit="cadastrarOuActualizar" class="bg">
      <div class="bg"></div>
      <div class="main-container">
        <div class="q-mb-md">
          <h4 class="title"> {{ pessoa.id ? 'Editar ' : 'Registar ' }} Pessoa</h4>
          <div class="divisor-inline"></div>
        </div>

        <div class="q-pa-md" style="margin-top: -30px;">
          <h4 class="subTitulo">Dados Básicos</h4>
          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-7">
              <q-input :rules="[vRequired]" v-model="pessoa.nome" label="Nome:" dense />
            </div>

            <div class="col-2">
              <q-input :rules="[vRequired]" v-model="pessoa.documento" label="Documento:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[vRequired]" v-model="pessoa.profissao" label="Profissão:" dense />
            </div>
          </div>

          <div class="row q-col-gutter-lg" style="margin-top: -15px;">
            <div class="col-7" style="margin-top: -15px;">
              <q-field ref="tipoPessoa" :rules="[vRequired]" :model-value="pessoa.tipo" label="Tipo de Pessoa"
                lazy-rules borderless stack-label>
                <template v-slot:control>
                  <q-option-group v-model="pessoa.tipo" :options="optionsTipoPessoa" color="primary" inline />
                </template>
              </q-field>
            </div>

            <div class="col-5" style="margin-top: -15px;">
              <q-field ref="estadoCivil" :rules="[vRequired]" :model-value="pessoa.estadoCivil" label="Estado Cívil"
                lazy-rules borderless stack-label>
                <template v-slot:control>
                  <q-option-group v-model="pessoa.estadoCivil" :options="optionsEstadoCivil" color="primary" inline />
                </template>
              </q-field>
            </div>
          </div>
        </div>

        <div class="q-pa-md" style="margin-top: -30px;">
          <h4 class="subTitulo">Endereço</h4>

          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-2">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.cep" label="CEP:" dense />
            </div>

            <div class="col-4">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.estado" label="Estado:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.cidade" label="Cidade:" dense />
            </div>
            <div class="col-3">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.bairro" label="Bairro:" dense />
            </div>
          </div>

          <div class="row q-col-gutter-lg" style="margin-top: -15px;">
            <div class="col-9">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.rua" label="Rua:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[vRequired]" v-model="pessoa.endereco.numero" label="Número:" dense />
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: 15px;">
        <div class="col-12">
          <div style="float: right;">
            <q-btn label="Voltar" no-caps class="btn-voltar" style="margin-right: 10px;" />
            <q-btn type="submit" :label="pessoa.id ? 'Actualizar' : 'Guardar'" no-caps class="btn-cadastrar" />
          </div>
        </div>
      </div>
    </q-form>
  </div>

</template>

<script>
import { pessoaService } from 'src/sgci-api-service';
import { ref } from 'vue';

export default {
  name: 'CreateEditPessoa',
  setup() {
    const pessoa = ref({
      id: null,
      nome: null,
      documento: null,
      profissao: null,
      tipo: null,
      estadoCivil: null,
      endereco: ref({
        cep: null,
        estado: null,
        cidade: null,
        rua: null,
        bairro: null,
        numero: null
      })
    })
    return {
      pessoa,
      optionsTipoPessoa: [
        {
          label: 'Pessoa Física',
          value: 'PESSOA_FISICA'
        },
        {
          label: 'Pessoa Jurídica',
          value: 'PESSOA_JURIDICA'
        }
      ],
      optionsEstadoCivil: [
        {
          label: 'Solteiro',
          value: 'SOLTEIRO'
        },
        {
          label: 'Casado',
          value: 'CASADO'
        },
        {
          label: 'Divorciado',
          value: 'DIVORCIADO'
        }
      ]
    }
  },
  watch: {
    'pessoa.tipo': {
      handler() {
        this.$refs.tipoPessoa.resetValidation()
      }
    },
    'pessoa.estadoCivil': {
      handler() {
        this.$refs.estadoCivil.resetValidation()
      }
    }
  },
  mounted() {
    this.buscarPessoaParaEdicao()
  },
  methods: {
    buscarPessoaParaEdicao() {
      if (!this.$route.params.id) return
      pessoaService.getById(this.$route.params.id).then(retorna => {
        this.pessoa = retorna.data
      })
    },

    cadastrarOuActualizar() {
      console.log(this.pessoa.id)
      if (this.pessoa.id) {
        pessoaService.update(this.pessoa.id, this.pessoa).then(response => {
          console.log('Pessoa editada com sucesso.' + response)
        })
        return
      }

      pessoaService.create(this.pessoa).then(response => {
        console.log("Pessoa registada com sucesso!")
        console.log(response)
      })
    }
  }
}

</script>
