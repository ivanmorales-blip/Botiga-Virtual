<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SolucionsAttachment extends Model
{
    protected $table = 'solucions_attachments';

    protected $fillable = [
        'nom',
        'path',
        'tipus_arxiu',
        'tamany',
        'solucion_id'
    ];

    public function solucion()
    {
        return $this->belongsTo(Solucion::class, 'solucion_id');
    }
}