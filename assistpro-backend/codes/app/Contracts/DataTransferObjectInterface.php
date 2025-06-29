<?php

namespace App\Contracts;

interface DataTransferObjectInterface
{
    public static function fromArray(array $data): self;

    public function toArray(): array;

    public function only(array $keys): array;

    public function except(array $keys): array;

    public function mergeFrom(array $newData): self;
}

