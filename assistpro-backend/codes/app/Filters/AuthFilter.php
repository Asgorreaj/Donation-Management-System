<?php

namespace App\Filters;

use CodeIgniter\API\ResponseTrait;
use CodeIgniter\Filters\FilterInterface;
use CodeIgniter\HTTP\RequestInterface;
use CodeIgniter\HTTP\Response;
use CodeIgniter\HTTP\ResponseInterface;
use Config\Services;

class AuthFilter implements FilterInterface
{
    use ResponseTrait;

    public function before(RequestInterface $request, $arguments = null)
    {
        // Extract headers
        $siteName = $request->getHeaderLine('Site-Name');
        $authHeader = $request->getHeaderLine('Authorization');

        // Check Site-Name
        if (!$siteName) {
            return Services::response()
                ->setStatusCode(Response::HTTP_BAD_REQUEST)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Site-Name header is missing from the request',
                ]);
        }

        // Check Authorization
        if (!$authHeader) {
            return Services::response()
                ->setStatusCode(Response::HTTP_UNAUTHORIZED)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Authorization header is missing'
                ]);
        }

        // Clean token: remove "Bearer " prefix
        $token = str_replace('Bearer ', '', $authHeader);

        // Connect to Redis
        $redis = new \Redis();
        $redis->connect('assistpro-redis', 6379);

        // Check if token exists in Redis
        $session = $redis->get("Bearer:{$token}");

        if (!$session) {
            return Services::response()
                ->setStatusCode(Response::HTTP_FORBIDDEN)
                ->setJSON([
                    'status' => 'error',
                    'message' => 'Invalid authorization token'
                ]);
        }

        // Store context if needed elsewhere in app
        config('RuntimeConfig')->set('site_name', $siteName);
        config('RuntimeConfig')->set('authorization', $authHeader);

        return true;
    }

    public function after(RequestInterface $request, ResponseInterface $response, $arguments = null)
    {
        // Optional post-processing
    }

    // private function setRuntimeConfig(string $siteName, string $authToken): void
    // {
    //     config('RuntimeConfig')->set('site_name', $siteName);
    //     config('RuntimeConfig')->set('authorization', $authToken);
    // }
}

    

