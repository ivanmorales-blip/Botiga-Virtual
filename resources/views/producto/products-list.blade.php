@extends('layouts.app')

@section('content')
<div id="app" data-page="products-list"></div> {{-- mount point for React --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.scss'])
@endsection