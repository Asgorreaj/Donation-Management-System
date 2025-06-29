<?php

namespace App\Validation;

use Config\Database;

class CustomRules
{
    /**
     * Custom exists rule
     *
     * Checks if the provided value exists in a specific column of a table in the database.
     *
     * @param string $value The value of the field being validated (e.g., user input)
     * @param string $fields The table and column to check in the format "table.column"
     * @param array $data The entire input data, which can be used to reference other fields
     * @return bool Returns true if the value exists in the specified table and column, otherwise false
     */
    public function exists(string $value, string $fields, array $data = []): bool
    {
        // Split the parameter into table and column
        [$table, $column] = explode('.', $fields);
        $db = Database::connect();

        // Query the database to check for the existence
        return $db->table($table)
                ->where($column, $value)
                ->countAllResults() > 0;
    }

    /**
     * Custom required_if rule
     *
     * @param string|null $value The value of the field being validated (can be null if not supplied)
     * @param string $params The condition in the format "other_field,value"
     * @param array $data The entire input data
     * @return bool
     */
    public function required_if(?string $value, string $params, array $data = [], string &$error = null, string $field = ''): bool
    {
        [$otherField, $requiredValue] = explode(',', $params);

        // Check if the other field exists and matches the required value
        if (isset($data[$otherField]) && $data[$otherField] === $requiredValue) {
            if (empty($value)) {
                // Replace placeholders in the message dynamically
                $error = strtr(
                    lang('Validation.required_if'),
                    [
                        '{field}' => $field,
                        '{other}' => $otherField,
                        '{value}' => $requiredValue,
                    ]
                );

                return false;
            }
        }

        return true;
    }
}

