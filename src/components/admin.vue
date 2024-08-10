<template>
    <div class="page-container">
        <div class="page-title">
            <h1 class="rabsystems-font">Admin</h1>
        </div>  
        <div class="admin-options">
            <ul class="admin-lateral-menu">
                <li class="admin-menu-item" v-on:click="toggleMenuItem($event)">
                    <div class="admin-menu-item-internal">
                        <i class="fas fa-angle-down" toggle="down"></i>
                        Newsletter
                    </div>
                    <ul class="admin-menu-list-internal">
                        <li v-on:click="showAdminModule('create-newsletter', true)">Criar modelo</li>
                        <li v-on:click="showAdminModule('list-newsletter')">Listar modelos</li>
                        <li v-on:click="showAdminModule('send-newsletter')">Enviar newsletter</li>
                        <li v-on:click="showAdminModule('mail-queue')">Fila de emails</li>
                    </ul>
                </li>
                <li class="admin-menu-item" v-on:click="toggleMenuItem($event)">
                    <div class="admin-menu-item-internal">
                        <i class="fas fa-angle-down" toggle="down"></i>
                        Clientes
                    </div>
                    <ul class="admin-menu-list-internal">
                        <li v-on:click="showAdminModule('import-leads', true)">Importar leads</li>
                    </ul>
                </li>
            </ul>
            <div class="admin-content">
                <div class="admin-item">
                    <h5>Bem vindo ao admin do sistema, escolha algum módulo para prosseguir</h5>
                </div>
                <div class="admin-items-container">
                    <div class="admin-item" id="create-newsletter" v-if="showCreate">
                        <createNewsletterModel :editObj="newsletterEdit" @model_changed="showAdminModule('list-newsletter')" />
                    </div>
                    <div class="admin-item" id="list-newsletter" v-if="showList">
                        <listNewsletterModels @edit_newsletter="editNewsletter($event)" />
                    </div>
                    <div class="admin-item" id="send-newsletter" v-if="showSend">
                        <sendNewsletter @submitMailQueue="showAdminModule('mail-queue')" />
                    </div>
                    <div class="admin-item" id="mail-queue" v-if="showMailQueue">
                        <mailQueue />
                    </div>
                    <div class="admin-item" id="import-leads" v-if="showImportLeads">
                        <importLeads @importedLeads="showAdminModule('send-newsletter')" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import $ from 'jquery';
import createNewsletterModel from "./adminModules/createNewsletterModel.vue";
import listNewsletterModels from "./adminModules/listNewsletterModels.vue";
import sendNewsletter from "./adminModules/sendNewsletter.vue";
import mailQueue from "./adminModules/mailQueue.vue";
import importLeads from "./adminModules/importLeads.vue";

export default {
    name: "admin",
    data() {
        return {
            newsletterEdit: null,
            showCreate: false,
            showList: false,
            showMailQueue: false,
            showSend: false,
            showImportLeads: false
        }
    },
    methods: {
        closeAllAdminOptions: function () {
            let menuItems = $(".admin-menu-item");
            menuItems.each((index, item) => {
                let currentItemInternal = $(item).find(".admin-menu-list-internal");
                currentItemInternal.slideToggle();
            })
        },
        toggleMenuItem: function (event) {
            if (event.target.nodeName == "LI") {
                return;
            }
            let icon = $(event.target).find("i");
            let itemInternal = $(event.target.nextElementSibling);
            itemInternal.slideToggle();

            if (icon.attr("toggle") == "down") {
                icon.css("transform", "rotate(180deg)");
                icon.attr("toggle", "up");
            } else if (icon.attr("toggle") == "up") {
                icon.css("transform", "rotate(0)");
                icon.attr("toggle", "down");
            }
        },
        resetAdminModules: function () {
            let adminItems = $(".admin-item");
            adminItems.each((index, item) => {
                let currentItem = $(item);
                currentItem.hide();
            })
            this.hideModules();
        },
        showAdminModule: function (module, clickInItem = false) {    
            this.resetAdminModules();
            setTimeout(() => {
                switch (module) {
                    case "create-newsletter":
                        if (clickInItem) {
                            this.newsletterEdit = null;
                        }
                        this.showCreate = true;
                        break;
                    case "list-newsletter":
                        this.showList = true;
                        break;
                    case "send-newsletter":
                        this.showSend = true;
                        break;
                    case "mail-queue":
                        this.showMailQueue = true;
                        break;
                    case "import-leads":
                        this.showImportLeads = true;
                        break;
                } 
            }, 10)
            
            setTimeout(() => {
                let targetModule = $("#" + module);
                targetModule.show();
            }, 10)
        },
        hideModules() {
            this.showSend = false;
            this.showList = false;
            this.showCreate = false;
        },
        editNewsletter: function (obj) {
            this.newsletterEdit = obj;
            this.showAdminModule('create-newsletter');
        }
    },
    components: {
        createNewsletterModel,
        listNewsletterModels,
        sendNewsletter,
        mailQueue,
        importLeads
    },
    mounted: function () {
        this.closeAllAdminOptions();
    }
}
</script>
<style scoped>
.admin {
    width: calc(100% - 225px);
    height: 100%;
    padding: 1rem;
    padding-top: 2rem;
    text-align: center;
    background: var(--white);
    position: absolute;
    right: 0;
}

@media (max-width: 876px) {
    .admin {
        width: 100%;
    }
}

.admin-content {
    overflow-y: auto;
}

.admin-options {
    min-height: calc(100vh - 175px);
    height: calc(100vh - 175px);
    max-height: calc(100vh - 175px);
    width: 100%;
    display: flex;
}

.admin-lateral-menu {
    min-width: 200px;
    max-width: 300px;
    width: 30vw;
    border: 1px solid var(--gray-high-2);
    min-height: calc(100vh - 170px);
    margin: 0;
    border-radius: 7px;
    list-style: none;
}

.admin-menu-item {
    width: 100%;
    cursor: pointer;
}

.admin-menu-item-internal {
    display: flex;
    align-items: center;
    font-size: 1.1rem;
    font-weight: 500;
    padding: 10px;
}

    .admin-menu-item-internal:hover {
        background: var(--gray-high-3);
    }

    .admin-menu-item-internal i {
        font-size: 1.3rem;
        margin-right: 15px;
        transition: transform 0.4s;
    }

.admin-menu-list-internal {
    list-style: none;
    text-align: left;
    margin-left: 2.4rem;
}

    .admin-menu-list-internal li {
        padding: 5px;
        width: 100%;
    }

    .admin-menu-list-internal li:hover {
        background: var(--blue-high-3);
    }

.admin-content {
    padding: 1rem;
    width: 100%;
}

.admin-item, .admin-items-container .admin-item {
    width: 100%;
    display: none;
}

.admin-content > .admin-item {
    text-align: center;
    display: block;
}
</style>