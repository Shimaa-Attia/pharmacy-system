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
            // ['type'=>'ruleType', 'name'=>'الطيارين'],
            // ['type'=>'ruleType', 'name'=>'الإدارة'],
            // ['type'=>'ruleType', 'name'=>'العملاء'],
            // ['type'=>'ruleType', 'name'=>'الزملاء'],
            // ['type'=>'notificationStatus', 'name'=>'تم تنفيذه'],
            // ['type'=>'notificationStatus', 'name'=>'لم ينفذ'],
            // ['type'=>'inventoryStatus', 'name'=>'تم جرده'],
            // ['type'=>'inventoryStatus', 'name'=>'لم يتم جرده'],

            ['type'=>'policieType', 'name'=>'المبيعات'],
            ['type'=>'policieType', 'name'=>'المرتجعات'],
            ['type'=>'policieType', 'name'=>'الصيادلة'],
            ['type'=>'policieType', 'name'=>'التعامل مع العملاء'],
        ];

        foreach ($array as $key => $value) {
            CustomProperties::create($value);
        }
    }
}
