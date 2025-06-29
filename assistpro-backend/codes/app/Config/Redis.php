<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

class Redis extends BaseConfig
{
    public $default = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 0,
    ];

    public $authentication = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 0,
    ];

    public $session = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 1,
    ];

    public $authorization = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 2,
    ];

    public $branch = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 4,
    ];

    public $mfi_db = [
        'host'     => 'assistpro-redis',
        'port'     => 6380,
        'password' => '',
        'database' => 14,
    ];
}
