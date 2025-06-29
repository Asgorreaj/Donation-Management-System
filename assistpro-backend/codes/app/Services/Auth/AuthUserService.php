<?php

namespace App\Services\Auth;

class AuthUserService
{
    private static $user;

    public static function setUser($user): void
    {
        self::$user = $user;
    }

    public static function getUser(): ?object
    {
        return self::$user;
    }

    public static function getSoftwareDate(?string $module = "MIS"): string
    {
        $user = self::getUser();

        if ($module == "AIS") {
            return $user->software_date_ais;
        }

        return $user->software_date_mis;
    }

    public static function getBranchId(): int
    {
        $user = self::getUser();

        return $user->default_branch_id;
    }

    public static function getUserId(): int
    {
        $user = self::getUser();

        return $user->old_user_id;
    }

    public static function getRoleId(): int
    {
        $user = self::getUser();

        return $user->role_id;
    }

    public static function getSoftwareStartDate(): string
    {
        $user = self::getUser();

        return $user->sw_start_date_of_operation;
    }
}

