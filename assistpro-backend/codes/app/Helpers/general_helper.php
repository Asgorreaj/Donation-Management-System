<?php

if (!function_exists('getInputData')) {
    /**
     * Fetch input data from any source (GET, POST, JSON).
     *
     * @param \CodeIgniter\HTTP\IncomingRequest $request
     * @return array
     */
    function getInputData(\CodeIgniter\HTTP\IncomingRequest $request): array
    {
        $inputData = [];

        // Merge form-data or x-www-form-urlencoded
        $postData = $request->getPost();
        if (!empty($postData)) {
            $inputData = array_merge($inputData, $postData);
        }

        // Merge JSON data
        $jsonData = $request->getJSON(true);
        if (!empty($jsonData)) {
            $inputData = array_merge($inputData, $jsonData);
        }

        // Merge query string data
        $queryData = $request->getGet();
        if (!empty($queryData)) {
            $inputData = array_merge($inputData, $queryData);
        }

        return $inputData;
    }
}
