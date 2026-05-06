<?php

namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class ProductoImatge extends Model
{
   protected $table = 'imatges'; // importante porque tu tabla se llama imatges


   protected $fillable = [
       'nom',
       'path',
       'producto_id'
   ];


   public function producto()
   {
       return $this->belongsTo(Producto::class);
   }
}
