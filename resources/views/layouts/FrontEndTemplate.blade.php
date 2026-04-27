<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERRELLERIA SOLIDÀRIA</title>

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])

</head>
<body class="app">

    <script src="//unpkg.com/alpinejs" defer></script>

    <header class="header">
        <div class="header__left">
            <a href="{{ route('home') }}" class="header__title">
                SERRELLERIA SOLIDÀRIA
            </a>
        </div>

        <div class="header__right">
            <a href="{{ route('categorias.productos') }}" class="btn btn--secondary">
                Productes
            </a>

            <a href="{{ route('solucions.create') }}" class="btn btn--primary">
                Solucions Personalitzades
            </a>

            <div id="cart-counter"></div>

                @auth
                    @if(Auth::user()->admin)
                        <a href="{{ route('admin.dashboard') }}" class="btn btn--secondary header__login">
                            👤 {{ Auth::user()->nombre }}
                        </a>
                    @else
                        <a href="{{ route('profile.edit') }}" class="btn btn--secondary header__login">
                            👤 {{ Auth::user()->nombre }}
                        </a>
                    @endif

                    <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                        @csrf
                        <button type="submit" class="btn btn--secondary header__login">
                            Log out
                        </button>
                    </form>
                @else
                    <a href="{{ route('login') }}" class="btn btn--secondary header__login">
                        Iniciar Sessió
                    </a>
                @endauth
        </div>

        
    </header>
    <main class="main">
        @yield('content')
    </main>

<footer class="footer">
    <div class="footer__container">

        <div class="footer__col">
            <h3 class="footer__title">Serrelleria Solidària</h3>
            <p class="footer__text">
                Solucions professionals en serralleria amb compromís social.
            </p>
        </div>

        <div class="footer__col">
            <h4 class="footer__subtitle">Botiga</h4>
            <ul>
                <li><a href="#">Productes</a></li>
                <li><a href="#">Categories</a></li>
                <li><a href="#">Packs</a></li>
            </ul>
        </div>

        <div class="footer__col">
            <h4 class="footer__subtitle">Ajuda</h4>
            <ul>
                <li><a href="#">Contacte</a></li>
                <li><a href="#">Enviaments</a></li>
                <li><a href="#">Devolucions</a></li>
                <li><a href="#">Preguntes freqüents</a></li>
            </ul>
        </div>

        <div class="footer__col">
            <h4 class="footer__subtitle">Legal</h4>
            <ul>
                <li><a href="#">Avis legal</a></li>
                <li><a href="#">Política de privacitat</a></li>
                <li><a href="#">Termes i condicions</a></li>
            </ul>
        </div>

    </div>

    <div class="footer__bottom">
        <p>© {{ date('Y') }} Serrelleria Solidària. Tots els drets reservats.</p>
    </div>
</footer>

</body>
</html>