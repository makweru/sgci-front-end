import axios from 'axios';

const apiSgci = axios.create({
  //process.env.API_SGCI
  baseURL: 'http://localhost:8080/v1/api'
})

export class PessoaService {
  path = '/pessoas'

  create (pessoa) {
    return apiSgci.post(this.path, pessoa)
  }
}

export const pessoaService = new PessoaService()
