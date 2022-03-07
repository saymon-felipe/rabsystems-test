<template>
    <section class="change-profile">
        <div class="change-profile-title">
            <h1 class="rabsystems-font">Alterar perfil</h1>
        </div>
        <div class="profile-content">
            <div class="photo">
                <div class="photo-inner">
                    <img src="../assets/img/FaceApp_1626456377197-01-01.jpeg" class="avatar avatar-m">
                </div>
            </div>
            <div class="name">
                <form action="changeName">
                    <input type="text" name="name" id="name" required>
                    <button>Salvar</button>
                </form>
            </div>
        </div>
    </section>
</template>

<script>
export default {
    name: "changeProfile"
}
</script>

<style scoped>
    .change-profile {
        width: calc(100% - 225px);
        height: 100%;
        padding: 1rem;
        text-align: center;
        background: var(--white);
        position: absolute;
        right: 0;
        overflow-y: scroll;
    }

    @media (max-width: 876px) {
        .change-profile {
            width: 100%;
        }
    }

    .change-profile-title {
        margin: 1.5rem 0;
    }

        .change-profile-title h1 {
            font-size: 1.8rem;
        }

    .name {
        max-width: 300px;
        margin: 3rem auto;
    }

    .name button {
        margin-top: 1rem;
        width: 100%;
        padding: 6px 0;
        border: none;
        border-radius: 10px;
        background: var(--purple);
        color: var(--white);
        font-size: 1.2rem;
        font-weight: 600;
        transition: all 0.4s;
    }

        .name button:hover {
            background: var(--purple-low);
        }

    .photo {
        cursor: pointer;
    }
</style>