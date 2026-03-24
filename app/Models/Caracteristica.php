<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    protected $table = 'caracteristicas';

    protected $fillable = [
        'tipo_id',
        'descripcio',
        'estat'
    ];

    public function tipo()
    {
        return $this->belongsTo(TipoCaracteristica::class, 'tipo_id');
    }

    public function productos()
    {
        return $this->belongsToMany(
            \App\Models\Producto::class,
            'asignacion_caracteristicas', // ✅ exact table name
            'caracteristica_id',          // ✅ FK to caracteristicas
            'producto_id'                 // ✅ FK to productos
        )->withTimestamps();
    }

}