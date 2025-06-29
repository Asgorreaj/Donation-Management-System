<?php

namespace Config;

use App\Services\Auth\AuthService;
use App\Services\Auth\AuthUserService;
use App\Services\Auth\RedisAuthService;
use App\Services\RedisService;
use CodeIgniter\Config\BaseService;

/**
 * Services Configuration file.
 *
 * Services are simply other classes/libraries that the system uses
 * to do its job. This is used by CodeIgniter to allow the core of the
 * framework to be swapped out easily without affecting the usage within
 * the rest of your application.
 *
 * This file holds any application-specific services, or service overrides
 * that you might need. An example has been included with the general
 * method format you should use for your service methods. For more examples,
 * see the core Services file at system/Config/Services.php.
 */
class Services extends BaseService
{
    /**
     * @param bool $getShared
     * @return object
     */
    public static function authService(bool $getShared = true): object
    {
        if ($getShared) {
            return static::getSharedInstance('authService');
        }

        return new AuthService(new RedisAuthService());
    }

    public static function authUserService($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('authUserService');
        }

        return new AuthUserService();
    }

    public static function redisService($getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('redisService');
        }

        return new RedisService();
    }

    public static function studentRepository(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('studentRepository');
        }

        return new \App\Repositories\StudentRepository();
    }

    public static function studentService(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('studentService');
        }

        return new \App\Services\StudentService(service('studentRepository'));
    }

    public static function studentValidator(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('studentValidator');
        }

        return new \App\Validators\StudentValidator(service('validation'));
    }

    public static function studentResource(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('studentResource');
        }

        return new \App\Resources\StudentResource();
    }

    public static function donationRepository(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('donationRepository');
        }

        return new \App\Repositories\DonationRepository();
    }

    public static function donationService(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('donationService');
        }

        return new \App\Services\DonationService(service('donationRepository'));
    }

    public static function donationValidator(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('donationValidator');
        }

        return new \App\Validators\DonationValidator(service('validation'));
    }

    public static function donationResource(bool $getShared = true)
    {
        if ($getShared) {
            return static::getSharedInstance('donationResource');
        }

        return new \App\Resources\DonationResource();
    }
}
