<template>
  <div>
    <q-form greedy ref="fmPessoa" @submit="cadastrar" class="bg">
      <div class="bg"></div>
      <div class="main-container">
        <div class="q-mb-md">
          <h4 class="title">Cadastrar Pessoa</h4>
          <div class="divisor-inline"></div>
        </div>

        <div class="q-pa-md" style="margin-top: -30px;">
          <h4 class="subTitulo">Dados Básicos</h4>
          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-7">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.nome" label="Nome:" dense />
            </div>

            <div class="col-2">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.documento" label="Documento:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.profissao" label="Profissão:" dense />
            </div>
          </div>

          <div class="row q-col-gutter-lg" style="margin-top: -15px;">
            <div class="col-7" style="margin-top: -15px;">
              <q-field
                label="Tipo de Pessoa" lazy-rules borderless stack-label>
                <q-option-group v-model="pessoa.tipo" :options="optionsTipoPessoa" color="primary" inline />
              </q-field>
            </div>

            <div class="col-5" style="margin-top: -15px;">
              <q-field
                label="Estado Cívil" lazy-rules borderless stack-label>
                <q-option-group v-model="pessoa.estadoCivil" :options="optionsEstadoCivil" color="primary" inline />
              </q-field>
            </div>
          </div>
        </div>

        <div class="q-pa-md" style="margin-top: -30px;">
          <h4 class="subTitulo">Endereço</h4>

          <div class="row q-col-gutter-lg q-mb-sm">
            <div class="col-2">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.cep" label="CEP:" dense />
            </div>

            <div class="col-4">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.estado" label="Estado:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.cidade" label="Cidade:" dense />
            </div>
            <div class="col-3">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.bairro" label="Bairro:" dense />
            </div>
          </div>

          <div class="row q-col-gutter-lg" style="margin-top: -15px;">
            <div class="col-9">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.rua" label="Rua:" dense />
            </div>

            <div class="col-3">
              <q-input :rules="[val => !(val == null || val == '') || 'Campo de preenchimento obrigátorio.']"
                v-model="pessoa.endereco.numero" label="Número:" dense />
            </div>
          </div>
        </div>
      </div>

      <div class="row" style="margin-top: 15px;">
        <div class="col-12">
          <div style="float: right;">
            <q-btn label="Voltar" no-caps class="btn-voltar" style="margin-right: 10px;" />
            <q-btn type="submit" label="Cadastrar" no-caps class="btn-cadastrar" />
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
  methods: {
    cadastrar() {
      pessoaService.create(this.pessoa).then(response => {
        console.log ("Pessoa registada com sucesso!")
        console.log(response)
      })
    }
  }
}

</script>
