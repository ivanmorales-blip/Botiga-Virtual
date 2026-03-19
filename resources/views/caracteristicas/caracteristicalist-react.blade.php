@extends('layouts.app')

@section('content')
<div id="app" data-page="caracteristicas-list"></div> {{-- mount point for React --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@endsection