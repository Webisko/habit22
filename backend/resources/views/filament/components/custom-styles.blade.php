@vite(['resources/css/app.css', 'resources/css/filament/admin/theme.css'])

@php
    $loginBg = app(\App\Support\StoreSettings::class)->adminLoginBackgroundUrl();
@endphp

@if($loginBg)
<style>
    body.fi-body.fi-simple-page {
        background-image: url('{{ $loginBg }}') !important;
        background-size: cover !important;
        background-position: center !important;
        background-repeat: no-repeat !important;
        background-attachment: fixed !important;
    }
    body.fi-body.fi-simple-page::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(9, 9, 11, 0.4); /* subtle dark overlay */
        z-index: -1;
    }
</style>
@endif

<script>
    (function () {
        try {
            const isOpen = localStorage.getItem('_x_isOpenDesktop');
            if (isOpen === 'false') {
                document.documentElement.classList.add('fi-sidebar-collapsed');
            }
        } catch (e) {}
    })();

    document.addEventListener('alpine:init', () => {
        window.Alpine.effect(() => {
            try {
                const isOpen = window.Alpine.store('sidebar').isOpenDesktop;
                if (isOpen === false) {
                    document.documentElement.classList.add('fi-sidebar-collapsed');
                } else {
                    document.documentElement.classList.remove('fi-sidebar-collapsed');
                }
            } catch (e) {}
        });
    });
</script>

