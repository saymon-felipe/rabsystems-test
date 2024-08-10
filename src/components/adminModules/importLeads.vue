<template>
    <div class="utility">
        <p class="page-title page-title-left">Utilitário importador de leads</p>
        <div class="spreadsheet-upload">
            <form id="form-upload-spreadsheet" @submit.prevent="uploadSpreadsheet()">
                <input type="file" name="spreadsheet" id="excel-input" required @change="handleFileChange">
                <button type="submit" class="btn primary">Carregar planilha</button>
            </form>
        </div>
        <div class="leads-container" v-if="leads.length > 0">
            <table align="left">
                <thead>
                    <tr>
                        <th class="text-start pl-5">Empresa</th>
                        <th class="text-start pl-5">Nome</th>
                        <th class="text-start pl-5">Email</th>
                        <th class="text-start pl-5">Endereço</th>
                        <th class="text-start pl-5">Cidade</th>
                        <th class="text-start pl-5">Telefone</th>
                        <th class="text-start pl-5">Área de atuação</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in leads" v-bind:key="index">
                        <td :title="item.EMPRESA" align="left">
                            {{ item.EMPRESA }}
                        </td>
                        <td :title="item.NOME" align="left">
                            {{ item.NOME }}
                        </td>
                        <td :title="item.EMAIL" align="left">
                            {{ item.EMAIL }}
                        </td>
                        <td :title="item.ENDERECO" align="left">
                            {{ item.ENDERECO }}
                        </td>
                        <td :title="item.CIDADE" align="left">
                            {{ item.CIDADE }}
                        </td>
                        <td :title="item.TELEFONE" align="left">
                            {{ item.TELEFONE }}
                        </td>
                        <td :title="item.AREA_ATUACAO" align="left">
                            {{ item.AREA_ATUACAO }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <button class="btn primary float-right mt-3" v-if="leads.length > 0" v-on:click="importLeads()">Importar leads</button>
    </div>
</template>
<script>
import * as XLSX from 'xlsx';
import api from '../../configs/api.js';
import { globalMethods } from '../../js/globalMethods';
import $ from 'jquery';

export default {
    name: "importLeads",
    mixins: [globalMethods],
    data() {
        return {
            file: null,
            leads: []
        }
    },
    methods: {
        handleFileChange(event) {
            this.file = event.target.files[0];
        },
        async uploadSpreadsheet() {
            if (this.file) {
                // Ler o arquivo diretamente sem usar FileReader
                const arrayBuffer = await this.file.arrayBuffer();
                const data = new Uint8Array(arrayBuffer);
                const workbook = XLSX.read(data, { type: 'array' });

                // Seleciona a aba "Sheet1"
                const sheetName = workbook.SheetNames[0]; // Ou "Sheet1" se souber o nome exato
                const worksheet = workbook.Sheets[sheetName];
                
                // Converte o sheet para JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // Verificar se há cabeçalhos e dados suficientes
                if (jsonData.length > 1) {
                    // Pega os cabeçalhos a partir da primeira linha
                    const headers = jsonData[0].map(header => header.replace(/\s+/g, '_'));
                    const emailColumnIndex = headers.indexOf('EMAIL');
                    const phoneColumnIndex = headers.indexOf('TELEFONE');
                    
                    if (emailColumnIndex === -1) {
                        console.error('Coluna "EMAIL" não encontrada');
                        return;
                    }

                    const uniqueEmails = new Set();
                    const leads = jsonData.slice(1).map(row => {
                        let lead = {};
                        row.forEach((cell, index) => {
                        lead[headers[index]] = cell;
                        });

                        if (phoneColumnIndex !== -1) {
                        lead['TELEFONE'] = this.cleanPhoneNumber(lead['TELEFONE']);
                        }

                        lead['ORIGIN'] = "lead_excel";

                        return lead;
                    }).filter(lead => {
                        if (this.isValidEmail(lead['EMAIL']) && !uniqueEmails.has(lead['EMAIL'])) {
                        uniqueEmails.add(lead['EMAIL']);
                        return true;
                        }
                        return false;
                    });

                    this.leads = leads;
                }
            }
        },
        isValidEmail(email) {
            const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return re.test(email);
        },
        cleanPhoneNumber(phone) {
            const cleaned = ('' + phone).replace(/\D/g, '');

            if (cleaned.length >= 10) {
                return cleaned;
            } else {
                return '';
            }
        },
        importLeads: function () {
            let self = this, jwt = "Bearer " + self.getJwtInLocalStorage();
            let data = {
                leads: self.leads
            }

            api.post("/newsletter/register_leads", data, {
                headers: {
                        Authorization: jwt
                    }
            })
            .then(function(){
                $("#excel-input").val("");
                self.$emit("importedLeads", true);
            }).catch((error) => {
                console.log(error);
            })
        }
    }
}
</script>
<style scoped>
#form-upload-spreadsheet {
    display: flex;
    align-items: center;
}   

    #form-upload-spreadsheet input {
        max-width: 450px;
        margin-right: 1rem;
    }

.leads-container {
    margin-top: 2rem;
    width: 100%;
    overflow-x: auto;
    max-height: calc(100vh - 390px);
}

table tbody td {
    white-space: nowrap;
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
}
</style>