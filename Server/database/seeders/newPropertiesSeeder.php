<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\CustomProperties;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class newPropertiesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $array =[
            ['type'=>'ruleType', 'name'=>'الإدارة'],
            ['type'=>'ruleType', 'name'=>'العملاء'],
            ['type'=>'ruleType', 'name'=>'الزملاء'],
            ['type'=>'notificationStatus', 'name'=>'تم تنفيذه'],
            ['type'=>'notificationStatus', 'name'=>'لم ينفذ'],
            ['type'=>'inventoryStatus', 'name'=>'تم جرده'],
            ['type'=>'inventoryStatus', 'name'=>'لم يتم جرده'],

        ];

        foreach ($array as $key => $value) {
            CustomProperties::create($value);
        }
    }
}
