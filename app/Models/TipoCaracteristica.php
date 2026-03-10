<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class TipoCaracteristica extends Model
{
    protected $table = 'tipo_caracteristicas';

    protected $fillable = [
        'descripcion',
        'tipo',
    ];

    public function caracteristicas()
    {
        return $this->hasMany(Caracteristica::class, 'tipo_id');
    }
}