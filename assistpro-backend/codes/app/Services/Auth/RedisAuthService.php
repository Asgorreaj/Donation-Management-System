<?php

namespace App\Services\Auth;

use App\Contracts\AuthInterface;
use App\Services\RedisService;
use App\Services\SessionService;

class RedisAuthService implements AuthInterface
{
    private const AUTH_USER_INFO_SEGMENTS = [
        'username',
        'roleId',
        'branchId',
        'userId'
    ];

    private const BRANCH_REQUIRED_KEYS = [
        'software_date_ais',
        'software_date_mis',
        'sw_start_date_of_operation',
        'code',
    ];

    private RedisService $redisService;

    public function __construct()
    {
        $this->redisService = service('redisService');
    }

    public function validate(): bool
    {
        if (!$this->redisService->validateAuthToken()) {
            return false;
        }

        $authUserInfo = $this->parseAuthUserInfo($this->redisService->getAuthUserInfo());

        if (!$authUserInfo) {
            log_message('error', 'Invalid auth user info format');
            return false;
        }

        $branchInfo = $this->redisService->getBranch($authUserInfo['branchId']);
        $authUser = $this->redisService->getUser($authUserInfo['userId']);

        if ($this->isBranchInfoValid($branchInfo)) {
            $this->setSession($authUser, $branchInfo);
            return true;
        }

        return false;
    }

    private function parseAuthUserInfo(string $authUserInfo): ?array
    {
        $segments = explode('__', $authUserInfo, 4);

        if (count($segments) !== count(self::AUTH_USER_INFO_SEGMENTS)) {
            return null;
        }

        return array_combine(self::AUTH_USER_INFO_SEGMENTS, $segments);
    }

    private function isBranchInfoValid(array $branchInfo): bool
    {
        return $branchInfo && empty(array_diff_key(array_flip(self::BRANCH_REQUIRED_KEYS), $branchInfo));
    }

    private function setSession(array $authUser, array $branchInfo): void
    {
        $formattedBranchInfo = array_intersect_key($branchInfo, array_flip([
            'software_date_ais',
            'software_date_mis',
            'sw_start_date_of_operation',
            'is_head_office',
            'branch_type',
            'code',
        ]));

        $userData = array_merge($authUser, $formattedBranchInfo);
        SessionService::setUserData($userData, $branchInfo);
    }
}
