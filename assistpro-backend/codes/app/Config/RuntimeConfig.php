<?php

namespace Config;

class RuntimeConfig
{
    private static array $data = [];

    public static function set(string $key, $value): void
    {
        self::$data[$key] = $value;
    }

    public static function get(string $key, $default = null)
    {
        return self::$data[$key] ?? $default;
    }

    public static function all(): array
    {
        return self::$data;
    }

    public static function clear(): void
    {
        self::$data = [];
    }
}
