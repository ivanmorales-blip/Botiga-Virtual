<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PackImage extends Model
{
    use HasFactory;

    protected $table = 'pack_images';

    protected $fillable = [
        'pack_id',
        'image_path',
        'order',
    ];

    /**
     * The pack this image belongs to
     */
    public function pack()
    {
        return $this->belongsTo(Pack::class);
    }

    protected $appends = ['url'];

    public function getUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}