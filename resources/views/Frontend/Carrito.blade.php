@extends('layouts.FrontEndTemplate')
<head>
    <meta name="csrf-token" content="{{ csrf_token() }}">
</head>
<script>
    window.userId = @json(session('user_id'));
</script>
@section('content')
<div id="app" data-page="cart"></div>
@endsection