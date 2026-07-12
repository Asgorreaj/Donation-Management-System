<?php
use CodeIgniter\Router\RouteCollection;

/**
 * @var RouteCollection $routes
 */
$routes->group('api', ['namespace' => 'App\Controllers\Api'], function ($routes) {

        // Add this 👇 outside 'v1' group
    $routes->post('register', 'AuthController::register');
    $routes->post('login', 'AuthController::login');
    $routes->get('public-stats', 'AuthController::publicStats');
    $routes->get('me', 'AuthController::me');
    $routes->post('change-password', 'AuthController::changePassword');
    $routes->options('register', static function () {});
    $routes->options('login', static function () {});
    $routes->options('me', static function () {});
    $routes->options('change-password', static function () {});
    
    $routes->group('v1', function ($routes) {
        $routes->options('(:any)', static function () {});

        $routes->group('core-service', ['namespace' => 'App\Controllers\Api'], function ($routes) {
        $routes->get('global_data/index1', 'GlobalDataController::index1');
        $routes->get('po_branches/ajax_all_branch_info', 'BranchController::allBranchInfo');
        $routes->post('branches', 'BranchController::create');
        $routes->delete('branches/(:num)', 'BranchController::delete/$1');
        });

        
        // Student routes
        $routes->get('students/all', 'StudentController::getAll');
        $routes->post('students/import', 'StudentController::import');
        $routes->resource('students', ['controller' => 'StudentController']);
        
        // Donation routes
        $routes->resource('donations', ['controller' => 'DonationController']);

        // Report routes
        $routes->get('report/donations', 'ReportController::donationReport');
        $routes->get('report/donations/export', 'ReportController::exportDonationReport');
    });
});