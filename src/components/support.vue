<template>
    <section class="support">
        <div>
            <div class="page-title">
                <h1 class="rabsystems-font">{{ $t("support.support") }}</h1>
            </div>
            <div class="row">
                <div class="col-12">
                    <div class="contact-container">
                        <form action="contact" @submit.prevent="submitSupportForm()">
                            <div class="form-header">
                                <div class="row mb-2">
                                    <div class="col-12 col-md-6">
                                        <div class="form-input">
                                            <input type="text" name="name" id="name" :placeholder="$t('support.name')" required>
                                        </div>
                                    </div>
                                    <div class="col-12 col-md-6">
                                        <div class="form-input">
                                            <select name="contact-option" id="contact-option" required>
                                                <option value="">-- {{ $t("support.contact_reason") }} --</option>
                                                <option value="formatting">{{ $t("support.technical_assistance") }}</option>
                                                <option value="pc-assembly">{{ $t("support.sugestion_text") }}</option>
                                                <option value="maintenance">{{ $t("support.requests") }}</option>
                                                <option value="internet-system">{{ $t("support.others") }}</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="form-body">
                                <textarea name="description" id="description" maxlength="5000" :placeholder="$t('support.description')" required></textarea>
                            </div>
                            <input type="submit" :value="$t('support.send')">
                        </form>
                        <div class="loading"></div>
                    </div>
                </div>
            </div>
        </div>
    </section>    
</template>

<script>
import $ from 'jquery';

export default {
    name: "support",
    methods: {
        submitSupportForm: function () {
            let data = $("form").serializeArray().reduce(function (obj, item) { // Pega todos os dados do formulário e coloca em um objeto.
                obj[item.name] = item.value;
                return obj;
            }, {});

            $(".loading").show();

            setTimeout(() => {
                $(".loading").hide();
                console.log(data)
            }, 500);
        }
    }
}
</script>

<style scoped>
    .support {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
    }

    .contact-container {
        width: 90%;
        margin: auto;
    }

    @media (max-width: 876px) {
        .support {
            width: 100%;
        }
    }

    form {
        max-width: 1200px;
        margin: auto;
    }

    textarea, input, select {
        border-radius: 10px;
        border: 1px solid var(--gray);
        padding: 0 1rem;
        font-family: Arial, Helvetica, sans-serif;
    }

    textarea {
        padding: .8rem 1rem;
        width: 100%;
        min-height: 300px;
        max-height: 700px;
    }

    input, select {
        height: 40px;
    }

    input[type="submit"] {
        margin-top: 1rem;
        cursor: pointer;
        background: var(--purple);
        border-radius: 10px;
        color: var(--white);
        font-size: 1.1rem;
        padding: .7rem 1.3rem;
        line-height: 1;
    }

        input[type="submit"]:hover {
            background: var(--purple-low);
        }

    .form-input {
        margin: .5rem 0;
    }

    @media (max-width: 718px) {
        .form-input, input, select {
            width: 100%;
        }

        .form-input {
            margin: 0.5rem 0;
        }
    }

    @media (max-width: 449px) {
        input[type="submit"] {
            font-size: .9rem;
        }
    }
</style>