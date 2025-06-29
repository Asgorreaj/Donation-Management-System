# Assist-Pro: Micro-Finance Management System Module

## Overview
**Assist-Pro** is a micro-service crafted for the **Micro-Finance Management System**. This project currently manages the **Scholarship** module, including functionalities for handling student records and donations. It leverages CodeIgniter 4 as a RESTful API, and it is containerized through Docker to ensure scalability and security.

For more about the primary management system, visit [Microfin360](https://microfin360.com/web/).

## Key Features
- **Scholarship Management**: Manages student records and donations.
- **Extensible Design**: Future features can be added as needed.
- **Dockerized Deployment**: Facilitates easy and consistent deployment across different environments.

## Installation & Updates
To start with **Assist-Pro**, execute the following command:

```bash
git clone git@192.168.1.15:microfin-dev-next/assistpro-backend.git
```

For updates, use:

```bash
docker-compose build
```

Be sure to review the release notes for updates that may require changes in your `app` folder. Necessary modifications should be applied from `vendor/assist-pro/framework/app`.

## Setup Instructions
1. Duplicate `writable/env` to `.env` and adjust settings such as `baseURL` and database configurations.
2. Follow the directory structure as outlined in your setup instructions.

## Docker Setup
The project environment is containerized using Docker. Ensure that Docker is installed and operational on your system. Deploy the service with:

```bash
docker-compose up -d
```

This command will establish the complete environment as specified in your `docker-compose.yml` file.

## Important Configuration with index.php
The `index.php` file is located within the *public* folder. For enhanced security and organization:

- Configure your web server to serve your project from the *public* folder.
- Avoid serving the project from the root directly, as doing so exposes the index through `public/...`, reducing security.

## Contributing and Support
We utilize [Redmine](http://192.168.7.137/redmine/my/page) for **BUGS** and to track **DEVELOPMENT** work. Support and discussions on features are available on our [issue tracker](http://192.168.7.137/redmine/my/page).

For issues particular to this repository, report them on our forum or as an issue in **REDMINE**.

## Server Requirements
To operate **Assist-Pro**, ensure PHP version 8.2 or higher is installed, along with the following enabled extensions:
- [intl](http://php.net/manual/en/intl.requirements.php)
- [mbstring](http://php.net/manual/en/mbstring.installation.php)
- [json](http://php.net/manual/en/json.installation.php) (enabled by default)
- [mysqlnd](http://php.net/manual/en/mysqlnd.install.php) if utilizing MySQL
- [libcurl](http://php.net/manual/en/curl.requirements.php) if utilizing the HTTP\CURLRequest library

## PHP Version End-of-Life Information
- Upgrade to at least PHP 8.2 if you are still using PHP 7.4 or PHP 8.0, as they have reached end of life.

Please refer to the user guide for detailed insights into CodeIgniter 4's operations.
