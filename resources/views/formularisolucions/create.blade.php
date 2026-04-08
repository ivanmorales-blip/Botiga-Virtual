@extends('layouts.FrontEndTemplate')

@section('content')
<div id="app" data-page="SolucionCreate"></div> {{-- mount point for React --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@endsection