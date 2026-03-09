<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Caracteristica extends Model
{
    protected $table = 'caracteristicas';

    protected $fillable = [
        'tipo_id',
        'descripcion',
    ];

    public function productos()
    {
        return $this->belongsToMany(Producto::class, 'producto_caracteristica');
    }
}
