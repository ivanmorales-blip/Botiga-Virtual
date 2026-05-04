<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetallePedido extends Model
{
    protected $table = 'detalles_pedido';

    protected $fillable = [
        'producto_id',
        'pedido_id',
        'pack_id',
        'quantitat',
        'preuindividual'
    ];

    public function pedido()
    {
        return $this->belongsTo(Pedido::class, 'pedido_id');
    }

    public function producto()
    {
    return $this->belongsTo(\App\Models\Producto::class, 'producto_id');
    }

public function pack()
    {
    return $this->belongsTo(\App\Models\Pack::class, 'pack_id');
    }
}