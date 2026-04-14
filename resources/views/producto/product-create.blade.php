@extends('layouts.app')

@section('content')
<div id="app" data-page="products-create"></div> {{-- mount point for React --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.scss'])
@endsection