<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    protected $table = 'caracteristicas';

    protected $fillable = [
        'tipo_id',
        'descripcio',
    ];

    public function tipo()
    {
        return $this->belongsTo(TipoCaracteristica::class, 'tipo_id');
    }

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'asignacio_caracteristiques', 'id_caracteristica', 'id_producto');
    }
}