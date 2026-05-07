<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;

class Configuracio extends Model {

    protected $table = 'configuracions';
    protected $fillable = ['clau', 'valor', 'descripcio'];
}