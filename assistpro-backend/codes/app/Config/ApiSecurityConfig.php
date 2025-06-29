<?php

namespace App\Config;

use CodeIgniter\Config\BaseConfig;

class ApiSecurityConfig extends BaseConfig
{
    /**
     * The default route to protect
     *
     * @var string
     */
    public string $defaultRoute = 'api';

    /**
     * The default route exclusions
     *
     * @var array
     */
    public array $defaultExclusions = ['','login', 'register'];

    /**
     * The default token expiration time
     *
     * @var int
     */
    public int $tokenExpiration = 3600;

    /**
     * The default token prefix
     *
     * @var string
     */
    public string $tokenPrefix = 'Bearer';

    /**
     * The default token header
     *
     * @var string
     */
    public string $acceptHeader = 'application/json';

    /**
     * The default content type header
     *
     * @var string
     */
    public string $contentTypeHeader = 'application/json';

    /**
     * The default accept encoding header
     *
     * @var array
     */
    public array $acceptEncodingHeader = ['gzip', 'deflate', 'br'];

    /**
     * The default accept language header
     *
     * @var array
     */
    public array $acceptLanguageHeader = ['en-US', 'en', 'es', 'bn'];

    /**
     * The default allowed methods
     *
     * @var array
     */
    public array $allowedMethods = ['GET', 'POST', 'PUT', 'DELETE', 'AJAX'];

    /**
     * The default allowed origins
     *
     * @var array
     */
    public array $allowedOrigins = ['*'];

    /**
     * The default allowed headers
     *
     * @var array
     */
    public array $allowedHeaders = ['Authorization', 'Content-Type', 'Accept', 'Origin', 'X-Requested-With'];

    /**
     * The default allowed cookies
     *
     * @var array
     */
    public array $allowedBrowsers = ['Chrome', 'Firefox', 'Safari', 'Opera', 'Edge'];

    /**
     * The default allowed OS
     *
     * @var array
     */
    public array $allowedOS = ['Windows', 'Linux', 'Mac', 'Android', 'iOS'];

    /**
     * The default allowed devices
     *
     * @var array
     */
    public array $allowedIPs = ['*'];

    /**
     * The default allowed devices
     *
     * @var bool
     */
    public bool $isCheckUserAgent = false;

    /**
     * The auth service will check request origin
     *
     * @var bool
     */
    public bool $isCheckOrigin = false;

    /**
     * The auth service will check request OS
     *
     * @var bool
     */
    public bool $isCheckOs = false;

    /**
     * The auth service will check request Method
     *
     * @var bool
     */
    public bool $isCheckMethod = false;


}