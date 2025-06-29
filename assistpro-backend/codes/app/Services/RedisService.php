<?php

namespace App\Services;

use App\Services\Auth\AuthUserService;
use Config\Redis as RedisConfig;
use Config\RuntimeConfig;

class RedisService
{
    private $config;
    private $connections = [];

    public function __construct()
    {
        $this->config = new RedisConfig();

        // Initialize connections based on the configuration
        $this->connections['default'] = $this->createConnection($this->config->default);
        $this->connections['authentication'] = $this->createConnection($this->config->authentication);
        $this->connections['session'] = $this->createConnection($this->config->session);
        $this->connections['authorization'] = $this->createConnection($this->config->authorization);
        $this->connections['branch'] = $this->createConnection($this->config->branch);
        $this->connections['mfi_db'] = $this->createConnection($this->config->mfi_db);
    }

    private function getSiteName(): string
    {
        return RuntimeConfig::get('site_name', 'default_site'); // Fallback to 'default_site'
    }

    private function getAuthToken(): string
    {
        return str_replace('Bearer ', '', RuntimeConfig::get('authorization', '')); // Fallback to an empty token
    }

    private function getAuthUserKey(): string
    {
        $siteName = $this->getSiteName();
        $authToken = $this->getAuthToken();

        return "$siteName:$authToken";
    }

    private function createConnection(array $config)
    {
        $redis = new \Redis();
        $redis->connect($config['host'], $config['port']);
        if (!empty($config['password'])) {
            $redis->auth($config['password']);
        }
        $redis->select($config['database']);

        return $redis;
    }

    public function getConnection(string $name = 'default')
    {
        if (isset($this->connections[$name])) {
            return $this->connections[$name];
        }

        throw new \Exception("Redis connection '{$name}' not configured.");
    }

    /**
     * Dynamically fetch database connection information based on the site name.
     */
    public function dynamicDbConnection()
    {
        $dbConnection = $this->getConnection('mfi_db');
        $dbInfo = $dbConnection->hGet('db', $this->getSiteName());

        if (!$dbInfo) {
            throw new \Exception("Database information not found for site '{$this->getSiteName()}'.");
        }

        return json_decode($dbInfo, true); // Assume the DB info is stored as JSON
    }

    public function validateAuthToken(): bool
    {
        $authConnection = $this->getConnection('authentication');

        return $authConnection->exists($this->getAuthUserKey());
    }

    public function getAuthUserInfo(): string
    {
        $authConnection = $this->getConnection('authentication');

        return $authConnection->get($this->getAuthUserKey());
    }

    /**
     * Authorize a request by validating permissions stored in Redis.
     */
    public function authorizeRequest(string $action): bool
    {
        $authConnection = $this->getConnection('authorization');
        $roleId = AuthUserService::getRoleId();
        $permissionsKey = "{$this->getSiteName()}:{$roleId}";

        return $authConnection->sIsMember($permissionsKey, $action);
    }

    /**
     * Save data to session Redis for the specific site.
     */
    public function saveToSession(string $key, $value): void
    {
        $sessionConnection = $this->getConnection('session');
        $sessionKey = "{$this->getSiteName()}:{$key}";
        $sessionConnection->set($sessionKey, json_encode($value));
    }

    /**
     * Retrieve data from session Redis for the specific site.
     */
    public function getFromSession(string $key)
    {
        $sessionConnection = $this->getConnection('session');
        $sessionKey = "{$this->getSiteName()}:{$key}";
        $value = $sessionConnection->get($sessionKey);

        return json_decode($value, true);
    }

    /**
     * Example: Fetch branch data for a specific site.
     */
    public function getBranch(int $branchId = null): array
    {
        $dbConnection = $this->getConnection('branch');

        if ($branchId) {
            $branchData = $dbConnection->hGet($this->getSiteName(), $branchId);
            return $branchData ? json_decode($branchData, true) : [];
        }

        $branches = $dbConnection->hGetAll($this->getSiteName());
        $result = [];
        foreach ($branches as $id => $branchData) {
            $result[$id] = json_decode($branchData, true);
        }

        return $result;
    }

    /**
     * Example: Fetch user data for a specific site.
     */
    public function getUser(int $userId = null): array
    {
        $dbConnection = $this->getConnection('session');

        if ($userId) {
            $userData = $dbConnection->hGet($this->getSiteName(), $userId);
            return $userData ? json_decode($userData, true) : [];
        }

        $users = $dbConnection->hGetAll($this->getSiteName());
        $result = [];
        foreach ($users as $id => $userData) {
            $result[$id] = json_decode($userData, true);
        }

        return $result;
    }
}
