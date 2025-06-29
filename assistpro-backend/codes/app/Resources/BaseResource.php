<?php

namespace App\Resources;

use CodeIgniter\Pager\Pager;

abstract class BaseResource
{
    /**
     * Transform a single data item (e.g., a model) into a response array.
     *
     * @param mixed $data The data to be transformed.
     * @return array The transformed data.
     */
    abstract public function toArray(mixed $data): array;

    /**
     * Format the response based on transformed data.
     *
     * @param mixed $data The data to be transformed and returned.
     * @param int $status The HTTP status code (default 200).
     * @return array
     */
    public function respondResource(mixed $data, int $status = 200)
    {
        $transformedData = $data
            ? $this->toArray($data)
            : null;

        return [
            'status'  => $status === 200 ? 'success' : 'error',
            'message' => $status === 200 ? 'Request was successful' : 'There was an error',
            'data'    => $transformedData
        ];
    }

    /**
     * Format the response for a collection of data.
     * This is similar to Laravel's Resource::collection() method.
     *
     * @param array $data A collection of data to be transformed.
     * @param int $status The HTTP status code (default 200).
     * @return array
     */
    public function collection(array $data, int $status = 200)
    {
        // Transform each item in the collection
        $transformedData = array_map([$this, 'toArray'], array_map(fn($datum) => $datum->toArray(), $data));

        // Simply return the transformed data
        return [
            'status'  => $status === 200 ? 'success' : 'error',
            'message' => $status === 200 ? 'Request was successful' : 'There was an error',
            'data'    => $transformedData
        ];
    }

    /**
     * Format a paginated response.
     *
     * @param array $data The collection of data items.
     * @param Pager $pager The pagination metadata.
     * @param int $status The HTTP status code (default 200).
     * @return array
     */
    public function paginatedCollection(array $data, Pager $pager, int $status = 200): array
    {
        $responseData = $this->collection($data);
        $responseData['pagination'] = $pager->getDetails();

        return $responseData;
    }
}
