@extends('layouts.FrontEndTemplate')

@section('content')
<div id="app" data-page="categoria-productos"></div>
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@endsection