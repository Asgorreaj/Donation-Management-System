<?php

namespace Config;

use CodeIgniter\Config\BaseConfig;

/**
 * Cross-Origin Resource Sharing (CORS) Configuration
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
 */
class Cors extends BaseConfig
{
    /**
     * The default CORS configuration.
     *
     * @var array{
     *      allowedOrigins: list<string>,
     *      allowedOriginsPatterns: list<string>,
     *      supportsCredentials: bool,
     *      allowedHeaders: list<string>,
     *      exposedHeaders: list<string>,
     *      allowedMethods: list<string>,
     *      maxAge: int,
     *  }
     */
    public array $default = [
        /**
         * Origins for the `Access-Control-Allow-Origin` header.
         */
        'allowedOrigins' => [
            'http://192.168.0.216:3001',
            'http://localhost:3001',
            'http://192.168.0.216:3000',
            'http://localhost:3000',
        ],

        /**
         * Regex patterns for flexible matching.
         * This allows all origins, useful for dev testing.
         */
        'allowedOriginsPatterns' => [
            '.*'
        ],

        /**
         * Allow credentials like cookies and Authorization headers.
         */
        'supportsCredentials' => true,

        /**
         * Allowed headers sent by client.
         */
        'allowedHeaders' => [
            'Authorization',
            'Content-Type',
            'X-Requested-With',
            'Accept',
            'Origin',
            'Site-Name',
            'X-Custom-Header'
        ],

        /**
         * Headers exposed to the client (optional).
         */
        'exposedHeaders' => [],

        /**
         * Allowed HTTP methods.
         */
        'allowedMethods' => [
            'GET',
            'POST',
            'PUT',
            'PATCH',
            'DELETE',
            'OPTIONS'
        ],

        /**
         * Cache time (in seconds) for preflight requests.
         */
        'maxAge' => 7200,
    ];
}
