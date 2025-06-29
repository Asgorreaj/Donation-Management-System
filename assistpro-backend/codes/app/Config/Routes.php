<?php
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function ($routes) {

        // Add this 👇 outside 'v1' group
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    
    $routes->group('v1', function ($routes) {
        $routes->options('(:any)', static function () {});

        $routes->group('api/v1/core-service', ['namespace' => 'App\Controllers\Api'], function ($routes) {
        $routes->get('global_data/index1', 'GlobalDataController::index1');
        });

        
        // Student routes
        $routes->get('students/all', 'StudentController::getAll');
        $routes->resource('students', ['controller' => 'StudentController']);
        
        // Donation routes
        $routes->resource('donations', ['controller' => 'DonationController']);

        // Report routes
        $routes->get('report/donations', 'ReportController::donationReport');
        $routes->get('report/donations/export', 'ReportController::exportDonationReport');
    });
});