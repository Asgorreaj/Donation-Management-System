<?php

namespace App\Filters;

use App\Services\RedisService;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Database;
use Config\RuntimeConfig;
use Config\Services;

class DatabaseFilter implements FilterInterface
{
    use ResponseTrait;

    protected RedisService $redisService;

    public function __construct()
    {
        $this->redisService = service('redisService');
    }

    public function before(RequestInterface $request, $arguments = null)
    {
        $siteName = RuntimeConfig::get('site_name', 'default_site');

        $dbInfo = $this->redisService->dynamicDbConnection();

        if ($dbInfo) {
            Database::connect($dbInfo);
        } else {
            // Return a 404 Not Found response if the database configuration is not found
            return Services::response()
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status' => 'error',
                    'message' => "Database configuration not found for Site-Name: $siteName"
                ]);
        }

        return true;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // No action needed after the request
    }
}
