<?php namespace App\Controllers\Api;

use App\Controllers\BaseController;
use App\Models\Users;
use CodeIgniter\API\ResponseTrait;
use CodeIgniter\HTTP\ResponseInterface;
use Random\RandomException;
use Redis;
use RedisException;
use ReflectionException;

class AuthController extends BaseController
{
    use ResponseTrait;

    private Users $userModel;
    private Redis $redis;

    public function __construct()
    {
        $this->userModel = new Users();
        $this->redis = new Redis();
    }

    /**
     * Login view...
     * @return string
     * [GET] /login
     */
    public function loginView(): string
    {
        return view('auth/login');
    }

    /**
     * Log the user in...
     * @return ResponseInterface
     * [POST] /login
     * @throws RandomException
     * @throws RedisException
     */
    public function login(): ResponseInterface
    {
        $username = $this->request->getPost('username');
        $password = $this->request->getPost('password');

        // Validate user credentials
        $user = $this->userModel->where('username', $username)->first();

        if (!$user) {
            return $this->failUnauthorized("Username not found.");
        }

        if ($this->isUserLoggedIn($user['id'])) {
            return $this->fail('User already logged in!');
        }

        if (password_verify($password, $user['password'])) {
            // Generate token
            $token = bin2hex(random_bytes(64));
            $expiry = 3600; // 1 hour

            // Save token to Redis
            $redisHost = getenv('REDIS_TLS') === 'true' ? 'tls://' . (getenv('REDIS_HOST') ?: 'assistpro-redis') : (getenv('REDIS_HOST') ?: 'assistpro-redis');
        $this->redis->connect($redisHost, (int)(getenv('REDIS_PORT') ?: 6379));
        if (getenv('REDIS_PASSWORD')) { $this->redis->auth(getenv('REDIS_PASSWORD')); }
            $this->redis->setex("Bearer:{$token}", $expiry, json_encode([
                'user_id' => $user['id'],
                'username' => $user['username'],
                'email' => $user['email']
            ]));

            return $this->respond([
                'status' => ResponseInterface::HTTP_OK,
                'token' => $token,
                'expires_in' => $expiry
            ]);
        }

        return $this->failUnauthorized("Invalid password.");
    }

    /**
     * Check if the user is already logged in with a valid token.
     * @return bool|string
     */
        public function isUserLoggedIn(): bool|string
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $authHeader); // remove prefix

        $redisHost = getenv('REDIS_TLS') === 'true' ? 'tls://' . (getenv('REDIS_HOST') ?: 'assistpro-redis') : (getenv('REDIS_HOST') ?: 'assistpro-redis');
        $this->redis->connect($redisHost, (int)(getenv('REDIS_PORT') ?: 6379));
        if (getenv('REDIS_PASSWORD')) { $this->redis->auth(getenv('REDIS_PASSWORD')); }
        $session = $this->redis->get("Bearer:{$token}");

        if ($session) {
            return $token; // Token is valid
        }

        return false; // No valid token in Redis
    }


    /**
     * Log the user out...
     * @return ResponseInterface
     * [GET] /logout
     */
    public function loggedOut()
    {
        return $this->fail('User not logged in. Please log in');
    }

    /**
     * Register view
     * @return string
     */
    public function registerView()
    {
        return view('auth/register');
    }

    /**
     * Register a new user...
     * @return ResponseInterface
     * @throws ReflectionException
     */
    public function register(): ResponseInterface
    {
        $postedData = [
            'username' => $this->request->getPost('username'),
            'email' => $this->request->getPost('email'),
            'password' => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT)
        ];

        if ($this->userModel->insert($postedData)) {
            return $this->respond([
                'status' => ResponseInterface::HTTP_OK,
                'status_type' => 'success',
                'message' => 'User registered successfully!',
            ]);
        }

        return $this->respond([
            'status' => ResponseInterface::HTTP_NOT_FOUND,
            'status_type' => 'error',
            'message' => 'Failed to register user!'
        ]);
    }

    /**
     * Return the currently authenticated user's basic info.
     * Reads the session stored in Redis under the bearer token.
     * @return ResponseInterface
     */
    public function me(): ResponseInterface
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $authHeader);

        $redisHost = getenv('REDIS_TLS') === 'true' ? 'tls://' . (getenv('REDIS_HOST') ?: 'assistpro-redis') : (getenv('REDIS_HOST') ?: 'assistpro-redis');
        $this->redis->connect($redisHost, (int)(getenv('REDIS_PORT') ?: 6379));
        if (getenv('REDIS_PASSWORD')) { $this->redis->auth(getenv('REDIS_PASSWORD')); }
        $session = $this->redis->get("Bearer:{$token}");

        if (!$session) {
            return $this->failUnauthorized('Session expired. Please log in again.');
        }

        $data = json_decode($session, true);

        return $this->respond([
            'status'   => ResponseInterface::HTTP_OK,
            'username' => $data['username'] ?? null,
            'email'    => $data['email'] ?? null,
        ]);
    }

    /**
     * Change the currently authenticated user's password.
     * @return ResponseInterface
     */
    public function changePassword(): ResponseInterface
    {
        $authHeader = $this->request->getHeaderLine('Authorization');
        $token = str_replace('Bearer ', '', $authHeader);

        $redisHost = getenv('REDIS_TLS') === 'true' ? 'tls://' . (getenv('REDIS_HOST') ?: 'assistpro-redis') : (getenv('REDIS_HOST') ?: 'assistpro-redis');
        $this->redis->connect($redisHost, (int)(getenv('REDIS_PORT') ?: 6379));
        if (getenv('REDIS_PASSWORD')) { $this->redis->auth(getenv('REDIS_PASSWORD')); }
        $session = $this->redis->get("Bearer:{$token}");

        if (!$session) {
            return $this->failUnauthorized('Session expired. Please log in again.');
        }

        $data = json_decode($session, true);
        $user = $this->userModel->find($data['user_id']);

        if (!$user) {
            return $this->failNotFound('User not found.');
        }

        $currentPassword = $this->request->getPost('current_password');
        $newPassword      = $this->request->getPost('new_password');

        if (!password_verify($currentPassword, $user['password'])) {
            return $this->failUnauthorized('Current password is incorrect.');
        }

        if (strlen((string) $newPassword) < 6) {
            return $this->fail('New password must be at least 6 characters.', 400);
        }

        $this->userModel->update($data['user_id'], [
            'password' => password_hash($newPassword, PASSWORD_DEFAULT),
        ]);

        return $this->respond([
            'status'  => ResponseInterface::HTTP_OK,
            'message' => 'Password updated successfully.',
        ]);
    }

    /**
     * Public, no-auth-required aggregate stats for the login page marketing panel.
     * Deliberately exposes only counts/sums - no personal/sensitive data.
     */
    public function publicStats(): ResponseInterface
    {
        $db = db_connect();

        $studentCount = $db->table('students')->countAllResults();
        $branchCount  = $db->table('branches')->countAllResults();
        $totalRaised  = $db->table('donations')->selectSum('amount')->get()->getRow('amount') ?? 0;

        return $this->respond([
            'students'     => (int) $studentCount,
            'branches'     => (int) $branchCount,
            'total_raised' => (float) $totalRaised,
        ]);
    }
}