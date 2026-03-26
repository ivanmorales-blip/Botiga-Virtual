@extends('layouts.app')

@section('content')
<div id="app" data-page="Solucionlist"></div> {{-- mount point for React --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@endsection