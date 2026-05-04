@extends('layouts.app')

@section('content')
<div id="app" data-page="pedidos-gestion"></div> 
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.scss'])
@endsection