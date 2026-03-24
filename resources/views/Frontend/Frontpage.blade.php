@extends('layouts.app')

@section('content')
<div id="app" data-page="FrontPage"></div> {{-- tells React which component to load --}}
@viteReactRefresh
@vite(['resources/js/app.jsx', 'resources/css/app.css'])
@endsection