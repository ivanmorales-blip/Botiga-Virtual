@extends('layouts.app')

@section('content')
<div id="app" data-page="products-list"></div> {{-- mount point for React --}}
@viteReactRefresh
    @vite(['resources/css/app.scss', 'resources/js/app.jsx'])
@endsection