<?php

namespace App\DataTransferObjects;

use App\Contracts\DataTransferObjectInterface;

abstract class BaseDTO implements DataTransferObjectInterface
{
    // Abstract method for converting DTO to an array, to be implemented in child classes
    abstract public function toArray(): array;

    // Method to return only specified keys from the DTO
    public function only(array $keys): array
    {
        return array_intersect_key($this->toArray(), array_flip($keys));
    }

    // Method to exclude specified keys from the DTO
    public function except(array $keys): array
    {
        return array_diff_key($this->toArray(), array_flip($keys));
    }

    // Method to merge the existing data with the new input data, giving priority to input data
    public function mergeFrom(array $newData): DataTransferObjectInterface
    {
        $existingData = $this->toArray();
        $mergedData = array_merge($existingData, $newData);

        return static::fromArray($mergedData);
    }
}
