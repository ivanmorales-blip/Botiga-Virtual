<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'categoria_id',
        'actiu',
    ];

    public function productes()
    {
        return $this->belongsToMany(
            \App\Models\Producto::class,
            'productos_pack', // pivot table
            'packs_id',       // foreign key on pivot for this model
            'producte_id'     // foreign key on pivot for related model
            
        );
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }

    public function caracteristicas()
    {
        return $this->belongsToMany(Caracteristica::class, 'producto_caracteristica');
    }
}
