<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Pack extends Model
{
    use HasFactory;

    protected $table = 'packs';

    protected $fillable = [
        'nom',
        'Descripcio',
        'preu'
    ];

    public function productes()
    {
        return $this->belongsToMany(
            Producto::class,
            'productos_pack',
            'packs_id',
            'producte_id'
        )->withPivot('quantity')->withTimestamps();
    }

public function images()
{
    return $this->hasMany(PackImage::class)->orderBy('order');
}
}