<!DOCTYPE html>
<html lang="ca">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SERRELLERIA SOLIDÀRIA</title>

    @viteReactRefresh
    @vite(['resources/js/app.jsx'])
</head>

<body class="app">
    <a href="#main-content" class="skip-link">
        Saltar al contingut principal
    </a>

    <script src="//unpkg.com/alpinejs" defer></script>

    <header class="header">

        <div class="header__left">
            <a href="{{ route('home') }}" class="header__title">
                SERRELLERIA SOLIDÀRIA
            </a>
        </div>

        <nav class="header__right" aria-label="Navegació principal">

            <a href="{{ route('categorias.productos') }}" class="btn btn--secondary"
                aria-current="{{ request()->routeIs('categorias.productos') ? 'page' : 'false' }}">
                Productes i Packs
            </a>

            <a href="{{ route('solucions.create') }}" class="btn btn--primary" aria-current="{{ request()->routeIs('solucions.create') ? 'page' : 'false' }}">
                Solucions Personalitzades
            </a>

            <div id="cart-counter" role="status" aria-label="Carret de compra" aria-live="polite"></div>

            @auth

                @if(Auth::user()->admin)
                    <a href="{{ route('admin.dashboard') }}" class="btn btn--secondary header__login">
                        {{ Auth::user()->nombre }}
                    </a>
                @else
                    <a href="{{ route('profile.edit') }}" class="btn btn--secondary header__login">
                        {{ Auth::user()->nombre }}
                    </a>
                @endif

                <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit" class="btn btn--secondary header__login" aria-label="Tancar la sessió">
                        Log out
                    </button>
                </form>

            @else

                <a href="{{ route('login') }}" class="btn btn--secondary header__login" aria-current="{{ request()->routeIs('login') ? 'page' : 'false' }}">
                    Iniciar Sessió
                </a>

            @endauth

        </nav>

    </header>

    <main id="main-content" class="main">
        @yield('content')
    </main>

    <footer class="footer" aria-label="Peu de pàgina">

        <div class="footer__container">

            <div class="footer__col">
                <h3 class="footer__title">Serrelleria Solidària</h3>
                <p class="footer__text">
                    Solucions professionals en serralleria amb compromís social.
                </p>
            </div>

            <div class="footer__col">
                <nav aria-label="Botiga">
                    <h4 class="footer__subtitle">Botiga</h4>
                    <ul>
                        <li><a href="#">Productes</a></li>
                        <li><a href="#">Categories</a></li>
                        <li><a href="#">Packs</a></li>
                    </ul>
                </nav>
            </div>

            <div class="footer__col">
                <nav aria-label="Ajuda">
                    <h4 class="footer__subtitle">Ajuda</h4>
                    <ul>
                        <li><a href="#">Contacte</a></li>
                        <li><a href="#">Enviaments</a></li>
                        <li><a href="#">Devolucions</a></li>
                        <li><a href="#">Preguntes freqüents</a></li>
                    </ul>
                </nav>
            </div>

            <div class="footer__col">
                <nav aria-label="Legal">
                    <h4 class="footer__subtitle">Legal</h4>
                    <ul>
                        <li><a href="#">Avís legal</a></li>
                        <li><a href="#">Política de privacitat</a></li>
                        <li><a href="#">Termes i condicions</a></li>
                    </ul>
                </nav>
            </div>

        </div>

        <div class="footer__bottom">
            <small>
                © {{ date('Y') }} Serrelleria Solidària. Tots els drets reservats.
            </small>
        </div>

    </footer>

</body>
</html>