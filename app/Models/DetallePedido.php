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
}