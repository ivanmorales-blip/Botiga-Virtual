<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Solucion extends Model
{
    protected $table = 'solucions';

    protected $fillable = [
        'descripcio',
        'correu_electronic',
        'telefon',
        'estat'
    ];

    // Relationship: one solucio has many attachments
    public function attachments()
    {
        return $this->hasMany(SolucionsAttachment::class);
    }
}

