<?php

namespace Database\Seeders;

use App\Models\Custom;
use App\Models\CustomProperties;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class CustomPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $array =[
            ['type'=>'branch', 'name'=>'الفرع الاول'],
            ['type'=>'branch', 'name'=>'الفرع الثاني'],
            ['type'=>'status', 'name'=>'متوفر'],
            ['type'=>'status', 'name'=>'متوفر، و استلم'],
            ['type'=>'status', 'name'=>'متوفر، ولغي الأوردر'],
            ['type'=>'status', 'name'=>'متوفر، ولم يَرُد'],
            ['type'=>'status', 'name'=>'متوفر، ومؤجل '],
            ['type'=>'status', 'name'=>'غير متوفر'],
            ['type'=>'status', 'name'=>'غير متوفر، وتم التواصل مع العميل'],

        ];

        foreach ($array as $key => $value) {
            CustomProperties::create($value);
        }
    }
}
