@extends('layouts.FrontEndTemplate')
@section('content')
<script>
    window.Laravel = {
        user: @json(Auth::user())
    };
</script>

<div id="app" data-page="profile"></div>
@endsection