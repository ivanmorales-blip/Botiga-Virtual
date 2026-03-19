@extends('layouts.app')

@section('content')
<div id="app"></div>

{{-- Mount React --}}
@vite('resources/js/app.jsx')
@endsection